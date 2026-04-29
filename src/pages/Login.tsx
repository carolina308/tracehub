import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, you would call your authentication API here
      console.log('Login successful:', { email, password });
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };


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
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electronico
            </label>
            <input
              id="email"
              type="email"
              required
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mail"
            />
          </div>
          
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="flex items-end">
              <input
                id="password"
                type={loading ? 'text' : 'password'}
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="lock"
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
          </div>
          
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Recuerdame
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Olvidaste tu contraseña?
              </a>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Signing in...' : 'Iniciar sesión'}
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-sm">
             continuar Con
          </p>
          <button
            type="button"
            className="mt-1 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
           Iniciar sesión con Google
          </button>
        </div>
        
<div className="text-center mt-4">
  <p className="text-sm text-gray-500">
    Tienes cuenta ?
    <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
     Solicitar una cuenta
    </a>
  </p>
</div>
      </div>
    </div>
  );
};

export default Login;