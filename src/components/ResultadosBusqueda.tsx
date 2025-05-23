import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Producto from '../types/Productos';
import Categoria from '../types/Categoria';

const ResultadosBusqueda: React.FC = () => {
  const location = useLocation();
  const { productos = [], categorias = [], query = '' } = location.state || {};

  return (
    <div style={{ paddingTop: '140px' }}>
      <h2>Resultados para: "{query}"</h2>
      <h3>Productos</h3>
      {productos.length === 0 ? (
        <p>No se encontraron productos.</p>
      ) : (
        <ul>
          {productos.map((producto: Producto) => (
            <li key={producto.id}>
              <Link to={`/producto/${producto.id}`}>
                <strong>{producto.producto}</strong> - ${producto.precio}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <h3>Categorías</h3>
      {categorias.length === 0 ? (
        <p>No se encontraron categorías.</p>
      ) : (
        <ul>
          {categorias.map((categoria: Categoria) => (
            <li key={categoria.id}>
              <strong>{categoria.denominacion}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResultadosBusqueda;