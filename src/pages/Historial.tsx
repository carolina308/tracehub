import { History, ArrowRight, FileText } from 'lucide-react';

const Historial = () => {
  const history =
    JSON.parse(
      localStorage.getItem("tracehub_history") || "[]"
    );

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-10">
      <div className="mb-10">
        <p className="text-sm text-gray-400 mb-2">
          TraceHub {" > "} Historial
        </p>

        <h1 className="text-4xl font-bold text-[#2563eb] tracking-tight">
          Historial de Cambios
        </h1>

        <p className="text-gray-500 mt-2">
          Seguimiento completo de movimientos y cambios realizados en los requisitos.
        </p>
      </div>

      {history.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
            <History size={28} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay movimientos registrados
          </h3>
          <p className="text-gray-500 max-w-[40ch] mx-auto">
            Los cambios realizados en el tablero aparecerán aquí automáticamente.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {history
          .slice()
          .reverse()
          .map((item: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-bold text-[#2563eb]">
                    {item.code}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-800 mt-0.5">
                    {item.title}
                  </h3>
                </div>
                <span className="text-sm text-gray-400 whitespace-nowrap ml-4">
                  {item.date}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="bg-gray-100 px-3 py-1.5 rounded-xl text-sm font-medium text-gray-600">
                  {item.from?.toUpperCase()}
                </span>
                <ArrowRight size={16} className="text-gray-400" />
                <span className="bg-[#2563eb] text-white px-3 py-1.5 rounded-xl text-sm font-medium">
                  {item.to?.toUpperCase()}
                </span>
              </div>

              {item.comment && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-1 font-medium">Comentario</p>
                  <p className="text-sm text-gray-700">{item.comment}</p>
                </div>
              )}

              {item.evidence && (
                <div className="flex items-center gap-2 text-sm text-[#2563eb]">
                  <FileText size={14} />
                  <span>{item.evidence}</span>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Historial;
