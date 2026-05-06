import { useEffect, useState } from "react";

import KanbanColumn from "./KanbanColumn";
import MetricsRow from "./MetricsRow";
import CreateTaskModal from "./CreateTaskModal";

export interface Task {
  id: string;

  code: string;

  title: string;

  description: string;

  priority: "low" | "medium" | "high";

  acceptance?: string;

  assignee: string;

  tags: string[];

  points: number;

  status?: string;

  /* NUEVO */
  lastComment?: string;

  evidenceName?: string;

  updatedAt?: Date | string;
}
interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const KanbanBoard = () => {
  const [openModal, setOpenModal] = useState(false);

  const [columns, setColumns] = useState<Column[]>([
    {
      id: "backlog",
      title: "Backlog",
      tasks: [],
    },

    {
      id: "todo",
      title: "To Do",
      tasks: [],
    },

    {
      id: "progress",
      title: "In Progress",
      tasks: [],
    },

    {
      id: "qa",
      title: "In QA",
      tasks: [],
    },

    {
      id: "done",
      title: "Done",
      tasks: [],
    },
  ]);

  /* LOAD TASKS */
  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("tracehub_tasks") || "[]");

    const groupedColumns: Column[] = [
      {
        id: "backlog",
        title: "Backlog",
        tasks: saved.filter(
          (task: Task) =>
            !task.status || task.status === "backlog"
        ),
      },

      {
        id: "todo",
        title: "To Do",
        tasks: saved.filter(
          (task: Task) => task.status === "todo"
        ),
      },

      {
        id: "progress",
        title: "In Progress",
        tasks: saved.filter(
          (task: Task) => task.status === "progress"
        ),
      },

      {
        id: "qa",
        title: "In QA",
        tasks: saved.filter(
          (task: Task) => task.status === "qa"
        ),
      },

      {
        id: "done",
        title: "Done",
        tasks: saved.filter(
          (task: Task) => task.status === "done"
        ),
      },
    ];

    setColumns(groupedColumns);
  }, []);

  /* MOVE TASK */
  const moveTask = (
    taskId: string,
    targetColumnId: string
  ) => {
    let movedTask: Task | null = null;

    const updatedColumns = columns.map((column) => {
      const task = column.tasks.find((t) => t.id === taskId);

      if (task) {
        movedTask = {
          ...task,
          status: targetColumnId,
        };
      }

      return {
        ...column,
        tasks: column.tasks.filter((t) => t.id !== taskId),
      };
    });

    const finalColumns = updatedColumns.map((column) => {
      if (column.id === targetColumnId && movedTask) {
        return {
          ...column,
          tasks: [...column.tasks, movedTask],
        };
      }

      return column;
    });

    setColumns(finalColumns);

    /* SAVE LOCAL */
    const allTasks = finalColumns.flatMap(
      (column) => column.tasks
    );

    localStorage.setItem(
      "tracehub_tasks",
      JSON.stringify(allTasks)
    );
  };

  /* CREATE TASK */
  const createTask = (task: Task) => {
    const updated = columns.map((col) =>
      col.id === "backlog"
        ? {
            ...col,
            tasks: [...col.tasks, task],
          }
        : col
    );

    setColumns(updated);

    const allTasks = updated.flatMap(
      (column) => column.tasks
    );

    localStorage.setItem(
      "tracehub_tasks",
      JSON.stringify(allTasks)
    );

    setOpenModal(false);
  };

  return (
    <div className="p-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-sm text-gray-400 mb-2">
            Projects {" > "} TRACEHUB Dashboard
          </p>

          <h1 className="text-5xl font-bold text-[#2563eb]">
            Global Project Dashboard
          </h1>

          <p className="text-gray-500 mt-4">
            Agile project monitoring and task tracking.
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-4 rounded-2xl font-semibold transition"
        >
          + New Task
        </button>
      </div>

      {/* METRICS */}
      <MetricsRow />

      {/* KANBAN */}
      <div className="grid grid-cols-5 gap-5 mt-10">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            moveTask={moveTask}
          />
        ))}
      </div>

      {/* MODAL */}
      {openModal && (
        <CreateTaskModal
          onClose={() => setOpenModal(false)}
          onCreate={createTask}
        />
      )}
    </div>
  );
};

export default KanbanBoard;