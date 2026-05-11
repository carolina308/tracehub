import React from 'react';

const QA: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Validación de Calidad</h1>
      <p className="text-gray-600">Gestión de pruebas y validación de calidad del software</p>
      
      {/* Placeholder content for QA functionality */}
      <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen de Calidad</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800">Pruebas Pendientes</h3>
            <p className="text-2xl font-bold text-blue-600">12</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800">Pruebas Aprobadas</h3>
            <p className="text-2xl font-bold text-green-600">85</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800">Pruebas Fallidas</h3>
            <p className="text-2xl font-bold text-yellow-600">3</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800">Cobertura de Pruebas</h3>
            <p className="text-2xl font-bold text-purple-600">78%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QA;