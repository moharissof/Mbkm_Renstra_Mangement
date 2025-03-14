import { DashboardContainer } from "@/components/dashboard/container"
import { CustomersCard, MonthlyTargetCard, MonthlySalesCard, OrdersCard } from "@/components/dashboard/card"
import { DashboardLayout } from "@/components/dashboard/_layout"

export default function Page() {
  return (
    <DashboardLayout>
      <DashboardContainer>
        <CustomersCard />
        <OrdersCard />
        <MonthlyTargetCard />
        <MonthlySalesCard />
      </DashboardContainer>
    </DashboardLayout>
  )
}

