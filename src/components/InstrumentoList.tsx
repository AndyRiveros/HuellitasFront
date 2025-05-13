import React, { useContext, useEffect, useState } from 'react';
import Instrumento from '../types/Instrumentos';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import Categoria from '../types/Categoria';
import axios from 'axios';
import Carrito from './Carrito';
import Pedido from '../types/Pedido';
import PedidoDetalle from '../types/PedidoDetalles';
import CarritoItem from '../types/CarritoItem';
import { AuthContext } from '../utils/AuthContext';
import Modal from 'react-modal';

const InstrumentoList: React.FC = () => {
  const [instrumentos, setInstrumentos] = useState<Instrumento[] | undefined>(undefined);
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const authContext = useContext(AuthContext);
  const usuario = authContext ? authContext.usuario : undefined;
  const [fechaDesde, setFechaDesde] = useState('');
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

  const generarExcel = () => {
    if (fechaDesde && fechaHasta) {
      const fechaDesdeConHora = `${fechaDesde}T00:00:00`;
      const fechaHastaConHora = `${fechaHasta}T23:59:59`;

      const url = `http://localhost:8080/api/pedidos/downloadExcel?fechaDesde=${fechaDesdeConHora}&fechaHasta=${fechaHastaConHora}`;

      window.open(url, '_blank');
      cerrarModal();
    } else {
      alert('Por favor ingresa ambas fechas.');
    }
  }

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

  const guardarCarrito = async () => {
    try {
      const total = carrito.reduce((sum, item) => sum + (Number(item.instrumento.precio) * item.cantidad), 0);

      const pedido: Pedido = {
        fechaPedido: new Date(),
        totalPedido: total
      };

      const response = await axios.post<Pedido>('http://localhost:8080/api/pedidos', pedido);

      if (response.status === 201) {
        const pedidoId = response.data.id;

        const pedidoDetalles: PedidoDetalle[] = carrito.map(item => ({
          cantidad: item.cantidad,
          instrumento: { id: item.instrumento.id },
          pedido: { 
            id: pedidoId, 
            fechaPedido: new Date(),
            totalPedido: total 
          }
        }));

        await axios.post('http://localhost:8080/api/pedidoDetalles', pedidoDetalles);
        
        for (const item of carrito) {
          const instrumento = item.instrumento;
          await axios.put(`http://localhost:8080/api/instrumentos/${instrumento.id}/venta`, { cantidad: item.cantidad }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
        alert(`El pedido con id ${pedidoId} se guardó correctamente`);
        setCarrito([]);
      } else {
        alert('Error al guardar el pedido. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
      alert('Error al guardar el pedido. Por favor, inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/instrumentos')
    .then(response => response.json())
    .then(data => {
        // Filtrar solo los instrumentos que no están eliminados
        const instrumentosActivos = data.filter((instrumento: Instrumento) => !instrumento.isDeleted);
        setInstrumentos(instrumentosActivos);
    });
  }, []);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  
  useEffect(() => {
    fetch('http://localhost:8080/api/categorias')
      .then(response => response.json())
      .then(data => setCategorias(data));
  }, []);

  const instrumentosFiltrados = instrumentos && categoriaSeleccionada
  ? instrumentos.filter(instrumento => instrumento.idCategoria === Number(categoriaSeleccionada))
  : instrumentos;

  return (
  <div> 
      <div style={{ flex: 2 }}>
        <Menu />
        <div style={{ paddingTop:'60px', display: 'flex', justifyContent: 'space-between', color: 'white'}}>
  <h2>Lista de Instrumentos</h2>
  <div>
    {usuario && usuario.rol === 'ADMIN' && (
      <button onClick={() => setShowModal(true)}>Generar Excel</button>
    )}
    <button onClick={abrirCarrito} style={{ backgroundColor: carrito.length > 0 ? 'red' : 'initial' }}>Ver Carrito</button>
  </div>
</div>   
        <Modal isOpen={showCarrito} onRequestClose={cerrarCarrito}>
          <Carrito carrito={carrito} onEliminarDelCarrito={eliminarDelCarrito} />
          <button onClick={guardarCarrito} disabled={carrito.length === 0}>Guardar Carrito</button>
          <button onClick={cerrarCarrito}>Cerrar Carrito</button>
        </Modal>
        <Modal isOpen={showModal} onRequestClose={cerrarModal}>
            <h2>Generar Excel</h2>
            <label>Fecha desde: </label>
            <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} />
            <label>Fecha hasta: </label>
            <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} />
            <button onClick={generarExcel}>Generar</button>
            <button onClick={cerrarModal}>Cerrar</button>
        </Modal>
        <div>
          <label style={{color: "white"}}>Filtrar por categoría: </label>
          <select value={categoriaSeleccionada} onChange={e => setCategoriaSeleccionada(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>{categoria.denominacion}</option>
            ))}
          </select>
        </div>
        {instrumentosFiltrados === undefined ? (
          <p>Cargando instrumentos...</p>
        ) : (
          instrumentosFiltrados.length > 0 ? (
            instrumentosFiltrados.map((instrumento: Instrumento) => (
              <div className="instrumento" key={instrumento.id}>
                <img style={{width: '400px', height: '300px'}} src={instrumento.imagen} alt={instrumento.instrumento} />
                <div>
                  <h3>{instrumento.instrumento}</h3>
                  <p>Precio: ${instrumento.precio}</p>
                  {instrumento.costoEnvio !== 'G' && <p style={{ color: 'orange' }}>Costo de Envío: {instrumento.costoEnvio}</p>}
                  {instrumento.costoEnvio === 'G' &&
                    <p style={{ color: 'green' }}>
                      <img src="img/camion.png" style={{ width: '20px', height: '20px', margin: '2px' }} />
                      Envios Gratis
                    </p>}
                    <button onClick={() => agregarAlCarrito(instrumento)}>
                      Agregar al carrito
                    </button>
                    <Link to={`/instrumento/${instrumento.id}`}>
                      <button>Ver detalles</button>
                    </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No hay instrumentos disponibles.</p>
          )
        )}
      </div>
    </div>
  );
};

export default InstrumentoList;
