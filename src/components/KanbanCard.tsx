import type { Card } from '../types/kanban';

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
      <p className="text-xs text-gray-500 mb-3">
        {card.description || 'No description'}
      </p>

      {/* TAGS */}
      <div className="flex flex-wrap gap-1 mb-3">
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
      <div className="flex justify-between items-center">

        {/* PRIORITY */}
        <span className={`text-xs px-2 py-1 rounded font-semibold ${priorityColor[card.priority as keyof typeof priorityColor] || 'bg-gray-200'}`}>
          {card.priority || 'low'}
        </span>

        {/* USER */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-[10px]">
            {card.assignee?.charAt(0) || 'U'}
          </div>
          <span>{card.assignee || 'Unassigned'}</span>
        </div>

      </div>

    </div>
  );
};

export default KanbanCard;