import React, { useState, useContext } from 'react';
import { sha1 } from 'js-sha1';
import Usuario from '../types/Usuario';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import '../styles/LoginSignup.css';

function Login() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('useAuth debe estar dentro del proveedor AuthContext');
  }

  const { iniciarSesion } = auth;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/usuarios');
      const usuarios: Usuario[] = await response.json();

      // Encripta la clave ingresada a SHA-1 y luego a Base64
      const hash = sha1.array(clave);
      const claveEncriptada = btoa(String.fromCharCode(...hash));
      console.log('Clave encriptada:', claveEncriptada);

      const usuario = usuarios.find(
        (usuario) =>
          usuario.nombreUsuario === nombreUsuario && usuario.clave === claveEncriptada
      );

      if (usuario) {
        console.log('Inicio de sesión exitoso:', usuario);
        iniciarSesion(usuario); // Pasa el objeto completo del usuario
        navigate('/home');
      } else {
        console.error('Error de inicio de sesión: usuario no encontrado');
        setMensaje('Usuario y/o contraseña inválidos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  // Botón para ir al login especial de administrador
  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={handleSubmit} className="form form-padding login-box">
          <img className="logo" src="../../img/logo.jpg" alt="Logo" />
          <label className="label">
            User:
            <input
              type="text"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="input"
            />
          </label>
          <label className="label">
            Pass:
            <input
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="input"
            />
          </label>
          <div className="submit" style={{ marginTop: '15px' }}>
            <input type="submit" value="INICIAR SESIÓN" className="submit div" />
          </div>

          {/* 🔹 Enlace para recuperar contraseña */}
          <div className="div" style={{ marginTop: '10px' }}>
            <Link to="/forgot-password" style={{ color: 'blue', textDecoration: 'underline' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="div">
            <p>
              ¿No tienes un usuario?{' '}
              <Link to="/SignUp" style={{ color: 'RED' }}>
                Regístrate aquí
              </Link>
            </p>
          </div>
          <div className="div" style={{ marginTop: '15px' }}>
            <Link to="/home" style={{ color: 'blue', textDecoration: 'underline' }}>
              Continuar a la web sin registrarme
            </Link>
            <p style={{ fontSize: '0.9em', color: '#555', marginTop: '5px' }}>
              (Recuerda que solo podrás realizar compras si cuentas con usuario)
            </p>
          </div>
          {mensaje && (
            <p className={mensaje === 'Usuario y/o contraseña inválidos' ? 'error-message' : ''}>
              {mensaje}
            </p>
          )}
        </form>
        {/* Botón para login de administrador */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            type="button"
            className="admin-login-btn"
            style={{
              background: '#b71c1c',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            onClick={handleAdminLogin}
          >
            SOY ADMINISTRADOR
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;