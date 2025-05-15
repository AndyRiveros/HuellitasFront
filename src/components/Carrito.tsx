import React from 'react';
import CarritoItem from '../types/CarritoItem';
import CheckoutMP from './CheckoutMP';

interface CarritoProps {
  carrito: CarritoItem[];
  onEliminarDelCarrito: (index: number) => void;
}

const Carrito: React.FC<CarritoProps> = ({ carrito, onEliminarDelCarrito }) => {
  const total = carrito.reduce(
    (sum, item) => sum + Number(item.instrumento.precio) * item.cantidad,
    0
  );

  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '30px auto',
        padding: '20px',
        background: 'linear-gradient(135deg, #6a0dad 0%, #b19cd9 100%)',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(106, 13, 173, 0.3)',
        color: 'white',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2
        style={{
          marginBottom: '20px',
          fontWeight: '700',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          letterSpacing: '1.2px',
          textAlign: 'center',
        }}
      >
        Tu Carrito
      </h2>

      {carrito.length === 0 ? (
        <p
          style={{
            textAlign: 'center',
            fontSize: '1.1rem',
            fontStyle: 'italic',
            color: '#d3c3f5',
          }}
        >
          El carrito está vacío 😢
        </p>
      ) : (
        <>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '320px',
              overflowY: 'auto',
            }}
          >
            {carrito.map((item, index) => (
              <li
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: 'inset 0 0 8px rgba(255, 255, 255, 0.15)',
                  fontWeight: '600',
                }}
              >
                <div>
                  {item.instrumento.instrumento} - ${item.instrumento.precio} x{' '}
                  {item.cantidad}
                </div>
                <button
                  onClick={() => onEliminarDelCarrito(index)}
                  style={{
                    backgroundColor: '#d89fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    color: '#4b0082',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'background-color 0.25s ease',
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.backgroundColor = '#b479e2')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.backgroundColor = '#d89fff')
                  }
                  aria-label={`Eliminar ${item.instrumento.instrumento} del carrito`}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <p
            style={{
              textAlign: 'right',
              fontSize: '1.3rem',
              fontWeight: '700',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              marginBottom: '25px',
            }}
          >
            Total: ${total.toFixed(2)}
          </p>

          <CheckoutMP montoCarrito={total} />
        </>
      )}
    </div>
  );
};

export default Carrito;
