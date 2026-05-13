import React, { useState } from 'react';

const RecuperarPassword: React.FC = () => {

  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    setMensaje(
      'Si el correo existe, se enviaron instrucciones de recuperación.'
    );

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-center mb-6">
          Recuperar Contraseña
        </h1>

        <form onSubmit={handleSubmit}>

          <label className="block text-sm font-medium mb-2">
            Correo electrónico
          </label>

          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-3 mb-4"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
          >
            Enviar recuperación
          </button>

        </form>

        {mensaje && (
          <p className="text-green-600 text-sm mt-4">
            {mensaje}
          </p>
        )}

      </div>

    </div>

  );

};

export default RecuperarPassword;