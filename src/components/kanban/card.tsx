import { KanbanBoard } from "./board"

export function KanbanCard() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2 h-[calc(100vh-12rem)]">
      <div className="h-full overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1">
          <KanbanBoard />
        </div>
      </div>
    </div>
  )
}