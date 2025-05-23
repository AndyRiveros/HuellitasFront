import { useLocation } from 'react-router-dom';
import Producto from '../types/Productos';

const ResultadosBusqueda = () => {
  const location = useLocation();
  const productos: Producto[] = location.state?.productos || [];
  const query: string = location.state?.query || '';

  return (
    <div style={{ padding: 20 }}>
      <h2>Resultados para: "{query}"</h2>
      {productos.length > 0 ? (
        <div className="productos-row">
          {productos.map((producto) => (
            <div className="producto-card" key={producto.id}>
              <img src={producto.imagen} alt={producto.producto} className="producto-imagen" />
              <h4>{producto.producto}</h4>
              <p>Precio: ${producto.precio}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron productos.</p>
      )}
    </div>
  );
};

export default ResultadosBusqueda;