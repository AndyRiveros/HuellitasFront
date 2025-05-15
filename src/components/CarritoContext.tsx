import React, { createContext, useState, ReactNode } from 'react';
import CarritoItem from '../types/CarritoItem';
import Instrumento from '../types/Instrumentos';

interface CarritoContextType {
  carrito: CarritoItem[];
  agregarAlCarrito: (instrumento: Instrumento) => void;
  eliminarDelCarrito: (index: number) => void;
  vaciarCarrito: () => void;
}

export const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);

  const agregarAlCarrito = (instrumento: Instrumento) => {
    const index = carrito.findIndex(item => item.instrumento.id === instrumento.id);
    if (index !== -1) {
      const newCarrito = [...carrito];
      newCarrito[index].cantidad += 1;
      setCarrito(newCarrito);
    } else {
      setCarrito([...carrito, { instrumento, cantidad: 1 }]);
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