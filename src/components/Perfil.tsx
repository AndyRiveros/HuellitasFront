import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Menu from './Menu';
import { AuthContext } from '../utils/AuthContext';
import Mascota from '../types/Mascota';
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

  // Mascotas
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [showMascotaForm, setShowMascotaForm] = useState(false);
  const [nuevaMascota, setNuevaMascota] = useState<Mascota>({ nombre: '', especie: '', raza: '', edad: undefined });

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

  // Cargar mascotas si es OPERADOR
  useEffect(() => {
    if (usuario.rol === 'OPERADOR') {
      axios.get(`http://localhost:8080/api/mascotas/usuario/${usuario.id}`)
        .then(res => setMascotas(res.data))
        .catch(() => setMascotas([]));
    }
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

  // Mascotas: Añadir
 const handleAddMascota = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // 1. Crear mascota sin imagen para obtener el ID
    const mascotaRes = await axios.post(`http://localhost:8080/api/mascotas/usuario/${usuario.id}`, {
  ...nuevaMascota,
  imagen: undefined
});
    console.log("Mascota creada:", mascotaRes.data);
const mascotaId = mascotaRes.data.id;

    // 2. Si hay imagen, subirla
    if (nuevaMascota.imagen instanceof File) {
      const formData = new FormData();
      formData.append('imagen', nuevaMascota.imagen);
      const imgRes = await axios.post(
        `http://localhost:8080/api/mascotas/subir-imagen/${mascotaId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      // 3. Actualizar la mascota con la ruta de la imagen
      await axios.put(`http://localhost:8080/api/mascotas/${mascotaId}`, { imagen: imgRes.data });
    }

    // Refresca la lista
    const res = await axios.get(`http://localhost:8080/api/mascotas/usuario/${usuario.id}`);
    setMascotas(res.data);
    setShowMascotaForm(false);
    setNuevaMascota({ nombre: '', especie: '', raza: '', edad: undefined });
  } catch (error) {
    alert("Error al crear la mascota. Revisa los datos e intenta nuevamente.");
    console.error(error);
  }
};

  // Mascotas: Eliminar
  const handleDeleteMascota = async (id: number) => {
    await axios.delete(`http://localhost:8080/api/mascotas/${id}`);
    setMascotas(mascotas.filter(m => m.id !== id));
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

        {/* Sección de mascotas solo para OPERADOR */}
        {usuario.rol === 'OPERADOR' && (
          <div className="mascotas-section">
            <h3>Mis Mascotas</h3>
            <button onClick={() => setShowMascotaForm(!showMascotaForm)} style={{marginBottom: 10}}>
              {showMascotaForm ? 'Cancelar' : '+ Añadir Mascota'}
            </button>
            {showMascotaForm && (
              <form onSubmit={handleAddMascota} className="mascota-form-modern" encType="multipart/form-data">
                <h4 className="mascota-form-title">Añadir Mascota</h4>
                <div className="mascota-form-row">
                  <div className="mascota-form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      value={nuevaMascota.nombre}
                      onChange={e => setNuevaMascota({ ...nuevaMascota, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mascota-form-group">
                    <label>Especie</label>
                    <select
                      value={nuevaMascota.especie}
                      onChange={e => setNuevaMascota({ ...nuevaMascota, especie: e.target.value, etapa: undefined, tipo: undefined })}
                      required
                    >
                      <option value="">Selecciona especie</option>
                      <option value="perro">Perro</option>
                      <option value="gato">Gato</option>
                      <option value="ave">Ave</option>
                      <option value="pez">Pez</option>
                    </select>
                  </div>
                  {['perro', 'gato'].includes(nuevaMascota.especie) && (
                    <div className="mascota-form-group">
                      <label>Etapa</label>
                      <select
                        value={nuevaMascota.etapa || ''}
                        onChange={e => setNuevaMascota({ ...nuevaMascota, etapa: e.target.value })}
                        required
                      >
                        <option value="">Selecciona etapa</option>
                        <option value="cachorro">Cachorro</option>
                        <option value="adulto">Adulto</option>
                        <option value="senior">Senior</option>
                      </select>
                    </div>
                  )}
                  {nuevaMascota.especie === 'ave' && (
                    <div className="mascota-form-group">
                      <label>Tipo de ave</label>
                      <select
                        value={nuevaMascota.tipo || ''}
                        onChange={e => setNuevaMascota({ ...nuevaMascota, tipo: e.target.value })}
                      >
                        <option value="">Tipo de ave</option>
                        <option value="canario">Canario</option>
                        <option value="loro">Loro</option>
                        <option value="perico">Perico</option>
                      </select>
                    </div>
                  )}
                  {nuevaMascota.especie === 'pez' && (
                    <div className="mascota-form-group">
                      <label>Tipo de pez</label>
                      <select
                        value={nuevaMascota.tipo || ''}
                        onChange={e => setNuevaMascota({ ...nuevaMascota, tipo: e.target.value })}
                      >
                        <option value="">Tipo de pez</option>
                        <option value="betta">Betta</option>
                        <option value="goldfish">Goldfish</option>
                        <option value="guppy">Guppy</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="mascota-form-row">
                  <div className="mascota-form-group">
                    <label>Raza</label>
                    <input
                      type="text"
                      value={nuevaMascota.raza}
                      onChange={e => setNuevaMascota({ ...nuevaMascota, raza: e.target.value })}
                    />
                  </div>
                  <div className="mascota-form-group">
                    <label>Edad</label>
                    <input
                      type="number"
                      value={nuevaMascota.edad || ''}
                      onChange={e => setNuevaMascota({ ...nuevaMascota, edad: Number(e.target.value) })}
                    />
                  </div>
                  <div className="mascota-form-group">
                    <label>Foto</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setNuevaMascota({ ...nuevaMascota, imagen: e.target.files?.[0] })}
                    />
                  </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <button type="submit" className="btn-mascota-guardar">Guardar Mascota</button>
                </div>
              </form>
            )}
            <div className="mascotas-list">
              {mascotas.map(mascota => (
                <div key={mascota.id} className="mascota-card">
                  {mascota.imagen && (
                    <img src={`http://localhost:8080${mascota.imagen}`} alt={mascota.nombre} />
                  )}
                  <strong>{mascota.nombre}</strong> ({mascota.especie})<br />
                  {mascota.etapa && <>Etapa: {mascota.etapa}<br /></>}
                  {mascota.tipo && <>Tipo: {mascota.tipo}<br /></>}
                  Raza: {mascota.raza || '-'}<br />
                  Edad: {mascota.edad || '-'}
                  <button onClick={() => handleDeleteMascota(mascota.id!)} style={{ marginLeft: 10 }}>Eliminar</button>
                </div>
              ))}
              {mascotas.length === 0 && <p>No tienes mascotas registradas.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;