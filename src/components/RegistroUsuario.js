import React, { useState } from 'react';

const RegistroUsuario = () => {
  const [formData, setFormData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    cargo: '',
    correo: ''
  });

  const [errors, setErrors] = useState({});
  const [messages, setMessages] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulated existing users database
  const existingUsers = [
    { correo: 'juan.perez@empresa.com' },
    { correo: 'maria.gonzalez@empresa.com' }
  ];

  // Validation functions
  const validarNombre = (valor) => {
    // Only letters and spaces allowed
    return /^[a-zA-Z\s]+$/.test(valor);
  };

  const validarCorreo = (valor) => {
    // Basic email validation: must contain @ and domain with dot
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(valor);
  };

  const validarCamposObligatorios = () => {
    const { primerNombre, primerApellido, cargo, correo } = formData;
    const errores = {};

    if (!primerNombre.trim()) errores.primerNombre = 'Este campo es obligatorio';
    if (!primerApellido.trim()) errores.primerApellido = 'Este campo es obligatorio';
    if (!cargo) errores.cargo = 'Este campo es obligatorio';
    if (!correo.trim()) errores.correo = 'Este campo es obligatorio';

    return errores;
  };

  const validarFormulario = () => {
    const erroresObligatorios = validarCamposObligatorios();
    const errores = { ...erroresObligatorios };

    // Validate name fields if they have values
    const camposNombre = ['primerNombre', 'segundoNombre', 'primerApellido', 'segundoApellido'];
    camposNombre.forEach(campo => {
      if (formData[campo] && !validarNombre(formData[campo])) {
        errores[campo] = 'Solo se permiten letras y espacios';
      }
    });

    // Validate email if it has value
    if (formData.correo && !validarCorreo(formData.correo)) {
      errores.correo = 'Formato de correo inválido';
    }

    return errores;
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear messages when user starts typing
    if (Object.keys(messages).length > 0) {
      setMensajes({});
    }
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    const errores = validarFormulario();
    setErrores(errores);
    
    if (Object.keys(errores).length > 0) {
      // Check if it's missing required fields or invalid format
      const erroresObligatorios = validarCamposObligatorios();
      const tieneErroresObligatorios = Object.keys(erroresObligatorios).length > 0;
      
      if (tieneErroresObligatorios) {
        setMensajes({ 
          tipo: 'error', 
          texto: 'Debe diligenciar los campos obligatorios' 
        });
      } else {
        setMensajes({ 
          tipo: 'error', 
          texto: 'Error en los campos ingresados' 
        });
      }
      setIsSubmitting(false);
      return;
    }

    // Check if user already exists
    const usuarioExistente = existingUsers.some(
      user => user.correo.toLowerCase() === formData.correo.toLowerCase()
    );

    if (usuarioExistente) {
      setMensajes({ 
        tipo: 'alerta', 
        texto: 'El usuario ya está registrado' 
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call to database
      // In a real application, this would be: await axios.post('/api/usuarios', formData);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      // Add to simulated database
      existingUsers.push({ correo: formData.correo });
      
      setMensajes({ 
        tipo: 'exito', 
        texto: 'El registro fue exitoso' 
      });
      
      // Reset form after successful submission
      setFormData({
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        cargo: '',
        correo: ''
      });
    } catch (error) {
      setMensajes({ 
        tipo: 'error', 
        texto: 'Error al registrar el usuario' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registro-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={manejarSubmit} noValidate>
        <div className="form-group">
          <label>Primer nombre:</label>
          <input
            type="text"
            name="primerNombre"
            value={formData.primerNombre}
            onChange={manejarCambio}
            placeholder="Ingrese su primer nombre"
          />
          {errors.primerNombre && <span className="error-message">{errors.primerNombre}</span>}
        </div>

        <div className="form-group">
          <label>Segundo nombre:</label>
          <input
            type="text"
            name="segundoNombre"
            value={formData.segundoNombre}
            onChange={manejarCambio}
            placeholder="Ingrese su segundo nombre (opcional)"
          />
          {errors.segundoNombre && <span className="error-message">{errors.segundoNombre}</span>}
        </div>

        <div className="form-group">
          <label>Primer apellido:</label>
          <input
            type="text"
            name="primerApellido"
            value={formData.primerApellido}
            onChange={manejarCambio}
            placeholder="Ingrese su primer apellido"
          />
          {errors.primerApellido && <span className="error-message">{errors.primerApellido}</span>}
        </div>

        <div className="form-group">
          <label>Segundo apellido:</label>
          <input
            type="text"
            name="segundoApellido"
            value={formData.segundoApellido}
            onChange={manejarCambio}
            placeholder="Ingrese su segundo apellido (opcional)"
          />
          {errors.segundoApellido && <span className="error-message">{errors.segundoApellido}</span>}
        </div>

        <div className="form-group">
          <label>Cargo/Rol:</label>
          <select
            name="cargo"
            value={formData.cargo}
            onChange={manejarCambio}
          >
            <option value="">Seleccione un cargo</option>
            <option value="PO">PO (Product Owner)</option>
            <option value="SM">SM (Scrum Master)</option>
            <option value="Dev">Desarrollador</option>
            <option value="QA">QA (Quality Assurance)</option>
            <option value="Stakeholders">Stakeholder</option>
          </select>
          {errors.cargo && <span className="error-message">{errors.cargo}</span>}
        </div>

        <div className="form-group">
          <label>Correo electrónico:</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={manejarCambio}
            placeholder="ejemplo@dominio.com"
          />
          {errors.correo && <span className="error-message">{errors.correo}</span>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="registrar-button"
        >
          {isSubmitting ? 'Registrando...' : 'Registrar'}
        </button>

        {/* Messages */}
        {messages.tipo && (
          <div className={`message ${messages.tipo}`}>
            {messages.texto}
          </div>
        )}
      </form>
    </div>
  );
};

export default RegistroUsuario;