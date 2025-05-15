import React, { createContext, useState, ReactNode } from 'react';
import CarritoItem from '../types/CarritoItem';
import Producto from '../types/Productos';

interface CarritoContextType {
  carrito: CarritoItem[];
  agregarAlCarrito: (producto: Producto) => void;
  eliminarDelCarrito: (index: number) => void;
  vaciarCarrito: () => void;
}

export const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);

  const agregarAlCarrito = (producto: Producto) => {
    const index = carrito.findIndex(item => item.producto.id === producto.id);
    if (index !== -1) {
      const newCarrito = [...carrito];
      newCarrito[index].cantidad += 1;
      setCarrito(newCarrito);
    } else {
      setCarrito([...carrito, { producto, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (index: number) => {
    const nuevoCarrito = [...carrito];
    if (nuevoCarrito[index].cantidad > 1) {
      nuevoCarrito[index].cantidad -= 1;
    } else {
      nuevoCarrito.splice(index, 1);
    }
    setCarrito(nuevoCarrito);
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CarritoContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};