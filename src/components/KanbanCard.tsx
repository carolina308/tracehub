import type { Card, HistoryEntry } from '../types/kanban';

interface Props {
  card: Card;
  onDragStart: (id: string) => void;
}

const KanbanCard = ({ card, onDragStart }: Props) => {
  const priorityColor = {
    high: 'bg-red-100 text-red-600',
    medium: 'bg-yellow-100 text-yellow-600',
    low: 'bg-green-100 text-green-600',
  };

  const statusColor = {
    backlog: 'bg-gray-100 text-gray-600',
    todo: 'bg-blue-100 text-blue-600',
    INProgress: 'bg-yellow-100 text-yellow-600',
    finalizado: 'bg-green-100 text-green-600',
  };

  const statusLabel = {
    backlog: 'Backlog',
    todo: 'Por hacer',
    INProgress: 'En progreso',
    finalizado: 'Finalizado',
  };

  return (
    <div
      draggable
      onDragStart={() => onDragStart(card.id)}
      className="bg-white p-4 mb-3 rounded-xl shadow-sm hover:shadow-md transition cursor-grab border"
    >
      {/* ID */}
      <div className="text-xs text-blue-500 font-semibold mb-1">
        {card.code || 'TH-000'}
      </div>

      {/* TITLE */}
      <h3 className="font-semibold text-sm mb-2">
        {card.title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-xs text-gray-500 mb-2">
        {card.description || 'No description'}
      </p>

      {/* ACCEPTANCE CRITERIA */}
      {card.acceptance && (
        <div className="mb-2">
          <p className="text-xs font-semibold mb-1">Criterios de aceptación:</p>
          <p className="text-xs text-gray-600 italic">{card.acceptance}</p>
        </div>
      )}

      {/* TAGS */}
      <div className="flex flex-wrap gap-1 mb-2">
        {card.tags?.map((tag, i) => (
          <span
            key={i}
            className="text-xs bg-gray-200 px-2 py-1 rounded"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center text-xs">

        {/* PRIORITY */}
        <span className={`px-2 py-1 rounded font-semibold ${priorityColor[card.priority as keyof typeof priorityColor] || 'bg-gray-200'}`}>
          {card.priority || 'low'}
        </span>

        {/* STATUS */}
        <span className={`px-2 py-1 rounded font-semibold ${statusColor[card.status as keyof typeof statusColor] || 'bg-gray-200'}`}>
          {statusLabel[card.status as keyof typeof statusLabel] || card.status || 'backlog'}
        </span>

        {/* POINTS */}
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {card.points || 0} pts
        </span>

        {/* USER */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-[10px]">
            {card.assignee?.charAt(0) || 'U'}
          </div>
          <span>{card.assignee || 'Unassigned'}</span>
        </div>
      </div>

       {/* HISTORY (if exists) */}
       {card.history && card.history.length > 0 && (
         <div className="mt-3 pt-3 border-t border-gray-200">
           <p className="text-xs font-semibold mb-1">Historial:</p>
           {card.history.map((entry: HistoryEntry) => (
             <div key={entry.id} className="mb-2">
               <div className="flex justify-between text-[9px]">
                 <span>{new Date(entry.timestamp).toLocaleString()}</span>
                 <span className="font-semibold">{entry.user}</span>
               </div>
               <p className="text-[9px] text-gray-600 italic">
                 {entry.previousStatus} → {entry.newStatus}
               </p>
               {entry.comment && (
                 <p className="text-[9px] text-gray-700 mb-1">
                   Comentario: {entry.comment}
                 </p>
               )}
               {entry.evidence && (
                 <p className="text-[9px] text-gray-700">
                   Evidencia: {entry.evidence}
                 </p>
               )}
             </div>
           ))}
         </div>
       )}
    </div>
  );
};

export default KanbanCard;