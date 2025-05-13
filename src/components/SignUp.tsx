import React, { useState } from 'react';
import Usuario from '../types/Usuario';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginSignup.css';

function Signup() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [rol, setRol] = useState('VISOR'); 
  const [mensaje, setMensaje] = useState(''); // Nuevo estado para el mensaje
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      const nuevoUsuario: Usuario = {
        nombreUsuario,
        clave,
        rol,
      };
  
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
        setMensaje('Registro exitoso'); // Actualiza el mensaje
        navigate('/login'); 
      } else if (response.status === 409) {
        console.error('Error de registro: El nombre de usuario ya está en uso.');
        setMensaje('Error de registro: El nombre de usuario ya está en uso.'); // Actualiza el mensaje
      } else {
        console.error('Error de registro:', response.statusText);
        setMensaje('Error de registro'); // Actualiza el mensaje
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      setMensaje('Error al registrar'); // Actualiza el mensaje
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form form-padding" autoComplete='off'>
      <img className="logo" src="../../img/CASAB3.png" alt="Logo" />
      <label className='label'>
        User:       
        <input type="text" value={nombreUsuario} onChange={e => setNombreUsuario(e.target.value)} className="input" />
      </label>
      <label className='label'>
        Pass:
        <input type="password" value={clave} onChange={e => setClave(e.target.value)} className="input" />
      </label>
      <label className='label'>
        Rol:
        <select value={rol} onChange={e => setRol(e.target.value)} className="input">
          <option value="ADMIN">ADMIN</option>
          <option value="OPERADOR">OPERADOR</option>
          <option value="VISOR">VISOR</option>
        </select>
      </label >
      <div className='submit' style={{ marginTop: '15px' }}>
        <input type="submit" value="REGISTRARSE" className="submit div" autoComplete='off'/>
      </div>
      <div className= "div">
        <p>¿Ya tienes usuario? <Link to="/login" style={{ color: 'yellow' }}>Inicia sesión aquí</Link></p>
      </div>
      {mensaje && <p className={mensaje.startsWith('Error') ? 'error-message' : ''}>{mensaje}</p>} {/* Muestra el mensaje si existe */}
    </form>
  );
}

export default Signup;