// src/components/ResetPassword.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/LoginSignup.css';

function ResetPassword() {
  const [params] = useSearchParams();
  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const token = params.get('token');

  useEffect(() => {
    if (!token) {
      setMensaje('Token inválido o faltante.');
    }
  }, [token]);

  const cumpleLongitud = nuevaClave.length >= 6;
  const tieneMayuscula = /[A-Z]/.test(nuevaClave);
  const tieneMinuscula = /[a-z]/.test(nuevaClave);
  const tieneNumero = /\d/.test(nuevaClave);

  const esValida = cumpleLongitud && tieneMayuscula && tieneMinuscula && tieneNumero;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!esValida) {
      setMensaje('La contraseña no cumple con los requisitos.');
      return;
    }

    if (nuevaClave !== confirmarClave) {
      setMensaje('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/usuarios/resetear-contrasena', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, nuevaClave }),
      });

      const data = await response.text();

      if (response.ok) {
        setMensaje('Contraseña actualizada correctamente.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMensaje(data || 'No se pudo actualizar la contraseña.');
      }
    } catch (error) {
      console.error(error);
      setMensaje('Error al conectar con el servidor.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={handleSubmit} className="form form-padding login-box">
          <img className="logo" src="../../img/logo.jpg" alt="Logo" />
          <h2 style={{ marginBottom: '20px' }}>Restablecer contraseña</h2>

          <label className="label">
            Nueva contraseña:
            <input
              type="password"
              value={nuevaClave}
              onChange={(e) => setNuevaClave(e.target.value)}
              className="input"
              required
            />
          </label>

          {/* Validación en tiempo real */}
          <ul style={{ fontSize: '0.9rem', paddingLeft: '20px', marginTop: '10px' }}>
            <li style={{ color: cumpleLongitud ? 'green' : 'red' }}>Mínimo 6 caracteres</li>
            <li style={{ color: tieneMayuscula ? 'green' : 'red' }}>Al menos una mayúscula</li>
            <li style={{ color: tieneMinuscula ? 'green' : 'red' }}>Al menos una minúscula</li>
            <li style={{ color: tieneNumero ? 'green' : 'red' }}>Al menos un número</li>
          </ul>

          <label className="label" style={{ marginTop: '10px' }}>
            Confirmar contraseña:
            <input
              type="password"
              value={confirmarClave}
              onChange={(e) => setConfirmarClave(e.target.value)}
              className="input"
              required
            />
          </label>

          <div className="submit" style={{ marginTop: '15px' }}>
            <input type="submit" value="Guardar nueva contraseña" className="submit div" />
          </div>

          {mensaje && (
            <p style={{ color: mensaje.includes('correctamente') ? 'green' : 'red', marginTop: '15px' }}>
              {mensaje}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
