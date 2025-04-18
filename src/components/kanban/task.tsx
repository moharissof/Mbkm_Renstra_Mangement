"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Task } from "./board"
import { GripVertical } from "lucide-react"

interface KanbanTaskProps {
  task: Task
}

export function KanbanTask({ task }: KanbanTaskProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-md p-3 shadow-sm mb-2 border border-gray-200 ${
        isDragging ? "shadow-md ring-1 ring-blue-300" : ""
      }`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start">
          <button
            {...attributes}
            {...listeners}
            className="mr-1 text-gray-400 hover:text-gray-600"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <p className="text-sm flex-1">{task.title}</p>
        </div>
        
        {task.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          
          {task.assignee && (
            <div className="flex items-center">
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                {task.assignee.split(' ')[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}