import React, { useState } from 'react';

const Register: React.FC = () => {
  
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    dni: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'warning' | 'success' | ''; text: string }>({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const saveUser = (user: { email: string; firstName: string; lastName: string; role: string }) => {
    const users = getStoredUsers();
    users.push(user);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (statusMessage.type) {
      setStatusMessage({ type: '', text: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Primer nombre es obligatorio';
    } else if (!nameRegex.test(formData.firstName.trim())) {
      newErrors.firstName = 'Solo se permiten letras y espacios';
    }

    if (formData.middleName.trim() && !nameRegex.test(formData.middleName.trim())) {
      newErrors.middleName = 'Solo se permiten letras y espacios';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Primer apellido es obligatorio';
    } else if (!nameRegex.test(formData.lastName.trim())) {
      newErrors.lastName = 'Solo se permiten letras y espacios';
    }

    if (formData.secondLastName.trim() && !nameRegex.test(formData.secondLastName.trim())) {
      newErrors.secondLastName = 'Solo se permiten letras y espacios';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Verificar correo';
    }

    if (!formData.role) {
      newErrors.role = 'Cargo es obligatorio';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const requiredErrors = (['firstName', 'lastName', 'email', 'role'] as const).some(key => {
        const value = formData[key];
        return !value.trim();
      });
      if (requiredErrors) {
        setStatusMessage({ type: 'error', text: 'Debe diligenciar los campos obligatorios' });
      } else if (newErrors.email === 'Verificar correo') {
        setStatusMessage({ type: 'error', text: 'Verificar correo' });
      } else {
        setStatusMessage({ type: 'error', text: 'Error en los campos ingresados' });
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const existingUsers = getStoredUsers();
    const emailLower = formData.email.trim().toLowerCase();
    const userAlreadyExists = existingUsers.some(user => user.email.toLowerCase() === emailLower);

    if (userAlreadyExists) {
      setStatusMessage({ type: 'warning', text: 'El usuario ya está registrado' });
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      saveUser({
        email: formData.email.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        role: formData.role,
      });
      setSuccess(true);
      setStatusMessage({ type: 'success', text: 'El registro fue exitoso' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error en los campos ingresados' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">El registro fue exitoso</h2>
          <p className="text-gray-600 mb-6">El usuario se ha registrado correctamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-white">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-800">
            TraceHub
          </h2>
          <p className="text-center text-gray-600">
            Gestión ágil del espacio de trabajo
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {statusMessage.text && (
            <div className={`rounded-md px-4 py-3 text-sm ${statusMessage.type === 'error' ? 'bg-red-50 text-red-700' : statusMessage.type === 'warning' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
              {statusMessage.text}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre  (required)
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
              {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
            </div>
            
            <div>
              <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
                Segundo nombre
              </label>
              <input
                id="middleName"
                name="middleName"
                type="text"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Middle Name"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Apellido (required)
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
              {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
            </div>
            
            <div>
              <label htmlFor="secondLastName" className="block text-sm font-medium text-gray-700 mb-1">
                Segundo apellido
              </label>
              <input
                id="secondLastName"
                name="secondLastName"
                type="text"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                value={formData.secondLastName}
                onChange={handleChange}
                placeholder="Second Last Name"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
                DNI (required)
              </label>
              <input
                id="dni"
                name="dni"
                type="text"
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                value={formData.dni}
                onChange={handleChange}
                placeholder="DNI"
              />
              {errors.dni && <p className="text-sm text-red-600 mt-1">{errors.dni}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email (required)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Cargo/Rol (required)
            </label>
            <select
              id="role"
              name="role"
              required
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Seleccione su cargo</option>
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
          </div>
          
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña (required)
            </label>
            <div className="flex items-end">
              <input
                id="password"
                name="password"
                type={loading ? 'text' : 'password'}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-0 top-0 mt-2.5 mr-2.5 flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus-indigo-600"
                onClick={() => {
                  // Toggle password visibility
                  const passwordInput = document.getElementById('password') as HTMLInputElement;
                  if (passwordInput) {
                    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
                  }
                }}
                aria-label="Show password"
              >
                {/* Eye icon would go here */}
                👁️
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>
          
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña (required)
            </label>
            <div className="flex items-end">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={loading ? 'text' : 'password'}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-0 top-0 mt-2.5 mr-2.5 flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus-indigo-600"
                onClick={() => {
                  // Toggle password visibility
                  const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
                  if (confirmPasswordInput) {
                    confirmPasswordInput.type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
                  }
                }}
                aria-label="Show password"
              >
                {/* Eye icon would go here */}
                👁️
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-4">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={formData.terms}
                onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.checked }))}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-700">
                Acepto los Términos de Servicio y las Protocolos de Seguridad.
              </label>
            </div>
          </div>
          {!formData.terms && (
            <p className="ml-5 text-sm text-red-600">
              Debes aceptar los términos para continuar
            </p>
          )}
          
          <button
            type="submit"
            disabled={loading || !formData.terms}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            <span>¿Ya tienes una cuenta? </span>
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;