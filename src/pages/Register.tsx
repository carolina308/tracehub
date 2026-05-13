import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { UserPlus, Layout } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '', secondLastName: '',
    dni: '', email: '', role: '', password: '', confirmPassword: '', terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'warning' | 'success' | ''; text: string }>({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/login'), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const roleOptions = [
    { value: 'PO', label: 'PO' },
    { value: 'SM', label: 'SM' },
    { value: 'Dev', label: 'Dev' },
    { value: 'QA', label: 'QA' },
    { value: 'Stakeholder', label: 'Stakeholders' },
  ];

  const getStoredUsers = () => {
    const stored = localStorage.getItem('registeredUsers');
    return stored ? JSON.parse(stored) as Array<{ email: string; firstName: string; lastName: string; role: string }> : [];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (statusMessage.type) setStatusMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!formData.firstName.trim()) newErrors.firstName = 'Primer nombre es obligatorio';
    else if (!nameRegex.test(formData.firstName.trim())) newErrors.firstName = 'Solo se permiten letras y espacios';
    if (formData.middleName.trim() && !nameRegex.test(formData.middleName.trim())) newErrors.middleName = 'Solo se permiten letras y espacios';
    if (!formData.lastName.trim()) newErrors.lastName = 'Primer apellido es obligatorio';
    else if (!nameRegex.test(formData.lastName.trim())) newErrors.lastName = 'Solo se permiten letras y espacios';
    if (formData.secondLastName.trim() && !nameRegex.test(formData.secondLastName.trim())) newErrors.secondLastName = 'Solo se permiten letras y espacios';
    if (!formData.email.trim()) newErrors.email = 'Correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = 'Verificar correo';
    if (!formData.role) newErrors.role = 'Cargo es obligatorio';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const requiredFields = ['firstName', 'lastName', 'email', 'role'] as const;
      const hasEmptyRequired = requiredFields.some(f => !formData[f].trim());
      if (hasEmptyRequired) setStatusMessage({ type: 'error', text: 'Debe diligenciar los campos obligatorios' });
      else if (newErrors.email === 'Verificar correo') setStatusMessage({ type: 'error', text: 'Verificar correo' });
      else setStatusMessage({ type: 'error', text: 'Error en los campos ingresados' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });
    if (!validateForm()) return;
    setLoading(true);
    const existingUsers = getStoredUsers();
    const emailLower = formData.email.trim().toLowerCase();
    if (existingUsers.some(user => user.email.toLowerCase() === emailLower)) {
      setStatusMessage({ type: 'warning', text: 'El usuario ya está registrado' });
      setLoading(false);
      return;
    }
    try {
      const roleMap: Record<string, string> = { PO: 'PO', SM: 'SM', Dev: 'DEV', QA: 'QA', Stakeholder: 'STAKEHOLDER' };
      await api.register({
        email: formData.email.trim(), password: formData.password, dni: formData.dni.trim() || undefined,
        phone: undefined, address: undefined, role: roleMap[formData.role] || 'DEV',
        firstName: formData.firstName.trim(), middleName: formData.middleName.trim() || undefined,
        lastName: formData.lastName.trim(), secondLastName: formData.secondLastName.trim() || undefined,
      });
      setSuccess(true);
      setStatusMessage({ type: 'success', text: 'El registro fue exitoso' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error en los campos ingresados' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "block w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all duration-300";

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
          <p className="text-blue-200 text-base mt-2">Creá tu cuenta para empezar</p>
        </div>
      </div>

      <div className="w-full lg:w-[55%] flex items-start justify-center py-8 px-6 bg-white overflow-y-auto">
        <div className="w-full max-w-lg">
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-lg mb-3">
              <Layout size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">TraceHub</h1>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-1">Crear cuenta</h2>
          <p className="text-gray-600 text-sm mb-6">Completá el formulario para registrarte</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {statusMessage.text && (
              <div className={`rounded-xl px-4 py-2.5 text-sm ${
                statusMessage.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700'
                : statusMessage.type === 'warning' ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                : 'bg-green-50 border border-green-200 text-green-700'
              }`}>
                {statusMessage.text}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-800 mb-1">Nombre <span className="text-red-500">*</span></label>
                <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} placeholder="Nombre" className={inputClass} />
                {errors.firstName && <p className="text-xs text-red-600 mt-0.5">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="middleName" className="block text-sm font-semibold text-gray-800 mb-1">Segundo nombre</label>
                <input id="middleName" name="middleName" type="text" value={formData.middleName} onChange={handleChange} placeholder="Segundo nombre" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-800 mb-1">Apellido <span className="text-red-500">*</span></label>
                <input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} placeholder="Apellido" className={inputClass} />
                {errors.lastName && <p className="text-xs text-red-600 mt-0.5">{errors.lastName}</p>}
              </div>
              <div>
                <label htmlFor="secondLastName" className="block text-sm font-semibold text-gray-800 mb-1">Segundo apellido</label>
                <input id="secondLastName" name="secondLastName" type="text" value={formData.secondLastName} onChange={handleChange} placeholder="Segundo apellido" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="dni" className="block text-sm font-semibold text-gray-800 mb-1">DNI <span className="text-red-500">*</span></label>
                <input id="dni" name="dni" type="text" required value={formData.dni} onChange={handleChange} placeholder="12345678" className={inputClass} />
                {errors.dni && <p className="text-xs text-red-600 mt-0.5">{errors.dni}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">Email <span className="text-red-500">*</span></label>
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="email@ejemplo.com" className={inputClass} />
                {errors.email && <p className="text-xs text-red-600 mt-0.5">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-800 mb-1">Cargo/Rol <span className="text-red-500">*</span></label>
              <select id="role" name="role" required value={formData.role} onChange={handleChange} className={inputClass}>
                <option value="">Seleccione su cargo</option>
                {roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {errors.role && <p className="text-xs text-red-600 mt-0.5">{errors.role}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1">Contraseña <span className="text-red-500">*</span></label>
                <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className={`${inputClass} pr-10`} />
                {errors.password && <p className="text-xs text-red-600 mt-0.5">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-1">Confirmar <span className="text-red-500">*</span></label>
                <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className={inputClass} />
                {errors.confirmPassword && <p className="text-xs text-red-600 mt-0.5">{errors.confirmPassword}</p>}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <input id="terms" name="terms" type="checkbox" required checked={formData.terms} onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.checked }))} className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]" />
              <label htmlFor="terms" className="text-sm text-gray-700">Acepto los Términos de Servicio y las Políticas de Seguridad.</label>
            </div>
            {!formData.terms && <p className="text-xs text-red-600 ml-5">Debés aceptar los términos para continuar</p>}

            <button type="submit" disabled={loading || !formData.terms} className="w-full flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Registrando...
                </span>
              ) : (<><UserPlus size={16} /> Registrar</>)}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            ¿Ya tenés cuenta?{' '}
            <button type="button" onClick={() => navigate('/login')} className="text-[#2563eb] hover:text-[#1d4ed8] font-medium transition">Iniciá sesión</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
