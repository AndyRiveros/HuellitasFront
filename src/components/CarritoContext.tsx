import React, { createContext, useState, ReactNode } from 'react';

import CarritoItem from '../types/CarritoItem';

import Producto from '../types/Productos';

interface CarritoContextType {
  carrito: CarritoItem[];

  agregarAlCarrito: (producto: Producto) => void;

  eliminarDelCarrito: (index: number) => void;

  vaciarCarrito: () => void;
}

export const CarritoContext =
  createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);

  // AGREGAR / AUMENTAR CANTIDAD
  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((carritoActual) => {
      const productoExistente = carritoActual.find(
        (item) => item.producto.id === producto.id
      );

      if (productoExistente) {
        return carritoActual.map((item) =>
          item.producto.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item
        );
      }

      return [
        ...carritoActual,
        {
          producto: producto,
          cantidad: 1,
        },
      ];
    });
  };

  // DISMINUIR / ELIMINAR
  const eliminarDelCarrito = (index: number) => {
    setCarrito((carritoActual) => {
      const item = carritoActual[index];

      if (!item) {
        return carritoActual;
      }

      if (item.cantidad > 1) {
        return carritoActual.map((itemActual, i) =>
          i === index
            ? {
                ...itemActual,
                cantidad: itemActual.cantidad - 1,
              }
            : itemActual
        );
      }

      return carritoActual.filter((_, i) => i !== index);
    });
  };

  // VACIAR CARRITO
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};