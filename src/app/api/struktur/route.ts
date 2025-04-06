import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@/types/user';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const scope = searchParams.get('scope') || 'jabatan'; // Default to hierarchy

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    // 1. Get current user's position data
    const currentUser = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        jabatan: {
          include: {
            bidang: true,
          },
        },
      },
    });

    if (!currentUser?.jabatan) {
      return NextResponse.json(
        { error: 'User position not found' },
        { status: 404 }
      );
    }

    // 2. Get subordinates based on scope
    let subordinateIds: string[] = [];

    if (scope === 'jabatan' && currentUser.jabatan.role === Role.Kabag) {
      // Hierarchical subordinates (Kabag)
      const getSubordinateIds = async (positionId: bigint): Promise<string[]> => {
        const subordinates = await prisma.users.findMany({
          where: { jabatan: { parent_id: positionId } },
          select: { id: true, jabatan: { select: { id: true } } },
        });

        let ids = subordinates.map((u) => u.id);
        for (const user of subordinates) {
          if (user.jabatan) {
            const childIds = await getSubordinateIds(user.jabatan.id);
            ids = [...ids, ...childIds];
          }
        }
        return ids;
      };

      subordinateIds = await getSubordinateIds(currentUser.jabatan.id);
    } 
    else if (scope === 'bidang' && [Role.Waket_1, Role.Waket_2].includes(currentUser.jabatan.role as Role)) {
      // By bidang (Waket)
      const usersInBidang = await prisma.users.findMany({
        where: {
          jabatan: { bidang_id: currentUser.jabatan.bidang_id },
          NOT: { id: userId }, // Exclude self
        },
        select: { id: true },
      });
      subordinateIds = usersInBidang.map((u) => u.id);
    }

    // 3. Get performance data for subordinates
    const subordinates = await Promise.all(
      subordinateIds.map(async (id) => {
        const user = await prisma.users.findUnique({
          where: { id },
          include: {
            jabatan: { include: { bidang: true } },
            program_kerja: true,
            laporan: {
              where: { created_at: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }, // Last 30 days
            },
          },
        });

        if (!user) return null;

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
      })
    );

    // 4. Filter out nulls and return
    const validSubordinates = subordinates.filter(Boolean);
    return NextResponse.json({ data: validSubordinates });

  } catch (error) {
    console.error('[STAFF_PERFORMANCE_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff data' },
      { status: 500 }
    );
  }
}