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

  return (
    <form onSubmit={handleSubmit} className="form form-padding">
      <img className="logo" src="../../img/CASAB3.png" alt="Logo" />
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
      <div className="div">
        <p>
          No tienes un usuario?{' '}
          <Link to="/" style={{ color: 'yellow' }}>
            Regístrate aquí
          </Link>
        </p>
      </div>
      {mensaje && (
        <p className={mensaje === 'Usuario y/o contraseña inválidos' ? 'error-message' : ''}>
          {mensaje}
        </p>
      )}
    </form>
  );
}

export default Login;