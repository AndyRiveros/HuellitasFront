import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const handlePerfilClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!usuario) {
      e.preventDefault();
      alert('Debes iniciar sesión o registrarte para ver tu perfil.');
      navigate('/login');
    }
  };



  // Botón de sesión dinámico
const sessionButton = usuario ? (
  <button className="logout-button logout-red" onClick={handleCerrarSesion}>Cerrar Sesión</button>
) : (
  <button
    className="logout-button logout-green"
    onClick={() => navigate('/login')}
  >
    Iniciar Sesión
  </button>
);

  return (
    <>
      <nav className="menu">
        <ul className="menu-list">
          {/* IZQUIERDA: Logo */}
          <div className="menu-left">
            <li>
              <Link to="/home">
                <img src="/img/logo.jpg" alt="Logo" className="logo-img" />
              </Link>
            </li>
          </div>
          {/* CENTRO: Opciones principales */}
          <div className="menu-center">
            <li className="menu-item main-option"><Link to="/home">HOME</Link></li>
            <li className="menu-item main-option"><Link to="/mapa">DONDE ESTAMOS</Link></li>
            <li className="menu-item main-option"><Link to="/productos">PRODUCTOS</Link></li>
            <li className="menu-item main-option">
              <Link to="/perfil" onClick={handlePerfilClick}>MI PERFIL</Link>
            </li>
            {usuario && usuario.rol === 'ADMIN' && (
              <>
                <li className="menu-item main-option"><Link to="/inventario">INVENTARIO</Link></li>
                <li className="menu-item main-option"><Link to="/google-charts">-EN DESARROLLO-</Link></li>
              </>
    )}
          </div>
          {/* DERECHA: Lupita y sesión */}
          <div className="menu-right">
            <li>
            </li>
            <li>
              {sessionButton}
            </li>
          </div>
        </ul>
      </nav>
      {/* SUBMENU */}
      <div className="submenu">
        <button className="submenu-btn">Accesorios</button>
        <button className="submenu-btn">Perros</button>
        <button className="submenu-btn">Gatos</button>
        <button className="submenu-btn">Aves</button>
        <button className="submenu-btn">Peces</button>
        <button className="submenu-btn">Preguntas Frecuentes</button>
      </div>
    </>
  );
};

export default Menu;