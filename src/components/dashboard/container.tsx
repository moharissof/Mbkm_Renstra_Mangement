import type { ReactNode } from "react"

interface DashboardContainerProps {
  children: ReactNode
}

export function DashboardContainer({ children }: DashboardContainerProps) {
  return (
    <main className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
    </main>
  )
}

