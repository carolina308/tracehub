import { useKanban } from '../hooks/useKanban';
import KanbanCard from '../components/KanbanCard';
import type { Card } from '../types/kanban';

const Dashboard = () => {
  const { columns, moveCard } = useKanban();

  return (
    <div className="space-y-6">

      {/* 🔹 BREADCRUMB */}
      <div className="text-sm text-gray-400">
        Projects / <span className="text-gray-600">TRACEHUB Dashboard</span>
      </div>

      {/* 🔹 HEADER */}
      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold text-blue-600">
          Global Project Dashboard
        </h1>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          + New Task
        </button>
      </div>

      {/* 🔹 CONTROLES */}
      <div className="flex gap-4 items-center">

        <div className="flex items-center gap-2 border px-3 py-2 rounded-lg text-sm">
          Scrum Master
        </div>

        <select className="border px-3 py-2 rounded-lg text-sm">
          <option>All Team Members</option>
        </select>

      </div>

      {/* 🔹 MÉTRICAS */}
      <div className="grid grid-cols-4 gap-4">

        <Metric title="Total Requirements" value="124" />
        <Metric title="Velocity" value="42 pts/week" color="blue" />
        <Metric title="Open Blockers" value="3" color="red" />
        <Metric title="Quality Score" value="98.2%" color="green" />

      </div>

      {/* 🔹 KANBAN */}
      <div className="grid md:grid-cols-4 gap-6">

        {columns.map((col) => (
          <div
            key={col.id}
            className="bg-gray-100 p-4 rounded-xl min-h-[400px]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const cardId = e.dataTransfer.getData('cardId');
              moveCard(cardId, col.id);
            }}
          >

            <div className="flex justify-between mb-4">
              <h2 className="text-blue-600 font-semibold">
                {col.title}
              </h2>

              <span className="text-xs bg-gray-300 px-2 py-1 rounded">
                {col.cards.length}
              </span>
            </div>

            {col.cards.map((card: Card) => (
              <KanbanCard
                key={card.id}
                card={card}
                onDragStart={(id) => {
                  const e = window.event as DragEvent;
                  if (e?.dataTransfer) {
                    e.dataTransfer.setData('cardId', id);
                  }
                }}
              />
            ))}

          </div>
        ))}

      </div>

    </div>
  );
};

/* 🔹 MÉTRICAS */
const Metric = ({ title, value, color }: any) => (
  <div className="bg-white p-4 rounded-xl shadow-sm">
    <p className="text-sm text-gray-400">{title}</p>
    <h2 className={`text-xl font-bold
      ${color === 'blue' && 'text-blue-600'}
      ${color === 'red' && 'text-red-500'}
      ${color === 'green' && 'text-green-500'}
    `}>
      {value}
    </h2>
  </div>
);

export default Dashboard;