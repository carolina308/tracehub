import { useState } from "react";

import type { Task } from "./KanbanBoard";

import ChangeStatusModal from "./ChangeStatusModal";

interface Props {
  task: Task;
}

const KanbanCard = ({ task }: Props) => {
  const [openModal, setOpenModal] = useState(false);

 const handleStatusChange = (
  taskId: string,
  status: string,
  comment: string,
  evidence: File | null
) => {
  const stored =
    JSON.parse(
      localStorage.getItem("tracehub_tasks") || "[]"
    );

  let oldStatus = "";

  const updated = stored.map((t: Task) => {
    if (t.id === taskId) {
      oldStatus = t.status || "backlog";

      return {
        ...t,
        status,
        lastComment: comment,
        evidenceName: evidence?.name || null,
        updatedAt: new Date(),
      };
    }

    return t;
  });

  localStorage.setItem(
    "tracehub_tasks",
    JSON.stringify(updated)
  );

  /* HISTORY */
  const history =
    JSON.parse(
      localStorage.getItem("tracehub_history") || "[]"
    );

  const currentTask = updated.find(
    (t: Task) => t.id === taskId
  );

  const newHistoryItem = {
    code: currentTask?.code,
    title: currentTask?.title,
    from: oldStatus,
    to: status,
    comment,
    evidence: evidence?.name || "",
    date: new Date().toLocaleString(),
  };

  localStorage.setItem(
    "tracehub_history",
    JSON.stringify([...history, newHistoryItem])
  );

  window.location.reload();
};

   
  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
        {/* CODE */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-[#2563eb]">
            {task.code}
          </p>

          <button
            onClick={() => setOpenModal(true)}
            className="text-xs bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3 py-2 rounded-xl transition"
          >
            Cambiar Estado
          </button>
        </div>

        {/* TITLE */}
        <h3 className="font-semibold text-gray-800 mb-2">
          {task.title}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 mb-5">
          {task.description}
        </p>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mb-5">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between">
          {/* PRIORITY */}
          <span
            className={`text-xs px-3 py-1 rounded-xl font-medium ${
              task.priority === "high"
                ? "bg-red-100 text-red-600"
                : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-600"
            }`}
          >
            {task.priority}
          </span>

          {/* ASSIGNEE */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-xs">
              {task.assignee.charAt(0)}
            </div>

            <span className="text-sm text-gray-500">
              {task.assignee}
            </span>
          </div>
        </div>

        {/* LAST COMMENT */}
        {task.lastComment && (
          <div className="mt-5 bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">
              Último comentario
            </p>

            <p className="text-sm text-gray-600">
              {task.lastComment}
            </p>
          </div>
        )}

        {/* EVIDENCE */}
        {task.evidenceName && (
          <div className="mt-3 text-xs text-blue-600">
            📎 {task.evidenceName}
          </div>
        )}
      </div>

      {/* MODAL */}
      {openModal && (
        <ChangeStatusModal
          task={task}
          onClose={() => setOpenModal(false)}
          onConfirm={handleStatusChange}
        />
      )}
    </>
  );
};

export default KanbanCard;
