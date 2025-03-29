import { DashboardContainer } from "@/components/dashboard/container"
import { CustomersCard, MonthlyTargetCard, MonthlySalesCard, OrdersCard } from "@/components/dashboard/card"
import { DashboardLayout } from "@/components/dashboard/layout"
import RoleGuard from "@/middleware/RoleGuard"
import { Role } from "@/types/user"




export default function DashboardPage() {
  return (
  <RoleGuard allowedRoles={[Role.Admin, Role.Waket_1, Role.Kabag, Role.Staff_Kabag, Role.Waket_2]}>
    <DashboardLayout>
      <DashboardContainer>
        <CustomersCard />
        <OrdersCard />
        <MonthlyTargetCard />
        <MonthlySalesCard />
      </DashboardContainer>
    </DashboardLayout>
  </RoleGuard>
  )
}

