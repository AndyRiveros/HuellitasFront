import React, { useContext } from 'react';
import CarritoItem from '../types/CarritoItem';
import CheckoutMP from './CheckoutMP';
import { CarritoContext } from './CarritoContext';

interface CarritoProps {

  carrito: CarritoItem[];
  onEliminarDelCarrito: (index: number) => void;
}

const Carrito: React.FC<CarritoProps> = ({
  carrito,
  onEliminarDelCarrito,
}) => {
  const carritoContext = useContext(CarritoContext);

  const total = carrito.reduce(
    (sum, item) =>
      sum + Number(item.producto.precio) * item.cantidad,
    0
  );

  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '30px auto',
        padding: '20px',
        background:
          'linear-gradient(135deg, #6a0dad 0%, #b19cd9 100%)',
        borderRadius: '16px',
        boxShadow:
          '0 8px 20px rgba(106, 13, 173, 0.3)',
        color: 'white',
        fontFamily:
          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2
        style={{
          marginBottom: '20px',
          fontWeight: '700',
          textShadow:
            '0 2px 4px rgba(0,0,0,0.5)',
          letterSpacing: '1.2px',
          textAlign: 'center',
        }}
      >
      Carro de la compra
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
          Todavia no hay artículos en tu carrito. 😢
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
                key={item.producto.id}
                style={{
                  background:
                    'rgba(255, 255, 255, 0.15)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '15px',
                  boxShadow:
                    'inset 0 0 8px rgba(255, 255, 255, 0.15)',
                  fontWeight: '600',
                }}
              >
                {/* Producto y precio */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {item.producto.producto} - $
                  {item.producto.precio}
                </div>

                {/* Controles */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexShrink: 0,
                  }}
                >
                  {/* MENOS */}
                  <button
                    type="button"
                    onClick={() =>
                      onEliminarDelCarrito(index)
                    }
                    style={{
                      backgroundColor: '#d89fff',
                      border: 'none',
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      color: '#4b0082',
                      fontWeight: '700',
                      fontSize: '18px',
                      cursor: 'pointer',
                    }}
                    aria-label={`Disminuir cantidad de ${item.producto.producto}`}
                  >
                    −
                  </button>

                  {/* CANTIDAD */}
                  <span
                    style={{
                      minWidth: '20px',
                      textAlign: 'center',
                    }}
                  >
                    {item.cantidad}
                  </span>

                  {/* MAS */}
                  <button
                    type="button"
                    onClick={() => {
                      carritoContext?.agregarAlCarrito(
                        item.producto
                      );
                    }}
                    style={{
                      backgroundColor: '#d89fff',
                      border: 'none',
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      color: '#4b0082',
                      fontWeight: '700',
                      fontSize: '18px',
                      cursor: 'pointer',
                    }}
                    aria-label={`Aumentar cantidad de ${item.producto.producto}`}
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* TOTAL */}
          <p
            style={{
              textAlign: 'right',
              fontSize: '1.3rem',
              fontWeight: '700',
              textShadow:
                '0 1px 2px rgba(0,0,0,0.3)',
              marginBottom: '25px',
            }}
          >
            Total: ${total.toFixed(2)}
          </p>

          {/* MERCADO PAGO */}
          <CheckoutMP montoCarrito={total} />
        </>
      )}
    </div>
  );
};

export default Carrito;