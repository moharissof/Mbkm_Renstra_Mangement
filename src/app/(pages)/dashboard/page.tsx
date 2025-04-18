
import { DashboardContainer } from "@/components/dashboard/container"
import { CalendarCard } from "@/components/dashboard/card"
import { DashboardLayout } from "@/components/dashboard/layout"
import RoleGuard from "@/middleware/RoleGuard"
import { Role } from "@/types/user"
import { KanbanCard } from "@/components/kanban/card"

export default function DashboardPage() {

  return (
    <RoleGuard allowedRoles={[Role.Admin, Role.Waket_1, Role.Kabag, Role.Staff_Kabag, Role.Waket_2]}>
      <DashboardLayout>
        <DashboardContainer>
          {/* Welcome Message Section */}
          <div className="col-span-full rounded-lg p-6 shadow-sm mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Selamat Datang
            </h1>
            <p className="text-gray-600">
              Selamat bekerja di Sistem Manajemen Program Kerja. Semoga hari Anda produktif!
            </p>
          </div>
          
          <KanbanCard />
          <CalendarCard />
        </DashboardContainer>
      </DashboardLayout>
    </RoleGuard>
  )
}