import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Menu from './Menu';
import { AuthContext } from '../utils/AuthContext';
import '../styles/Perfil.css';

const Perfil: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext || !authContext.usuario) {
    console.warn("Usuario no definido en AuthContext. No se puede cargar el perfil.");
    return <p>Cargando datos del usuario...</p>;
  }

  const usuario = authContext.usuario;

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [dni, setDni] = useState<number | null>(null);
  const [mail, setMail] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagen, setImagen] = useState<File | null>(null);
  const [imagenPerfilUrl, setImagenPerfilUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/usuarios/${usuario.id}`);
        const data = response.data;
        setNombre(data.nombre);
        setApellido(data.apellido);
        setDireccion(data.direccion);
        setDni(data.dni);
        setMail(data.mail);
if (data.imagenPerfil && typeof data.imagenPerfil === "string" && data.imagenPerfil.trim() !== "") {
  setImagenPerfilUrl(`http://localhost:8080${data.imagenPerfil}`);
} else {
  setImagenPerfilUrl(null);
}
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [usuario]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImagen(event.target.files[0]);
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
  event.preventDefault();
  if (!imagen) {
    alert("Selecciona una imagen primero.");
    return;
  }

  const formData = new FormData();
  formData.append("imagen", imagen);

  try {
    const response = await axios.post(
      `http://localhost:8080/usuarios/subir-imagen/${usuario.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const rutaImagen = response.data;
    setImagenPerfilUrl(`http://localhost:8080${rutaImagen}`);
    alert("Imagen subida con éxito.");
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    alert("Hubo un problema al subir la imagen.");
  }
};


  const handleSave = async () => {
    const updatedUsuario = { ...usuario, nombre, apellido, direccion, dni, mail };
    try {
      const response = await axios.put(`http://localhost:8080/usuarios/${usuario.id}`, updatedUsuario);
      if (response.status === 200) {
        alert("Perfil actualizado correctamente");
        authContext.actualizarPerfil(response.data);
        setEditMode(false);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error al actualizar el perfil:", error.response?.data || error.message);
      } else {
        console.error("Error al actualizar el perfil:", error);
      }
      alert("Hubo un error al actualizar el perfil.");
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <Menu />
      <div className="profile-wrapper">
        <h2 className="profile-title">Perfil del Usuario</h2>
        <div className="profile-card">
          {/* Columna izquierda: Datos del usuario */}
          <div className="profile-left">
            <div className="profile-field">
              <label>Nombre:</label>
              {editMode ? (
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              ) : (
                <span>{nombre}</span>
              )}
            </div>
            <div className="profile-field">
              <label>Apellido:</label>
              {editMode ? (
                <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} />
              ) : (
                <span>{apellido}</span>
              )}
            </div>
            <div className="profile-field">
              <label>Dirección:</label>
              {editMode ? (
                <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
              ) : (
                <span>{direccion}</span>
              )}
            </div>
            <div className="profile-field">
              <label>DNI:</label>
              {editMode ? (
                <input type="number" value={dni || ""} onChange={(e) => setDni(Number(e.target.value))} />
              ) : (
                <span>{dni}</span>
              )}
            </div>
            <div className="profile-field">
              <label>Email:</label>
              {editMode ? (
                <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} />
              ) : (
                <span>{mail}</span>
              )}
            </div>
            <div className="profile-actions">
              {editMode ? (
                <button className="btn-save" onClick={handleSave}>Guardar</button>
              ) : (
                <button className="btn-edit" onClick={() => setEditMode(true)}>Editar Perfil</button>
              )}
            </div>
          </div>
          {/* Columna derecha: Foto de perfil y subida de imagen */}
          <div className="profile-right">
            <div className="profile-photo">
              {imagenPerfilUrl ? (
  <img src={imagenPerfilUrl} alt="Imagen de perfil" width={200} height={200} />
) : (
  <p>Sin imagen de perfil</p>
)}

            </div>
            <div className="upload-area">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <button className="btn-upload" onClick={handleUpload}>Subir Imagen</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
