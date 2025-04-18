/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanColumn } from "./column"
import { KanbanTask } from "./task"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Task type definition
export type Task = {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  assignee?: string
}

// Sample data
const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Create dashboard wireframes",
    description: "Design wireframes for the new dashboard layout",
    status: "todo",
    priority: "high",
    assignee: "Alex Johnson",
  },
  {
    id: "task-2",
    title: "Implement authentication",
    description: "Set up user authentication with JWT",
    status: "in-progress",
    priority: "high",
    assignee: "Sarah Miller",
  },
  {
    id: "task-3",
    title: "Write API documentation",
    description: "Document all API endpoints for the frontend team",
    status: "todo",
    priority: "medium",
    assignee: "David Chen",
  },
  {
    id: "task-4",
    title: "Fix navigation bug",
    description: "Address the navigation issue on mobile devices",
    status: "in-progress",
    priority: "medium",
    assignee: "Lisa Wong",
  },
  {
    id: "task-5",
    title: "Update dependencies",
    description: "Update all npm packages to their latest versions",
    status: "done",
    priority: "low",
    assignee: "Michael Brown",
  },
  {
    id: "task-6",
    title: "Optimize database queries",
    description: "Improve performance of slow database queries",
    status: "done",
    priority: "high",
    assignee: "James Wilson",
  },
]

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
  })

  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const doneTasks = tasks.filter((task) => task.status === "done")

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    // If dragging to a different column
    if (overId.includes("column")) {
      const newStatus = overId.replace("column-", "") as "todo" | "in-progress" | "done"
      setTasks(tasks.map((task) => (task.id === activeId ? { ...task, status: newStatus } : task)))
      return
    }

    // If reordering within the same column
    const activeIndex = tasks.findIndex((task) => task.id === activeId)
    const overIndex = tasks.findIndex((task) => task.id === overId)

    setTasks(arrayMove(tasks, activeIndex, overIndex))
  }

  function handleAddTask() {
    const newTaskWithId = {
      ...newTask,
      id: `task-${Date.now()}`,
    }

    setTasks([...tasks, newTaskWithId])
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
    })
    setIsAddTaskOpen(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kanban Board</h2>
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) => setNewTask({ ...newTask, status: value as any })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value as any })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignee">Assignee (Optional)</Label>
                <Input
                  id="assignee"
                  value={newTask.assignee || ""}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  placeholder="Assignee name"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddTask} disabled={!newTask.title}>
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          <SortableContext items={todoTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <KanbanColumn
              id="column-todo"
              title="To Do"
              count={todoTasks.length}
              tasks={todoTasks}
              taskComponent={KanbanTask}
            />
          </SortableContext>

          <SortableContext items={inProgressTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <KanbanColumn
              id="column-in-progress"
              title="In Progress"
              count={inProgressTasks.length}
              tasks={inProgressTasks}
              taskComponent={KanbanTask}
            />
          </SortableContext>

          <SortableContext items={doneTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <KanbanColumn
              id="column-done"
              title="Done"
              count={doneTasks.length}
              tasks={doneTasks}
              taskComponent={KanbanTask}
            />
          </SortableContext>
        </div>
      </DndContext>
    </div>
  )
}
