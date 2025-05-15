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
      e.preventDefault(); // Evita la navegación predeterminada
      alert('Debes iniciar sesión o registrarte para ver tu perfil.');
      navigate('/login'); // Redirige al login
    }
  };

  return (
    <nav className="menu">
      <ul className="menu-list">
        <li className="menu-item"><Link to="/home">HOME</Link></li>
        <li className="menu-item"><Link to="/mapa">DONDE ESTAMOS</Link></li>
        <li className="menu-item"><Link to="/productos">PRODUCTOS</Link></li>
        <li className="menu-item">
          <Link to="/perfil" onClick={handlePerfilClick}>MI PERFIL</Link>
        </li>
        {usuario && usuario.rol === 'ADMIN' && <li className="menu-item"><Link to="/inventario">INVENTARIO</Link></li>}
        {usuario && usuario.rol === 'ADMIN' && <li className="menu-item"><Link to="/google-charts">-en desarrollo-</Link></li>}
        <li><button onClick={handleCerrarSesion}>Cerrar Sesión</button></li>
      </ul>
    </nav>
  );
}

export default Menu;