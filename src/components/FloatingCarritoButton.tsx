import React, { useContext } from 'react';
import { CarritoContext } from './CarritoContext';
import carritologo from '../../img/carritologo.png';

interface Props {
  onClick: () => void;
}

const FloatingCarritoButton: React.FC<Props> = ({ onClick }) => {
  const carritoContext = useContext(CarritoContext);
  const itemCount = carritoContext?.carrito?.length || 0;

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: itemCount > 0 ? '#6a0dad' : '#4b0082', // púrpura y morado oscuro para vacío
        color: 'white',
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        borderRadius: '50%',
        width: '70px',
        height: '70px',
        boxShadow: '0 6px 12px rgba(106, 13, 173, 0.6)',
        cursor: 'pointer',
        border: 'none',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: 0,
        fontWeight: 'bold',
        fontSize: '1.2rem',
        transition: 'background-color 0.3s ease',
      }}
      aria-label="Carrito de compras"
      title={`Carrito (${itemCount})`}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#8a2be2'; // más claro al hover
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          itemCount > 0 ? '#6a0dad' : '#4b0082';
      }}
    >
      <img src={carritologo} alt="Carrito" style={{ width: '28px', height: '28px' }} />
      <span>{itemCount}</span>
    </button>
  );
};

export default FloatingCarritoButton;
