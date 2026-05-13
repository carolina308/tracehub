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
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border-[30px] border-white" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border-[30px] border-white" />
        </div>
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-4">
            <Layout size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">TraceHub</h1>
          <p className="text-blue-200 text-base mt-2">Recuperá el acceso a tu cuenta</p>
        </div>
      </div>

      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-lg mb-3">
              <Layout size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">TraceHub</h1>
          </div>

          <button type="button" onClick={() => navigate('/login')} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 mb-6 transition">
            <ArrowLeft size={15} />
            Volver al inicio
          </button>

          <h2 className="text-xl font-bold text-gray-900 mb-1">Recuperar contraseña</h2>
          <p className="text-gray-600 text-sm mb-6">Ingresá tu correo y te enviaremos instrucciones</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">Correo electrónico</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="email" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required placeholder="tu@correo.com" className="block w-full rounded-xl border border-gray-300 pl-9 pr-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all duration-300" />
              </div>
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              <Mail size={16} />
              Enviar recuperación
            </button>
          </form>

          {mensaje && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-xl mt-5">{mensaje}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecuperarPassword;
