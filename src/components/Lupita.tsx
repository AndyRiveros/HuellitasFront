import React, { useState } from 'react';
import '../styles/Lupita.css';
import { useNavigate } from 'react-router-dom';

const Lupita: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Función para normalizar texto (quita tildes y pasa a minúsculas)
  const normalize = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const buscar = async (query: string) => {
    if (!query) return;
    try {
      // Fetch productos y categorías en paralelo
      const [productosRes, categoriasRes] = await Promise.all([
        fetch('http://localhost:8080/api/productos'),
        fetch('http://localhost:8080/api/categorias')
      ]);
      const productos = await productosRes.json();
      const categorias = await categoriasRes.json();

      // Normaliza el query
      const queryNorm = normalize(query);

      // Filtra productos y categorías por coincidencia en nombre o denominación
      const productosFiltrados = productos.filter((p: any) =>
        normalize(p.producto).includes(queryNorm)
      );
      const categoriasFiltradas = categorias.filter((c: any) =>
        normalize(c.denominacion).includes(queryNorm)
      );

      navigate('/resultados', {
        state: {
          productos: productosFiltrados,
          categorias: categoriasFiltradas,
          query
        }
      });
    } catch (error) {
      console.error('Error en la búsqueda:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    buscar(searchTerm);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      buscar(searchTerm);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Buscar productos o categorías..."
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>
        🔍
      </button>
    </div>
  );
};

export default Lupita;