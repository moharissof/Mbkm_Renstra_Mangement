import { ArrowDown, ArrowUp, Box, MoreVertical, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CustomersCard() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
          <Users className="h-6 w-6 text-gray-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-600">Customers</h3>
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-bold">3,782</h2>
        <div className="flex items-center gap-1 text-green-500 bg-green-50 px-2 py-1 rounded-full text-sm">
          <ArrowUp className="h-3 w-3" />
          <span>11.01%</span>
        </div>
      </div>
    </div>
  )
}

export function OrdersCard() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
          <Box className="h-6 w-6 text-gray-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-600">Orders</h3>
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-bold">5,359</h2>
        <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-full text-sm">
          <ArrowDown className="h-3 w-3" />
          <span>9.05%</span>
        </div>
      </div>
    </div>
  )
}

export function MonthlyTargetCard() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm lg:row-span-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold">Monthly Target</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
      <p className="text-gray-500 mb-6">Target you&apos;ve set for each month</p>

      <div className="flex justify-center mb-4">
        <div className="relative h-48 w-48 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="10"
              strokeDasharray="251.2"
              strokeDashoffset="62.8"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">75.55%</span>
            <span className="text-green-500">+10%</span>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-600 mb-6">
        You earn $3287 today, it&apos;s higher than last month. Keep up your good work!
      </p>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-gray-500 mb-1">Target</p>
          <div className="flex items-center justify-center gap-1 font-bold">
            $20K
            <ArrowDown className="h-3 w-3 text-red-500" />
          </div>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Revenue</p>
          <div className="flex items-center justify-center gap-1 font-bold">
            $20K
            <ArrowUp className="h-3 w-3 text-green-500" />
          </div>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Today</p>
          <div className="flex items-center justify-center gap-1 font-bold">
            $20K
            <ArrowUp className="h-3 w-3 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function MonthlySalesCard() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm md:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Monthly Sales</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      <div className="h-64">
        <div className="h-full flex items-end gap-2">
          {[150, 170, 530, 180, 280, 170, 180, 280, 100, 200, 530, 220, 100].map((height, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-500 rounded-sm" style={{ height: `${height / 6}%` }}></div>
              <span className="text-xs text-gray-500 mt-2">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index % 12]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

