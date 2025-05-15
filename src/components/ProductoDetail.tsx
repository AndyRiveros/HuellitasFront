import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Producto from '../types/Productos';
import '../styles/ProductoDetail.css'; 
import Menu from './Menu';
import { AuthContext } from '../utils/AuthContext';
import { CarritoContext } from '../components/CarritoContext';
import Modal from 'react-modal';
import FloatingCarritoButton from './FloatingCarritoButton';
import Carrito from './Carrito';

const ProductoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const authContext = useContext(AuthContext);
  const carritoContext = useContext(CarritoContext);
  const usuario = authContext ? authContext.usuario : undefined;

  const [showCarrito, setShowCarrito] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      const response = await fetch(`http://localhost:8080/api/productos/${id}`);
      const data = await response.json();
      setProducto(data);
    };

    fetchProducto();
  }, [id]);

  const abrirCarrito = () => {
    setShowCarrito(true);
  };

  const cerrarCarrito = () => {
    setShowCarrito(false);
  };

  const agregarAlCarrito = (producto: Producto) => {
    if (!usuario) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
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

      const pedido = {
        fechaPedido: new Date(),
        totalPedido: total || 0,
      };

      const response = await fetch('http://localhost:8080/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido),
      });

      if (response.ok) {
        alert('Pedido guardado correctamente.');
        carritoContext?.vaciarCarrito();
      } else {
        alert('Error al guardar el pedido.');
      }
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
      alert('Error al guardar el pedido.');
    }
  };

  if (!producto) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Menu />
      <div className="producto-detail">
        <div className="producto-card">
          <div className="producto-image">
            <img src={producto.imagen} alt={producto.producto} />
          </div>
          <div className="producto-info">
            <h1>{producto.producto}</h1>
            <p>{producto.descripcion}</p>
            <h2>Precio: ${producto.precio}</h2>
            <p>Marca: {producto.marca}</p>
            <p>Modelo: {producto.modelo}</p>
            <p>Costo de envío:</p>
            {producto.costoEnvio === 'G' ? (
              <p className="envio-gratis">
                <img src="/img/camion.png" alt="Envío gratis" />
                Envío gratis
              </p>
            ) : (
              <p className="envio-pago">{producto.costoEnvio}</p>
            )}
            {/* <small>{producto.cantidadVendida} vendidos</small> */}
            {usuario?.rol !== 'ADMIN' && (
              <button onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</button>
            )}
          </div>
        </div>
      </div>

      {/* Carrito flotante */}
      {usuario?.rol !== 'ADMIN' && (
        <>
          <FloatingCarritoButton onClick={abrirCarrito} />
          <Modal isOpen={showCarrito} onRequestClose={cerrarCarrito}>
            <Carrito
              carrito={carritoContext?.carrito || []}
              onEliminarDelCarrito={carritoContext?.eliminarDelCarrito || (() => {})}
            />
            <button onClick={guardarCarrito} disabled={carritoContext?.carrito.length === 0}>
              Guardar Carrito
            </button>
            <button onClick={cerrarCarrito}>Cerrar Carrito</button>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ProductoDetail;