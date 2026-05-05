import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrarRequisito: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [criterios, setCriterios] = useState('');
  const [prioridad, setPrioridad] = useState<'baja' | 'media' | 'alta'>('media');
  const [sugerencia, setSugerencia] = useState('');
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
      console.log('Requisito creado:', { nombre, descripcion, criterios, prioridad });
      setSuccess(true);
      // Reset form after success
      setNombre('');
      setDescripcion('');
      setCriterios('');
      setPrioridad('media');
      setSugerencia('');
    } catch (err) {
      setError('Error al crear el requisito');
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
            <span className="mr-2">+</span> Crear Requisito
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Crear Requisito</h1>
          <p className="text-gray-600 mb-6">
            Define un nuevo requisito funcional o técnico para el Proyecto Alpha.
          </p>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">Requisito creado exitosamente</p>
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
            {/* Nombre del requisito */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del requisito *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingrese el nombre del requisito"
              />
            </div>

            {/* Descripción detallada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción detallada *
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describa detalladamente el requisito"
              />
            </div>

            {/* Criterios de aceptación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Criterios de aceptación
              </label>
              <textarea
                value={criterios}
                onChange={(e) => setCriterios(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Defina los criterios de aceptación (opcional)"
              />
            </div>

            {/* Archivos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivos adjuntos
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-300">
                  <div className="flex flex-col items-center pt-6">
                    <span className="text-indigo-500">📎</span>
                    <p className="mt-2 text-sm text-gray-600">
                      Arrastre archivos de diseño o diagramas aquí
                    </p>
                    <button 
                      type="button"
                      className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-md hover:bg-indigo-100"
                    >
                      Explorar archivos
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Prioridad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad *
              </label>
              <select
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value as any)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccionar prioridad</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            {/* Sugerencia */}
            {sugerencia && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-blue-600">💡</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">{sugerencia}</p>
                  </div>
                </div>
              </div>
            )}

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
                type="button"
                onClick={() => {
                  // Guardar como borrador functionality
                  alert('Guardado como borrador');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Guardar como Borrador
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {loading ? 'Creando...' : 'Registrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrarRequisito;