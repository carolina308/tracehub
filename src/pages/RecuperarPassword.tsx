import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Layout } from 'lucide-react';

const RecuperarPassword = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('Si el correo existe, se enviaron instrucciones de recuperación.');
  };

  return (
    <div className="min-h-[100dvh] flex">
      {/* LEFT — Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-[40px] border-white" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full border-[40px] border-white" />
        </div>
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <Layout size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">TraceHub</h1>
          <p className="text-blue-200 text-lg mt-3">Recuperá el acceso a tu cuenta</p>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-xl mb-4">
              <Layout size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">TraceHub</h1>
          </div>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-8 transition"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Recuperar contraseña</h2>
          <p className="text-gray-500 text-sm mb-8">Ingresá tu correo y te enviaremos instrucciones</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  placeholder="tu@correo.com"
                  className="block w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mail size={18} />
              Enviar recuperación
            </button>
          </form>

          {mensaje && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-xl mt-6">
              {mensaje}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecuperarPassword;
