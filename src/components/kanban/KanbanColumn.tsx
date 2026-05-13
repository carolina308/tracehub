import KanbanCard from "./KanbanCard";
import type { ID } from "../../types/api";
import type { Task } from "./KanbanBoard";

interface ColumnInfo {
  id: ID;
  name: string;
}

interface Column {
  id: ID;
  title: string;
  tasks: Task[];
}

interface Props {
  column: Column;
  allColumns: ColumnInfo[];
  moveTask: (taskId: ID, targetColumnId: ID) => void;
  onAddTask?: () => void;
}

const KanbanColumn = ({ column, allColumns, moveTask, onAddTask }: Props) => {
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    moveTask(Number(taskId), column.id);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="bg-[#eef2f7] rounded-3xl p-4 min-h-[550px] flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-[#2563eb] text-xl">
          {column.title}
        </h2>

        <span className="bg-white text-xs px-2 py-1 rounded-full">
          {column.tasks.length}
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {column.tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            columns={allColumns}
            onMoveTask={moveTask}
          />
        ))}
      </div>

      {onAddTask && (
        <button
          onClick={onAddTask}
          className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          + Añadir requisito
        </button>
      )}
    </div>
  );
};

export default KanbanColumn;