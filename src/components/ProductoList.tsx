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
import Modal from 'react-modal';
import '../styles/FloatingCarrito.css';
import FloatingCarritoButton from './FloatingCarritoButton';

const ProductoList: React.FC = () => {
  const [productos, setProductos] = useState<Producto[] | undefined>(undefined);
  const authContext = useContext(AuthContext);
  const carritoContext = useContext(CarritoContext);
  const usuario = authContext ? authContext.usuario : undefined;
  const [fechaDesde, setFechaDesde] = useState('');
  const navigate = useNavigate();
  const [fechaHasta, setFechaHasta] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCarrito, setShowCarrito] = useState(false);

  const abrirCarrito = () => {
    setShowCarrito(true);
  };

  const cerrarCarrito = () => {
    setShowCarrito(false);
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  // const generarExcel = () => {
  //   if (fechaDesde && fechaHasta) {
  //     const fechaDesdeConHora = `${fechaDesde}T00:00:00`;
  //     const fechaHastaConHora = `${fechaHasta}T23:59:59`;

  //     const url = `http://localhost:8080/api/pedidos/downloadExcel?fechaDesde=${fechaDesdeConHora}&fechaHasta=${fechaHastaConHora}`;

  //     window.open(url, '_blank');
  //     cerrarModal();
  //   } else {
  //     alert('Por favor ingresa ambas fechas.');
  //   }
  // };

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

  const productosFiltrados = productos && categoriaSeleccionada
    ? productos.filter(producto => producto.idCategoria === Number(categoriaSeleccionada))
    : productos

  return (
    <div>
      <div style={{ flex: 2, paddingBottom: '100px' }}>
        <div style={{ paddingTop: '60px', display: 'flex', justifyContent: 'space-between', color: 'white' }}>
          <h2>Lista de Productos</h2>
          <div>
            {/* {usuario && usuario.rol === 'ADMIN' && (
              <button onClick={() => setShowModal(true)}>Generar Excel</button>
            )} */}
            {/* Mostrar el carrito flotante solo si el usuario no es ADMIN */}
            {usuario?.rol !== 'ADMIN' && (
              <FloatingCarritoButton onClick={abrirCarrito} />
            )}
          </div>
        </div>
        <Modal isOpen={showCarrito} onRequestClose={cerrarCarrito}>
          <Carrito carrito={carritoContext?.carrito || []} onEliminarDelCarrito={carritoContext?.eliminarDelCarrito || (() => {})} />
          <button onClick={guardarCarrito} disabled={carritoContext?.carrito.length === 0}>
            Guardar Carrito
          </button>
          <button onClick={cerrarCarrito}>Cerrar Carrito</button>
        </Modal>
        {/* <Modal isOpen={showModal} onRequestClose={cerrarModal}>
          <h2>Generar Excel</h2>
          <label>Fecha desde: </label>
          <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} />
          <label>Fecha hasta: </label>
          <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} />
          <button onClick={generarExcel}>Generar</button>
          <button onClick={cerrarModal}>Cerrar</button>
        </Modal> */}
        <div>
          <label style={{ color: 'white' }}>Filtrar por categoría: </label>
          <select value={categoriaSeleccionada} onChange={e => setCategoriaSeleccionada(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.denominacion}
              </option>
            ))}
          </select>
        </div>
        {productosFiltrados === undefined ? (
          <p>Cargando productos...</p>
        ) : productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto: Producto) => (
            <div className="producto" key={producto.id}>
              <img
                style={{ width: '400px', height: '300px' }}
                src={producto.imagen}
                alt={producto.producto}
              />
              <div>
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
                {usuario?.rol !== 'ADMIN' && (
                  <button onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</button>
                )}
                <Link to={`/producto/${producto.id}`}>
                  <button>Ver detalles</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default ProductoList;
                                                            