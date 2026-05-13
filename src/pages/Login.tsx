import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { LogIn, Eye, EyeOff, Layout } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await api.login(email, password);
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex">
      {/* LEFT — Brand Panel */}
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
          <p className="text-blue-200 text-base mt-2">Gestión ágil del espacio de trabajo</p>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-lg mb-3">
              <Layout size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">TraceHub</h1>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-1">Iniciar sesión</h2>
          <p className="text-gray-600 text-sm mb-6">Ingresá tus credenciales para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="block w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-gray-300 px-3.5 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-2.5 rounded-xl">{error}</div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]" />
                <span className="text-sm text-gray-700">Recordarme</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/recuperar-password')}
                className="text-sm text-[#2563eb] hover:text-[#1d4ed8] font-medium transition"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Ingresando...
                </span>
              ) : (
                <><LogIn size={16} /> Iniciar sesión</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            ¿No tenés cuenta?{' '}
            <button type="button" onClick={() => navigate('/register')} className="text-[#2563eb] hover:text-[#1d4ed8] font-medium transition">
              Solicitar una cuenta
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
