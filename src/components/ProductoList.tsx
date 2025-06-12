import React, { useContext, useEffect, useState } from 'react';
import Producto from '../types/Productos';
import { Link, useNavigate } from 'react-router-dom';
import Menu from './Menu';
import Categoria from '../types/Categoria';
import axios from 'axios';
import Carrito from './Carrito';
import Pedido from '../types/Pedido';
import PedidoDetalle from '../types/PedidoDetalles';
import { AuthContext } from '../utils/AuthContext';
import { CarritoContext } from '../components/CarritoContext';
import '../styles/FloatingCarrito.css';
import FloatingCarritoButton from './FloatingCarritoButton';
import '../styles/ProductoList.css'; // Asegúrate de tener este archivo
import Modal from 'react-modal'; // Importa Modal

const ProductoList: React.FC = () => {
  const [productos, setProductos] = useState<Producto[] | undefined>(undefined);
  const authContext = useContext(AuthContext);
  const carritoContext = useContext(CarritoContext);
  const usuario = authContext ? authContext.usuario : undefined;
  const [orden, setOrden] = useState('');
  const navigate = useNavigate();
  const [filtroEspecie, setFiltroEspecie] = useState<string[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string[]>([]);
  const [filtroEtapa, setFiltroEtapa] = useState<string[]>([]);
  const [showCarrito, setShowCarrito] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Función para alternar selección
  const toggleFiltro = (valor: string, filtro: string[], setFiltro: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (filtro.includes(valor)) {
      setFiltro(filtro.filter(f => f !== valor));
    } else {
      setFiltro([...filtro, valor]);
    }
  };

  const abrirCarrito = () => {
    setShowCarrito(true);
  };

  const cerrarCarrito = () => {
    setShowCarrito(false);
  };

  const agregarAlCarrito = (producto: Producto) => {
    if (!usuario) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      navigate('/login'); // Redirige al login si no está autenticado
      return;
    }
    carritoContext?.agregarAlCarrito(producto);
  };

  const guardarCarrito = async () => {
    try {
      const total = carritoContext?.carrito.reduce(
        (sum, item) => sum + Number(item.producto.precio) * item.cantidad,
        0
      );

      const pedido: Pedido = {
        fechaPedido: new Date(),
        totalPedido: total || 0,
      };

      const response = await axios.post<Pedido>('http://localhost:8080/api/pedidos', pedido);

      if (response.status === 201) {
        const pedidoId = response.data.id;

        const pedidoDetalles: PedidoDetalle[] = carritoContext?.carrito.map(item => ({
          cantidad: item.cantidad,
          producto: { id: item.producto.id },
          pedido: {
            id: pedidoId,
            fechaPedido: new Date(),
            totalPedido: total || 0,
          },
        })) || [];

        await axios.post('http://localhost:8080/api/pedidoDetalles', pedidoDetalles);

        for (const item of carritoContext?.carrito || []) {
          const producto = item.producto;
          await axios.put(
            `http://localhost:8080/api/productos/${producto.id}/venta`,
            { cantidad: item.cantidad },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        }
        alert(`El pedido con id ${pedidoId} se guardó correctamente`);
        carritoContext?.vaciarCarrito();
      } else {
        alert('Error al guardar el pedido. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
      alert('Error al guardar el pedido. Por favor, inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/productos')
      .then(response => response.json())
      .then(data => {
        // Filtrar solo los productos que no están eliminados
        const productosActivos = data.filter((producto: Producto) => !producto.isDeleted);
        setProductos(productosActivos);
      });
  }, []);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/categorias')
      .then(response => response.json())
      .then(data => setCategorias(data));
  }, []);

  let productosFiltrados = productos ?? [];
  if (filtroEspecie.length > 0) {
    productosFiltrados = productosFiltrados.filter(p => p.especie && filtroEspecie.includes(p.especie));
  }
  if (filtroTipo.length > 0) {
    productosFiltrados = productosFiltrados.filter(p => p.tipo && filtroTipo.includes(p.tipo));
  }
  if (filtroEtapa.length > 0) {
    productosFiltrados = productosFiltrados.filter(p => p.etapa && filtroEtapa.includes(p.etapa));
  }

  // Filtro de búsqueda por nombre de producto
  if (busqueda.trim() !== '') {
    productosFiltrados = productosFiltrados.filter(p =>
      p.producto.toLowerCase().includes(busqueda.trim().toLowerCase())
    );
  }

  if (orden === 'menor') {
    productosFiltrados = productosFiltrados.sort((a, b) => a.precio - b.precio);
  } else if (orden === 'mayor') {
    productosFiltrados = productosFiltrados.sort((a, b) => b.precio - a.precio);
  } else if (orden === 'az') {
    productosFiltrados = productosFiltrados.sort((a, b) => a.producto.localeCompare(b.producto));
  } else if (orden === 'za') {
    productosFiltrados = productosFiltrados.sort((a, b) => b.producto.localeCompare(a.producto));
  }

  // Mostrar el carrito flotante solo si el usuario no es ADMIN y hay productos en el carrito
const mostrarCarritoFlotante = !!usuario && usuario.rol !== 'ADMIN' && usuario.rol !== 'SUBADMIN' && (carritoContext?.carrito?.length ?? 0) > 0;
  return (
    <>
      <Menu />
      {/* Carrito flotante y modal */}
      {mostrarCarritoFlotante && (
        <FloatingCarritoButton onClick={abrirCarrito} />
      )}
      <Modal isOpen={showCarrito} onRequestClose={cerrarCarrito}>
        <Carrito
          carrito={carritoContext?.carrito || []}
          onEliminarDelCarrito={carritoContext?.eliminarDelCarrito || (() => {})}
        />
        <button onClick={cerrarCarrito}>Cerrar Carrito</button>
      </Modal>
      <div className="producto-list-container">
        <aside className="categorias-sidebar">
          <h3>Filtros</h3>
          <div className="categorias-botones">
            <button
              className={
                filtroEspecie.length === 0 && filtroTipo.length === 0 && filtroEtapa.length === 0
                  ? "categoria-btn active"
                  : "categoria-btn"
              }
              onClick={() => {
                setFiltroEspecie([]);
                setFiltroTipo([]);
                setFiltroEtapa([]);
              }}
            >
              Todos los productos
            </button>
          </div>
          <div className="filtro-grupo">
            <span style={{ fontWeight: 'bold' }}>Especie:</span>
            {["perro", "gato", "ave", "pez"].map(especie => (
              <button
                key={especie}
                className={filtroEspecie.includes(especie) ? "categoria-btn active" : "categoria-btn"}
                onClick={() => toggleFiltro(especie, filtroEspecie, setFiltroEspecie)}
              >
                {especie.charAt(0).toUpperCase() + especie.slice(1)}
              </button>
            ))}
          </div>
          <div className="filtro-grupo">
            <span style={{ fontWeight: 'bold' }}>Tipo:</span>
            {[
              { key: "alimento", label: "Alimentos" },
              { key: "accesorios", label: "Accesorios" },
              { key: "salud", label: "Salud" },
              { key: "estetica", label: "Estética e Higiene" },
              { key: "snack", label: "Snacks" },
              { key: "oferta", label: "Ofertas" }
            ].map(tipo => (
              <button
                key={tipo.key}
                className={filtroTipo.includes(tipo.key) ? "categoria-btn active" : "categoria-btn"}
                onClick={() => toggleFiltro(tipo.key, filtroTipo, setFiltroTipo)}
              >
                {tipo.label}
              </button>
            ))}
          </div>
          <div className="filtro-grupo">
            <span style={{ fontWeight: 'bold' }}>Etapa:</span>
            {["cachorro", "adulto", "senior"].map(etapa => (
              <button
                key={etapa}
                className={filtroEtapa.includes(etapa) ? "categoria-btn active" : "categoria-btn"}
                onClick={() => toggleFiltro(etapa, filtroEtapa, setFiltroEtapa)}
              >
                {etapa.charAt(0).toUpperCase() + etapa.slice(1)}
              </button>
            ))}
          </div>
        </aside>

        {/* Columna derecha: Productos en grilla */}
        <main className="productos-main">
          <h2>Lista de Productos</h2>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="buscador-productos"
              style={{ maxWidth: 350, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
            <select
              value={orden}
              onChange={e => setOrden(e.target.value)}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            >
              <option value="">Ordenar por</option>
              <option value="menor">Menor precio</option>
              <option value="mayor">Mayor precio</option>
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
            </select>
          </div>
          {productosFiltrados === undefined ? (
            <p>Cargando productos...</p>
          ) : productosFiltrados.length > 0 ? (
            <div className="productos-grid">
              {productosFiltrados.map((producto: Producto) => (
                <div className="producto-card" key={producto.id}>
                  <img
                    src={producto.imagen}
                    alt={producto.producto}
                    className="producto-img"
                  />
                  <h3>{producto.producto}</h3>
                  <p>Precio: ${producto.precio}</p>
                  {producto.costoEnvio !== 'G' && (
                    <p style={{ color: 'orange' }}>Costo de Envío: {producto.costoEnvio}</p>
                  )}
                  {producto.costoEnvio === 'G' && (
                    <p style={{ color: 'green' }}>
                      <img
                        src="img/camion.png"
                        style={{ width: '20px', height: '20px', margin: '2px' }}
                        alt="Envío gratis"
                      />
                      Envios Gratis
                    </p>
                  )}
                  {usuario?.rol !== 'ADMIN' && usuario?.rol !== 'SUBADMIN' &&(
                    <button onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</button>
                  )}
                  <Link to={`/producto/${producto.id}`}>
                    <button>Ver detalles</button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay productos disponibles.</p>
          )}
        </main>
      </div>
    </>
  );
};

export default ProductoList;