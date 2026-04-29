import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, id, value, type } = e.target;
    const fieldName = name || id;
    setFormData(prev => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? e.target.checked : value,
    }));
    // Clear error for this field when user types
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dni.trim()) newErrors.dni = 'DNI is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app, you would call your registration API here
      console.log('Registration successful:', formData);
      setSuccess(true);
      // Redirect to login after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Cuenta creada exitosamente</h2>
          <p className="text-gray-600 mb-6">En breve serás redirigido a la página de inicio de sesión..</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
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
              Role (required)
            </label>
            <select
              id="role"
              name="role"
              required
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Selecione su rol profesional</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Engineering Lead">Engineering Lead</option>
              <option value="QA Validator">QA Validator</option>
              <option value="Stakeholder">Stakeholder</option>
              <option value="Full-stack Developer">Full-stack Developer</option>
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
            {loading ? 'Creating account...' : 'Create Account'}
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