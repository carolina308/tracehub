import KanbanCard from "./KanbanCard";
import type { ID, BoardMember } from "../../types/api";
import type { Task } from "./KanbanBoard";

interface Props {
  column: { id: ID; title: string; tasks: Task[] };
  allColumns: { id: ID; name: string }[];
  moveTask: (taskId: ID, targetColumnId: ID) => void;
  onAddTask?: () => void;
  members?: BoardMember[];
  onAssignTask?: (taskId: ID, assigneeId: ID | null) => void;
}

const KanbanColumn = ({ column, allColumns, moveTask, onAddTask, members, onAssignTask }: Props) => {
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    moveTask(Number(e.dataTransfer.getData("taskId")), column.id);
  };

  return (
    <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop}
      className="bg-[#eef2f7] rounded-lg p-2 min-h-[200px] flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-[#2563eb] text-[11px]">{column.title}</h2>
        <span className="bg-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">{column.tasks.length}</span>
      </div>
      <div className="flex-1 space-y-1.5 overflow-y-auto">
        {column.tasks.map(task => (
          <KanbanCard key={task.id} task={task} columns={allColumns} onMoveTask={moveTask} members={members} onAssignTask={onAssignTask} />
        ))}
      </div>
      {onAddTask && (
        <button onClick={onAddTask} className="mt-2 w-full py-1 text-[10px] text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition">
          + Añadir
        </button>
      )}
    </div>
  );
};

export default KanbanColumn;
