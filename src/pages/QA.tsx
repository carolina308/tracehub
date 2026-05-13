import { ShieldCheck, CheckCircle2, XCircle, ClipboardCheck } from 'lucide-react';

const QA = () => {
  const stats = [
    { label: 'Pendientes', value: '12', icon: ClipboardCheck, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    { label: 'Aprobadas', value: '85', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { label: 'Fallidas', value: '3', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    { label: 'Cobertura', value: '78%', icon: ShieldCheck, color: 'text-[#2563eb]', bg: 'bg-blue-50', border: 'border-blue-200' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-3">
      <div className="mb-3">
        <p className="text-[10px] text-gray-400 mb-0.5">Calidad</p>
        <h1 className="text-sm font-bold text-[#2563eb]">Validación de Calidad</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${s.bg} ${s.border} border rounded-lg p-3 transition-all hover:scale-[1.02]`}>
              <Icon size={15} className={s.color} />
              <p className="text-lg font-bold text-gray-900 mt-1">{s.value}</p>
              <p className="text-[10px] text-gray-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-xs font-bold text-gray-900 mb-2">Métricas</h2>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[10px] mb-0.5"><span className="text-gray-600">Aprobación</span><span className="font-semibold text-green-600">96.5%</span></div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full w-[96.5%]" /></div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] mb-0.5"><span className="text-gray-600">Cobertura</span><span className="font-semibold text-[#2563eb]">42/48</span></div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#2563eb] rounded-full w-[87.5%]" /></div>
            </div>
            <div className="flex justify-between text-[10px]"><span className="text-gray-600">Tiempo promedio</span><span className="font-semibold">2.4 días</span></div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-xs font-bold text-gray-900 mb-2">Últimas Validaciones</h2>
          <div className="space-y-1.5">
            {[
              { req: 'REQ-042', name: 'Autenticación OAuth2', result: 'aprobado' },
              { req: 'REQ-043', name: 'Exportación a PDF', result: 'aprobado' },
              { req: 'REQ-044', name: 'Notificaciones', result: 'rechazado' },
            ].map((item) => (
              <div key={item.req} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div>
                  <p className="text-[10px] font-bold text-[#2563eb]">{item.req}</p>
                  <p className="text-[11px] font-semibold text-gray-800">{item.name}</p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${item.result === 'aprobado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.result === 'aprobado' ? 'Aprobado' : 'Rechazado'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QA;
