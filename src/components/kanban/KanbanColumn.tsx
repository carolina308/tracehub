import KanbanCard from "./KanbanCard";
import type { Task } from "./KanbanBoard";

interface Props {
  column: {
    id: string;
    title: string;
    tasks: Task[];
  };

  moveTask: (taskId: string, targetColumnId: string) => void;
}

const KanbanColumn = ({ column, moveTask }: Props) => {
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const taskId = e.dataTransfer.getData("taskId");

    moveTask(taskId, column.id);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="bg-[#eef2f7] rounded-3xl p-4 min-h-[550px]"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-[#2563eb] text-xl">
          {column.title}
        </h2>

        <span className="bg-white text-xs px-2 py-1 rounded-full">
          {column.tasks.length}
        </span>
      </div>

      <div className="space-y-4">
        {column.tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;