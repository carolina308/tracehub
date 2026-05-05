import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrarCambios: React.FC = () => {
  const navigate = useNavigate();
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [persona, setPersona] = useState('');
  const [estado, setEstado] = useState<'todo' | 'in-progress' | 'done'>('todo');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app, you would call your API here
      console.log('Cambio registrado:', { descripcion, fecha, persona, estado });
      setSuccess(true);
      // Reset form after success
      setDescripcion('');
      setFecha('');
      setPersona('');
      setEstado('todo');
    } catch (err) {
      setError('Error al registrar el cambio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-2xl font-bold text-gray-800">TRACEHUB</span>
            <nav className="flex space-x-4 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-700">dashboard</a>
              <a href="#" className="hover:text-gray-700">Tablero</a>
              <a href="#" className="hover:text-gray-700">list_alt</a>
              <a href="#" className="hover:text-gray-700">Requisitos</a>
              <a href="#" className="hover:text-gray-700">person_add</a>
              <a href="#" className="hover:text-gray-700">Asignación de Tareas</a>
              <a href="#" className="hover:text-gray-700">history</a>
              <a href="#" className="hover:text-gray-700">Historial</a>
              <a href="#" className="hover:text-gray-700">fact_check</a>
              <a href="#" className="hover:text-gray-700">Validación QA</a>
              <a href="#" className="hover:text-gray-700">visibility</a>
              <a href="#" className="hover:text-gray-700">Vista de Stakeholders</a>
            </nav>
          </div>
          
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            <span className="mr-2">+</span> Registrar Cambios
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Registrar Cambios</h1>
          <p className="text-gray-600 mb-6">
            Audit and update the lifecycle of requirement specifications.
          </p>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">Cambio registrado exitosamente</p>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-600">✕</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Detalles del Cambio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detalles del Cambio
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Descripción del cambio *
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe clearly why this change was necessary and what was impacted."
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Persona
                  </label>
                  <input
                    type="text"
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Lead Dev"
                  />
                </div>
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Estado
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="todo"
                    checked={estado === 'todo'}
                    onChange={(e) => setEstado(e.target.value as any)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  To Do
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="in-progress"
                    checked={estado === 'in-progress'}
                    onChange={(e) => setEstado(e.target.value as any)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  In Progress
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="done"
                    checked={estado === 'done'}
                    onChange={(e) => setEstado(e.target.value as any)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  Done
                </label>
              </div>
            </div>

            {/* Contexto */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-blue-600">💡</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Contextual Context: System updates, timestamps, and user identification are automatically injected to maintain audit integrity.
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar y salir
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {loading ? 'Registrando...' : 'Registrar Cambio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrarCambios;