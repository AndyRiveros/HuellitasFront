
import React, { useState } from 'react';
import '../styles/Lupita.css';
import { useNavigate } from 'react-router-dom';

const Lupita: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const buscar = (query: string) => {
    const termino = query.trim();

    if (!termino) return;

    navigate(`/productos?busqueda=${encodeURIComponent(termino)}`);
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

      <button onClick={handleSearch}>🔍</button>
    </div>
  );
};

export default Lupita;

