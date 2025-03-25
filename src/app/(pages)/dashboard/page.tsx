import { DashboardContainer } from "@/components/Dashboard/container"
import { CustomersCard, MonthlyTargetCard, MonthlySalesCard, OrdersCard } from "@/components/Dashboard/card"
import { DashboardLayout } from "@/components/Dashboard/_layout"
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

