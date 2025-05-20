import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Menu from './Menu';
import { AuthContext } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Perfil.css'; // Asegúrate de crear este archivo CSS

const Perfil: React.FC = () => {
  const authContext = useContext(AuthContext);
  const usuario = authContext ? authContext.usuario : undefined;
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [dni, setDni] = useState<number | null>(null);
  const [mail, setMail] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      if (!usuario || !usuario.id) {
        console.warn('Usuario no definido. Esperando datos del contexto...');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/usuarios/${usuario.id}`);
        const data = response.data;
        setNombre(data.nombre);
        setApellido(data.apellido);
        setDireccion(data.direccion);
        setDni(data.dni);
        setMail(data.mail);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [usuario]);

  const handleSave = async () => {
    if (!usuario || !usuario.id) {
      alert('Usuario no definido. No se puede guardar.');
      return;
    }

    const updatedUsuario = {
      ...usuario,
      nombre,
      apellido,
      direccion,
      dni,
      mail,
    };

    try {
      const response = await axios.put(`http://localhost:8080/usuarios/${usuario.id}`, updatedUsuario);
      if (response.status === 200) {
        alert('Perfil actualizado correctamente');
        authContext?.actualizarPerfil(response.data); // Actualizar el contexto con los nuevos datos
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Hubo un error al actualizar el perfil. Por favor, inténtalo de nuevo.');
    }
  };

  if (!usuario) {
    return <p>Cargando datos del usuario...</p>;
  }

  return (
    <div>
      <Menu />
      <div className="perfil-container" style={{ paddingTop: '140px' }}>
        <h2 className="perfil-title">Perfil del Usuario</h2>
        <div className="perfil-card">
          <div>
            <label>Nombre:</label>
            {editMode ? (
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            ) : (
              <p>{nombre}</p>
            )}
          </div>
          <div>
            <label>Apellido:</label>
            {editMode ? (
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            ) : (
              <p>{apellido}</p>
            )}
          </div>
          <div>
            <label>Dirección:</label>
            {editMode ? (
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            ) : (
              <p>{direccion}</p>
            )}
          </div>
          <div>
            <label>DNI:</label>
            {editMode ? (
              <input
                type="number"
                value={dni || ''}
                onChange={(e) => setDni(Number(e.target.value))}
              />
            ) : (
              <p>{dni}</p>
            )}
          </div>
          <div>
            <label>Email:</label>
            {editMode ? (
              <input
                type="email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
              />
            ) : (
              <p>{mail}</p>
            )}
          </div>
          {editMode ? (
            <div>
              <button onClick={handleSave}>Guardar</button>
              <button onClick={() => setEditMode(false)}>Cancelar</button>
            </div>
          ) : (
            <button onClick={() => setEditMode(true)}>Editar Perfil</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;