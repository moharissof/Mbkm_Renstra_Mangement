'use client';
import { MoreVertical, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, FolderPlus,  FolderDown, Bell, CheckCircle, Clock  } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"


import { cn } from "@/lib/utils"

export function CustomersCard() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
          <FolderPlus className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-gray-600">Proker Selesai</h3>
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-bold">10</h2>
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
          <FolderDown className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-600">Proker Belum Dikerjakan</h3>
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-bold">5</h2>
        <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-full text-sm">
          <ArrowDown className="h-3 w-3" />
          <span>9.05%</span>
        </div>
      </div>
    </div>
  )
}

export function MonthlyTargetCard() {
  const [date, setDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const nextMonth = () => {
    const next = new Date(currentMonth)
    next.setMonth(next.getMonth() + 1)
    setCurrentMonth(next)
  }

  const prevMonth = () => {
    const prev = new Date(currentMonth)
    prev.setMonth(prev.getMonth() - 1)
    setCurrentMonth(prev)
  }

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayIndex = firstDayOfMonth.getDay() // 0 = Sunday, 1 = Monday, etc.

  // Get days from previous month to fill the first row
  const daysFromPrevMonth = startingDayIndex
  const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate()

  // Get days for next month to fill the last row
  const daysFromNextMonth = 42 - (daysFromPrevMonth + daysInMonth) // 42 = 6 rows * 7 days

  // Check if a date is today
  const isToday = (year: number, month: number, day: number) => {
    const today = new Date()
    return year === today.getFullYear() && month === today.getMonth() && day === today.getDate()
  }

  // Check if a date is selected
  const isSelected = (year: number, month: number, day: number) => {
    return year === date.getFullYear() && month === date.getMonth() && day === date.getDate()
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []
    const currentYear = currentMonth.getFullYear()
    const currentMonthIndex = currentMonth.getMonth()

    // Previous month days
    for (let i = 0; i < daysFromPrevMonth; i++) {
      const day = prevMonthLastDay - daysFromPrevMonth + i + 1
      const prevMonth = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1
      const prevYear = currentMonthIndex === 0 ? currentYear - 1 : currentYear

      days.push({
        day,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        isToday: isToday(prevYear, prevMonth, day),
        isSelected: isSelected(prevYear, prevMonth, day),
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: currentMonthIndex,
        year: currentYear,
        isCurrentMonth: true,
        isToday: isToday(currentYear, currentMonthIndex, i),
        isSelected: isSelected(currentYear, currentMonthIndex, i),
      })
    }

    // Next month days
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const nextMonth = currentMonthIndex === 11 ? 0 : currentMonthIndex + 1
      const nextYear = currentMonthIndex === 11 ? currentYear + 1 : currentYear

      days.push({
        day: i,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isToday: isToday(nextYear, nextMonth, i),
        isSelected: isSelected(nextYear, nextMonth, i),
      })
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  // Handle date selection
  const handleDateSelect = (year: number, month: number, day: number) => {
    setDate(new Date(year, month, day))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm lg:row-span-2 overflow-hidden border border-gray-100">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h3 className="text-lg font-bold">Kalender</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Month Navigation */}
      <div className="px-6 pt-5 pb-2 text-center">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold">
            {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
          </h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="px-6 pb-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDateSelect(day.year, day.month, day.day)}
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center text-sm",
                !day.isCurrentMonth && "text-gray-400",
                day.isSelected && !day.isToday && "bg-primary text-white",
                day.isToday && "bg-blue-500 text-white font-bold",
                !day.isSelected && !day.isToday && "hover:bg-gray-100",
              )}
            >
              {day.day}
            </button>
          ))}
        </div>
      </div>

      {/* Informational Section */}
      <div className="grid grid-cols-3 gap-4 p-5 mt-2 border-t border-gray-100">
        <div className="flex flex-col items-center">
          <p className="text-gray-500 text-sm mb-1">Proker</p>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold">5</span>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </div>
        </div>
        <div className="flex flex-col items-center border-x border-gray-100">
          <p className="text-gray-500 text-sm mb-1">Selesai</p>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold">3</span>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-gray-500 text-sm mb-1">Pending</p>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold">2</span>
            <ArrowDown className="h-4 w-4 text-red-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
export function MonthlySalesCard() {
  // Dummy data for reminders
  const reminders = [
    {
      id: 1,
      title: "Proker Membuat Laporan",
      time: "10:00 AM",
      status: "upcoming", // upcoming, completed, or missed
    },
    {
      id: 2,
      title: "Submit Monthly Report",
      time: "12:00 PM",
      status: "completed",
    },
    {
      id: 3,
      title: "Team Standup",
      time: "02:00 PM",
      status: "upcoming",
    },
    {
      id: 4,
      title: "Review Project Plan",
      time: "04:00 PM",
      status: "missed",
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm md:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Pengingat</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Reminder List */}
      <div className="space-y-4">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              {/* Icon based on status */}
              {reminder.status === "completed" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : reminder.status === "missed" ? (
                <Clock className="h-5 w-5 text-red-500" />
              ) : (
                <Bell className="h-5 w-5 text-blue-500" />
              )}

              {/* Reminder Details */}
              <div>
                <p className="font-medium">{reminder.title}</p>
                <p className="text-sm text-gray-500">{reminder.time}</p>
              </div>
            </div>

            {/* Status Badge */}
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                reminder.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : reminder.status === "missed"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {reminder.status === "completed"
                ? "Completed"
                : reminder.status === "missed"
                ? "Missed"
                : "Upcoming"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

