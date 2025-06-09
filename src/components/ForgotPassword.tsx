import React, { useState } from 'react';
import '../styles/LoginSignup.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/usuarios/recuperar-contrasena', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMensaje('Revisa tu correo electrónico para restablecer tu contraseña.');
        setEnviado(true);
      } else {
        const data = await response.text();
        setMensaje(data || 'No se pudo enviar el correo. Verifica el email.');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setMensaje('Ocurrió un error al enviar el correo.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={handleSubmit} className="form form-padding login-box">
          <img className="logo" src="../../img/logo.jpg" alt="Logo" />
          <h2 style={{ marginBottom: '20px' }}>Recuperar contraseña</h2>

          <label className="label">
            Ingresá tu correo electrónico:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </label>

          <div className="submit" style={{ marginTop: '15px' }}>
            <input
              type="submit"
              value="Enviar enlace"
              className="submit div"
              disabled={enviado}
            />
          </div>

          {mensaje && (
            <p style={{ color: enviado ? 'green' : 'red', marginTop: '15px' }}>{mensaje}</p>
          )}

          <div className="div" style={{ marginTop: '15px' }}>
            <a href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
              Volver al inicio de sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
