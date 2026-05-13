import { ShieldCheck, CheckCircle2, XCircle, ClipboardCheck } from 'lucide-react';

const QA = () => {
  const stats = [
    { label: 'Pruebas Pendientes', value: '12', icon: ClipboardCheck, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    { label: 'Pruebas Aprobadas', value: '85', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { label: 'Pruebas Fallidas', value: '3', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    { label: 'Cobertura', value: '78%', icon: ShieldCheck, color: 'text-[#2563eb]', bg: 'bg-blue-50', border: 'border-blue-200' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-10">
      <div className="mb-10">
        <p className="text-sm text-gray-400 mb-2">
          Calidad
        </p>
        <h1 className="text-4xl font-bold text-[#2563eb] tracking-tight">
          Validación de Calidad
        </h1>
        <p className="text-gray-500 mt-2">
          Gestión de pruebas y validación de calidad del software
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${s.bg} ${s.border} border rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}>
              <div className="flex items-center justify-between mb-4">
                <Icon size={28} className={s.color} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Metrics Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Métricas de Calidad</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Tasa de aprobación</span>
                <span className="font-semibold text-green-600">96.5%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full w-[96.5%] transition-all duration-700" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Requisitos cubiertos</span>
                <span className="font-semibold text-[#2563eb]">42/48</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#2563eb] rounded-full w-[87.5%] transition-all duration-700" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Tiempo promedio de validación</span>
                <span className="font-semibold">2.4 días</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Últimas Validaciones</h2>
          <div className="space-y-4">
            {[
              { req: 'REQ-042', name: 'Autenticación OAuth2', result: 'aprobado' },
              { req: 'REQ-043', name: 'Exportación a PDF', result: 'aprobado' },
              { req: 'REQ-044', name: 'Notificaciones en tiempo real', result: 'rechazado' },
            ].map((item) => (
              <div key={item.req} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="text-xs font-bold text-[#2563eb]">{item.req}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{item.name}</p>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${
                  item.result === 'aprobado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
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
