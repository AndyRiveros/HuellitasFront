import React, { useState, useContext } from 'react';
import { sha1 } from 'js-sha1';
import Usuario from '../types/Usuario';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import '../styles/LoginSignup.css';

function AdminLogin() {
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

      const usuario = usuarios.find(
        (usuario) =>
          usuario.nombreUsuario === nombreUsuario &&
          usuario.clave === claveEncriptada &&
          (usuario.rol === 'ADMIN' || usuario.rol === 'SUBADMIN')
      );

      if (usuario) {
        iniciarSesion(usuario);
        // Redirige a donde quieras, por ejemplo, a un dashboard de admin
        navigate('/home');
      } else {
        setMensaje('Usuario y/o contraseña inválidos o no tienes permisos de administrador.');
      }
    } catch (error) {
      setMensaje('Error al iniciar sesión.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Login de Administrador</h2>
        <form onSubmit={handleSubmit} className="form" autoComplete="off">
          <label className="label">
            Usuario:
            <input type="text" value={nombreUsuario} onChange={e => setNombreUsuario(e.target.value)} className="input" />
          </label>
          <label className="label">
            Contraseña:
            <input type="password" value={clave} onChange={e => setClave(e.target.value)} className="input" />
          </label>
          <div className="submit" style={{ marginTop: '15px' }}>
            <input type="submit" value="INGRESAR" className="submit div" autoComplete="off" />
          </div>
          {mensaje && <p className="error-message">{mensaje}</p>}
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;