import React, { useState } from 'react';
import Usuario from '../types/Usuario';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginSignup.css';

function Signup() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [rol, setRol] = useState('OPERADOR');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [dni, setDni] = useState('');
  const [mail, setMail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const nuevoUsuario: Usuario = {
        nombreUsuario,
        clave,
        rol,
        nombre,
        apellido,
        direccion,
        dni: Number(dni),
        mail,
        telefono
      };
      console.log('Datos enviados al backend:', nuevoUsuario);

      const response = await fetch('http://localhost:8080/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registro exitoso:', data);
        setMensaje('Registro exitoso');
        navigate('/login');
      } else if (response.status === 409) {
        console.error('Error de registro: El nombre de usuario ya está en uso.');
        setMensaje('Error de registro: El nombre de usuario ya está en uso.');
      } else {
        console.error('Error de registro:', response.statusText);
        setMensaje('Error de registro');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      setMensaje('Error al registrar');
    }
  };

return (
  <div className="signup-container">
    <div className="signup-box">
      <h2 className="signup-title">Formulario de registro</h2>
      <form onSubmit={handleSubmit} className="form" autoComplete="off">
       <label className="label">
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input"
          />
        </label>
        <label className="label">
          Apellido:
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="input"
          />
        </label>
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
          Contraseña:
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className="input"
          />
        </label>
        <label className="label">
          Dirección:
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="input"
          />
        </label>
        <label className="label">
          DNI:
          <input
            type="number"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="input"
          />
        </label>
        <label className="label">
          Email:
          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            className="input"
          />
        </label>
        <label className="label">
          Teléfono:
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="input"
          />
        </label>
        <label className="label">
          Rol:
          <select value={rol} onChange={(e) => setRol(e.target.value)} className="input">
            <option value="ADMIN">ADMIN</option>
            <option value="OPERADOR">OPERADOR</option>
          </select>
        </label>
        <div className="submit" style={{ marginTop: '15px' }}>
          <input type="submit" value="REGISTRARSE" className="submit div" autoComplete="off" />
        </div>
        <div className="div" style={{ textAlign: "center", marginTop: "10px" }}>
          <p>
            ¿Ya tienes usuario? <Link to="/login" style={{ color: 'red' }}>Inicia sesión aquí</Link>
          </p>
        </div>
        {mensaje && <p className={mensaje.startsWith('Error') ? 'error-message' : ''}>{mensaje}</p>}
      </form>
    </div>
  </div>
);


}

export default Signup;