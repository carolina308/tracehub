import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ValidarCalidad: React.FC = () => {
  const navigate = useNavigate();
  const [requisitoSeleccionado, setRequisitoSeleccionado] = useState('');
  const [resultado, setResultado] = useState<'aprobado' | 'rechazado' | ''>('');
  const [observaciones, setObservaciones] = useState('');
  const [documentoEnlace, setDocumentoEnlace] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for requirements
  const requisitos = [
    { id: 'REQ-001', nombre: 'Autenticación OAuth2' },
    { id: 'REQ-002', nombre: 'Exportación a PDF de reportes' },
    { id: 'REQ-003', nombre: 'Notificaciones en tiempo real' },
  ];

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    // Validate: if rejected, observations are required
    if (resultado === 'rechazado' && !observaciones.trim()) {
      setError('Las observaciones de prueba son obligatorias si el resultado es rechazado');
      setLoading(false);
      return;
    }
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app, you would call your API here
      console.log('Validación guardada:', { requisitoSeleccionado, resultado, observaciones, documentoEnlace });
      setSuccess(true);
      // Reset form after success
      setRequisitoSeleccionado('');
      setResultado('');
      setObservaciones('');
      setDocumentoEnlace('');
    } catch (err) {
      setError('Error al guardar la validación');
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
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Validar Calidad</h1>
          <p className="text-gray-600 mb-6">
            Realiza el control de aseguramiento para los requisitos de software.
          </p>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">Validación de calidad guardada</p>
                  <p className="text-sm text-gray-500">El registro se ha actualizado correctamente en el sistema de trazabilidad.</p>
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
                <option value="">Elige un requisito pendiente...</option>
                {requisitos.map(req => (
                  <option key={req.id} value={req.id}>
                    {req.id}: {req.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Seleccionar resultado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar resultado
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="aprobado"
                    checked={resultado === 'aprobado'}
                    onChange={(e) => setResultado(e.target.value as any)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  Aprobado
                  <span className="text-xs text-gray-500 ml-1">Cumple con los criterios.</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="rechazado"
                    checked={resultado === 'rechazado'}
                    onChange={(e) => setResultado(e.target.value as any)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  Rechazado
                  <span className="text-xs text-gray-500 ml-1">Requiere ajustes técnicos.</span>
                </label>
              </div>
            </div>

            {/* Observaciones de prueba */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones de prueba
                <span className="text-xs text-gray-500">
                  {resultado === 'rechazado' && '* Obligatorio si es rechazado'}
                </span>
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingrese observaciones de prueba..."
              />
            </div>

            {/* Enlace al documento de prueba */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enlace al documento de prueba
              </label>
              <input
                type="text"
                value={documentoEnlace}
                onChange={(e) => setDocumentoEnlace(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingrese el enlace al documento de prueba..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {loading ? 'Guardando...' : 'Guardar Validación'}
              </button>
            </div>
          </form>

          {/* Analytics: Estado de Sprint */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Estado de Sprint
            </h2>
            <div className="flex justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Requisitos Validados
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  78%
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Aprobados
                </p>
                <p className="text-2xl font-bold text-indigo-600">
                  14
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Rechazados
                </p>
                <p className="text-2xl font-bold text-indigo-600">
                  3
                </p>
              </div>
            </div>
          </div>

          {/* Ayuda Técnica */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Ayuda Técnica
            </h2>
            <p className="text-sm text-gray-600">
              Asegúrate de adjuntar el log de errores si el resultado es rechazado. Esto ayuda al equipo de desarrollo a solucionar el bug más rápido.
            </p>
            <p className="mt-2">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Guía de calidad →
              </a>
            </p>
          </div>

          {/* Cloud upload */}
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <span className="text-indigo-500">☁️</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Subir evidencias
                </p>
                <p className="text-xs text-gray-500">
                  Arrastra archivos aquí o haz clic para buscarlos (.pdf, .png, .zip)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidarCalidad;