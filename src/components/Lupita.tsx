import React, { useState } from 'react';
import '../styles/Lupita.css';
import { useNavigate } from 'react-router-dom';

const Lupita: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const buscarProductos = async (query: string) => {
    if (!query) return;
    try {
      const response = await fetch(`http://localhost:8080/api/productos/buscar?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      navigate('/resultados', { state: { productos: Array.isArray(data) ? data : [], query } });
    } catch (error) {
      console.error('Error al buscar productos:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    buscarProductos(searchTerm);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      buscarProductos(searchTerm);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Buscar..."
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