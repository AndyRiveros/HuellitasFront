import React from 'react';
import CarritoItem from '../types/CarritoItem';
import CheckoutMP from './CheckoutMP';

interface CarritoProps {
  carrito: CarritoItem[];
  onEliminarDelCarrito: (index: number) => void;
}

const Carrito: React.FC<CarritoProps> = ({ carrito, onEliminarDelCarrito }) => {
  const total = carrito.reduce((sum, item) => sum + Number(item.instrumento.precio) * item.cantidad, 0);

  return (
    <div className="carrito">
      <h2>Carrito</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          <ul>
            {carrito.map((item, index) => (
              <li key={index}>
                {item.instrumento.instrumento} - ${item.instrumento.precio} x {item.cantidad}
                <button onClick={() => onEliminarDelCarrito(index)}>Eliminar</button>
              </li>
            ))}
          </ul>
          <p>Total: ${total}</p>
          <CheckoutMP montoCarrito={total} ></CheckoutMP>
        </>
      )}
    </div>
  );
};

export default Carrito;
