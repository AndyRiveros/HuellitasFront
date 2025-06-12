import React, { useEffect, useState, useContext } from 'react';
import Usuario, { Rol } from '../types/Usuario';
import { AuthContext } from '../utils/AuthContext';
import Menu from './Menu';
import Footer from './Footer';
import '../styles/LoginSignup.css';

const AdminUsuariosPanel = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Estado para el formulario de creación
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [rol, setRol] = useState<Rol>(Rol.OPERADOR);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [dni, setDni] = useState('');
  const [mail, setMail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [claveValida, setClaveValida] = useState(true);

  const auth = useContext(AuthContext);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:8080/usuarios');
      const data = await response.json();
      setUsuarios(data);
    } catch {
      setMensaje('Error al cargar usuarios');
    }
  };

  const validarClave = (clave: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(clave);
  };

  useEffect(() => {
    setClaveValida(validarClave(clave));
  }, [clave]);

  const handleEliminar = async (id?: number) => {
    if (!id) return;
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await fetch(`http://localhost:8080/usuarios/${id}`, { method: 'DELETE' });
      setUsuarios(usuarios.filter(u => u.id !== id));
    } catch {
      setMensaje('Error al eliminar usuario');
    }
  };

  const handleCrearUsuario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validarClave(clave)) {
      setMensaje('⚠️ La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.');
      return;
    }

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

      const response = await fetch('http://localhost:8080/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (response.ok) {
        setMensaje('Usuario creado exitosamente');
        setShowForm(false);
        setNombreUsuario('');
        setClave('');
        setRol(Rol.OPERADOR);
        setNombre('');
        setApellido('');
        setDireccion('');
        setDni('');
        setMail('');
        setTelefono('');
        fetchUsuarios();
      } else if (response.status === 409) {
        const errorText = await response.text();
        if (errorText.includes('correo')) {
          setMensaje('⚠️ El correo electrónico ya está en uso');
        } else if (errorText.includes('DNI')) {
          setMensaje('⚠️ El DNI ya está en uso');
        } else if (errorText.includes('usuario')) {
          setMensaje('⚠️ El nombre de usuario ya está en uso');
        } else if (errorText.includes('teléfono')) {
          setMensaje('⚠️ El teléfono ya está en uso');
        } else {
          setMensaje('⚠️ Alguno de los datos ya está en uso');
        }
      } else {
        const error = await response.text();
        setMensaje(`❌ Error: ${error}`);
      }
    } catch (err) {
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

if (!auth?.usuario || auth.usuario.rol !== 'ADMIN') {    return (
      <>
        <Menu />
        <div className="signup-container">
          <div className="signup-box">
            <h2 style={{ color: 'red', textAlign: 'center' }}>No tienes permisos para ver este panel.</h2>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Menu />
      <div className="signup-container">
        <div className="signup-box" style={{ maxWidth: '1100px', width: '100%' }}>
          <h2 className="signup-title" style={{ textAlign: 'center' }}>Panel de Usuarios</h2>
          {mensaje && <p style={{ color: mensaje.startsWith('❌') || mensaje.startsWith('⚠️') ? 'red' : 'green', textAlign: 'center' }}>{mensaje}</p>}
          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer'
              }}
            >
              {showForm ? 'Cancelar' : 'Crear Usuario'}
            </button>
          </div>
          {showForm && (
            <form onSubmit={handleCrearUsuario} className="form" autoComplete="off" style={{ marginBottom: 30 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <label className="label" style={{ flex: '1 1 200px' }}>
                  Nombre:
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="input" />
                </label>
                <label className="label" style={{ flex: '1 1 200px' }}>
                  Apellido:
                  <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} className="input" />
                </label>
                <label className="label" style={{ flex: '1 1 200px' }}>
                  Usuario:
                  <input type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} className="input" />
                </label>
                <label className="label" style={{ flex: '1 1 200px' }}>
                  Contraseña:
                  <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} className="input" />
                  {!claveValida && (
                    <span style={{ color: 'red', fontSize: '0.9em' }}>
                      ⚠️ La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.
                    </span>
                  )}
                </label>
                <label className="label" style={{ flex: '1 1 200px' }}>
                  Dirección:
                  <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="input" />
                </label>
                <label className="label" style={{ flex: '1 1 200px' }}>
                  DNI:
                  <input type="number" value={dni} onChange={(e) => setDni(e.target.value)} className="input" />
                </label>
                <label className="label" style={{ flex: '1 1 200px' }}>
                  Email:
                  <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} className="input" />
                </label>
                <label className="label" style={{ flex: '1 1 200px' }}>
                  Teléfono:
                  <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="input" />
                </label>
                <label className="label" style={{ flex: '1 1 200px' }}>
                  Rol:
                  <select value={rol} onChange={e => setRol(e.target.value as Rol)} className="input">
                    <option value={Rol.OPERADOR}>OPERADOR</option>
                    <option value={Rol.ADMIN}>ADMIN</option>
                    <option value={Rol.SUBADMIN}>SUBADMIN</option>
                  </select>
                </label>
              </div>
              <div className="submit" style={{ marginTop: '15px', textAlign: 'center' }}>
                <input type="submit" value="Crear Usuario" className="submit div" autoComplete="off" />
              </div>
            </form>
          )}
          <div style={{ overflowX: 'auto' }}>
            <table className="usuarios-table" style={{ width: '100%', marginTop: 20, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Email</th>
                  <th>DNI</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td>{u.id}</td>
                    <td>{u.nombreUsuario}</td>
                    <td>{u.rol}</td>
                    <td>{u.nombre}</td>
                    <td>{u.apellido}</td>
                    <td>{u.mail}</td>
                    <td>{u.dni}</td>
                    <td>{u.telefono}</td>
                    <td>
                      <button
                        onClick={() => handleEliminar(u.id)}
                        style={{
                          color: 'white',
                          background: '#b71c1c',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '5px 10px',
                          cursor: 'pointer'
                        }}
                      >
                        Eliminar
                      </button>
                      {/* Aquí podrías agregar un botón de editar */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminUsuariosPanel;