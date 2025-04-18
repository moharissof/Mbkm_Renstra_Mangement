"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { Task } from "./board"
import type { ComponentType } from "react"

interface KanbanColumnProps {
  id: string
  title: string
  count: number
  tasks: Task[]
  taskComponent: ComponentType<{ task: Task }>
}

export function KanbanColumn({ id, title, count, tasks, taskComponent: TaskComponent }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div 
      ref={setNodeRef} 
      className={`flex flex-col h-full rounded-lg bg-gray-50 p-3 ${isOver ? "ring-1 ring-blue-300" : ""}`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-medium text-sm uppercase tracking-wide text-gray-500">
          {title} • {count}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskComponent key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}