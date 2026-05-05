import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AsignarRequisitos: React.FC = () => {
  const navigate = useNavigate();
  const [requisitoSeleccionado, setRequisitoSeleccionado] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data
  const requisitos = [
    { id: 'REQ-001', nombre: 'Implementación OAuth2', descripcion: 'Configuración de proveedores de identidad externos y validación JWT.', prioridad: 'Alta', estado: 'Sin Asignar' },
    { id: 'REQ-002', nombre: 'Migración de Base de Datos', descripcion: 'Traslado de esquemas relacionales de ambiente local a AWS RDS con cero downtime.', prioridad: 'Media', estado: 'Sin Asignar' },
    { id: 'REQ-003', nombre: 'Optimización de Consultas', descripcion: 'Refactorización de consultas pesadas para reducir latencia en el dashboard principal.', prioridad: 'Media', estado: 'En Proceso' },
  ];

  const usuarios = [
    { id: 'user1', nombre: 'Carlos Ruiz', rol: 'Backend Lead' },
    { id: 'user2', nombre: 'Elena Gómez', rol: 'Security Arch' },
    { id: 'user3', nombre: 'Marcos Silva', rol: 'DevOps' },
  ];

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app, you would call your API here
      console.log('Asignación realizada:', { requisitoSeleccionado, usuarioSeleccionado });
      setSuccess(true);
      // Reset form after success
      setRequisitoSeleccionado('');
      setUsuarioSeleccionado('');
    } catch (err) {
      setError('Error al asignar el requisito');
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
            <span className="mr-2">+</span> Nuevo Proyecto
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Asignar Requisitos</h1>
          <p className="text-gray-600 mb-6">
            Gestione la propiedad de los requisitos del proyecto vinculando responsables específicos para asegurar la trazabilidad y ejecución.
          </p>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">Asignación completada</p>
                  <p className="text-sm text-gray-500">El nombre del responsable ha sido asignado exitosamente al requisito seleccionado.</p>
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

          {/* Configurar Asignación */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Configurar Asignación</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Seleccionar requisito */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar requisito
                  </label>
                  <select
                    value={requisitoSeleccionado}
                    onChange={(e) => setRequisitoSeleccionado(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Elegir requisito de la lista...</option>
                    {requisitos.map(req => (
                      <option key={req.id} value={req.id}>
                        {req.id}: {req.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seleccionar usuario responsable */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar usuario responsable
                  </label>
                  <select
                    value={usuarioSeleccionado}
                    onChange={(e) => setUsuarioSeleccionado(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Buscar usuario registrado...</option>
                    {usuarios.map(usuario => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nombre} ({usuario.rol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Resumen de Carga */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Resumen de Carga</h3>
                <div className="space-y-2">
                  {/* In a real app, this would be dynamic based on the selected user */}
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">ALTA</span>
                    <span className="text-sm text-gray-500">Elena Gómez tiene 4 tareas pendientes.</span>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar y salir
                </button>
                <button
                  type="submit"
                  disabled={loading || !requisitoSeleccionado || !usuarioSeleccionado}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {loading ? 'Confirmando...' : 'Confirmar Asignación'}
                </button>
              </div>
            </form>
          </div>

          {/* Estado de Requisitos */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Estado de Requisitos</h2>
            <div className="flex space-x-4 border-b-2 border-gray-200 pb-2">
              <button
                className="px-3 py-2 text-sm font-medium 
                text-indigo-600 border-b-2 border-indigo-400"
              >
                Todos
              </button>
              <button
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Sin Asignar
              </button>
              <button
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                En Proceso
              </button>
              <button
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Completado
              </button>
            </div>
          </div>

          {/* Lista de Requisitos */}
          <div className="space-y-4">
            {requisitos.map(req => (
              <div key={req.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{req.id}: {req.nombre}</h3>
                    <p className="text-sm text-gray-600 mt-1">{req.descripcion}</p>
                    <div className="flex mt-2 space-x-3 text-xs">
                      <span className={`px-2 py-0.5 rounded 
                        ${req.prioridad === 'Alta' ? 'bg-red-100 text-red-800' 
                            : req.prioridad === 'Media' ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'}`}>
                        {req.prioridad}
                      </span>
                      <span className={`px-2 py-0.5 rounded 
                        ${req.estado === 'Sin Asignar' ? 'bg-gray-100 text-gray-800' 
                            : req.estado === 'En Proceso' ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'}`}>
                        {req.estado}
                      </span>
                    </div>
                  </div>
                  {req.estado === 'Sin Asignar' && (
                    <button
                      onClick={() => {
                        setRequisitoSeleccionado(req.id);
                        // Scroll to the form or open a modal? For simplicity, we'll just set the state and let the user select user.
                        alert('Por favor, seleccione un usuario y confirme la asignación en la sección superior.');
                      }}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                    >
                      ASIGNAR AHORA
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Total Requisitos: 124 | Sin Asignar: 12 | En Proceso: 86
            </p>
            <p className="mt-2">
              © 2023 TRACEHUB Systems. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignarRequisitos;