import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@/types/user';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Verify requester is Ketua
    const requester = await prisma.users.findUnique({
      where: { id: userId },
      include: { jabatan: true }
    });

    if (!requester?.jabatan || requester.jabatan.role !== Role.Ketua) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Get all staff except Waket, Admin, and Ketua
    const allStaff = await prisma.users.findMany({
      where: {
        jabatan: {
          role: {
            notIn: [Role.Waket_1, Role.Waket_2, Role.Admin, Role.Ketua]
          }
        }
      },
      include: {
        jabatan: { include: { bidang: true } },
        program_kerja: true,
        laporan: {
          where: { created_at: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }, // Last 30 days
        },
      },
    });

    // Format response data
    const staffData = allStaff.map(user => {
      const totalPrograms = user.program_kerja.length;
      const completedPrograms = user.program_kerja.filter(p => p.status === 'Done').length;
      const activePrograms = user.program_kerja.filter(p => 
        ['On_Progress', 'Disetujui'].includes(p.status)
      ).length;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.photo || '',
        position: user.jabatan?.nama || 'Staff',
        department: user.jabatan?.bidang?.nama || 'General',
        lastLogin: user.last_login_at?.toISOString() || '',
        stats: {
          total_programs: totalPrograms,
          programs_completed: completedPrograms,
          completion_rate: Math.round((completedPrograms / totalPrograms) * 100) || 0,
          active_programs: activePrograms,
          reports_last_month: user.laporan.length,
        },
      };
    });

    return NextResponse.json({ data: staffData });

  } catch (error) {
    console.error('[ALL_STAFF_PERFORMANCE_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff data' },
      { status: 500 }
    );
  }
}