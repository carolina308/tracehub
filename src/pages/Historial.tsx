import { History, ArrowRight, FileText } from 'lucide-react';

const Historial = () => {
  const history = JSON.parse(localStorage.getItem("tracehub_history") || "[]");

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-3">
      <div className="mb-3">
        <p className="text-[10px] text-gray-500 mb-0.5">TraceHub &gt; Historial</p>
        <h1 className="text-sm font-bold text-[#2563eb]">Historial de Cambios</h1>
      </div>

      {history.length === 0 && (
        <div className="bg-white rounded-lg p-5 text-center shadow-sm border border-gray-100">
          <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg mb-1.5">
            <History size={15} className="text-gray-500" />
          </div>
          <h3 className="text-xs font-semibold text-gray-800 mb-0.5">No hay movimientos</h3>
          <p className="text-gray-600 text-[11px]">Los cambios aparecerán aquí automáticamente.</p>
        </div>
      )}

      <div className="space-y-1.5">
        {history.slice().reverse().map((item: any, index: number) => (
          <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-1.5">
              <div>
                <p className="text-[10px] font-bold text-[#2563eb]">{item.code}</p>
                <h3 className="text-xs font-semibold text-gray-900 mt-0.5">{item.title}</h3>
              </div>
              <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">{item.date}</span>
            </div>
            <div className="flex items-center gap-1 mb-1.5">
              <span className="bg-gray-100 px-1.5 py-0.5 rounded-md text-[10px] font-medium text-gray-700">{item.from?.toUpperCase()}</span>
              <ArrowRight size={10} className="text-gray-500" />
              <span className="bg-[#2563eb] text-white px-1.5 py-0.5 rounded-md text-[10px] font-medium">{item.to?.toUpperCase()}</span>
            </div>
            {item.comment && (
              <div className="mb-1">
                <p className="text-[10px] text-gray-500 mb-0.5 font-medium">Comentario</p>
                <p className="text-[11px] text-gray-800">{item.comment}</p>
              </div>
            )}
            {item.evidence && (
              <div className="flex items-center gap-1 text-[11px] text-[#2563eb]">
                <FileText size={10} />
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
