import { useState } from 'react';
import { useKanban } from '../hooks/useKanban';
import KanbanCard from '../components/KanbanCard.tsx';
import type { Card } from '../types/kanban';

const TableroKanban = () => {
  const { columns, addCard, moveCard } = useKanban();

  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [dragged, setDragged] = useState<string | null>(null);

  const handleInputChange = (columnId: string, value: string) => {
    setInputs(prev => ({ ...prev, [columnId]: value }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10 text-blue-600">
        TRACEHUB
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {columns.map(col => (
          <div
            key={col.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => dragged && moveCard(dragged, col.id)}
            className="bg-white p-4 rounded-xl shadow"
          >
            <h2 className="font-bold mb-4">{col.title}</h2>

            {col.cards.map((card: Card) => (
              <KanbanCard
                key={card.id}
                card={card}
                onDragStart={(id) => setDragged(id)}
              />
            ))}

            <input
              value={inputs[col.id] || ''}
              onChange={(e) => handleInputChange(col.id, e.target.value)}
              className="w-full border p-2 mt-2 rounded"
              placeholder="Nueva tarea"
            />

            <button
              onClick={() => {
                addCard(col.id, inputs[col.id] || '');
                handleInputChange(col.id, '');
              }}
              className="w-full mt-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
              añadir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableroKanban;