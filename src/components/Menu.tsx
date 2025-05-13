import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/Menu.css';
import { AuthContext } from '../utils/AuthContext';

const Menu = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('authContext is undefined, please ensure AuthProvider is set up correctly');
  }

  const { usuario, cerrarSesion } = authContext;
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate("/");
  };
  

  return (
    <nav className="menu">
      <ul className="menu-list">
        <li className="menu-item"><Link to="/home">HOME</Link></li>
        <li className="menu-item"><Link to="/mapa">DONDE ESTAMOS</Link></li>
        <li className="menu-item"><Link to="/instrumentos">PRODUCTOS</Link></li>
        {usuario && usuario.rol === 'ADMIN' && <li className="menu-item"><Link to="/inventario">INVENTARIO</Link></li>}
        {usuario && usuario.rol === 'ADMIN' && <li className="menu-item"><Link to="/google-charts">GRAFICOS</Link></li>}
        {usuario && <li style={{color: 'black'}}>Usuario: {usuario.nombre}<br />Rol: {usuario.rol}</li>}
        <li><button onClick={handleCerrarSesion}>Cerrar Sesión</button></li>
      </ul>
    </nav>

  );
}

export default Menu;