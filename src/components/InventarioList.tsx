import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Producto from '../types/Productos';
import Menu from './Menu';
import { Modal } from 'react-bootstrap';

const InventarioList: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 15;

  const cerrarModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/productos');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error al obtener productos:', error);
        return [];
      }
    };

    fetchProductos()
      .then(productos => {
        setProductos(productos);
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
      });
  }, []);

  const cambiarEstadoProducto = (id: number, isDeleted: boolean) => {
    const nuevoEstado = !isDeleted;

    axios.get(`http://localhost:8080/api/productos/${id}`)
      .then(response => {
        const producto = response.data;
        producto.isDeleted = nuevoEstado;

        axios.put(`http://localhost:8080/api/productos/${id}`, producto)
          .then(() => {
            setProductos(prevProductos => prevProductos.map(producto =>
              producto.id === id ? { ...producto, isDeleted: nuevoEstado } : producto
            ));
          })
          .catch(error => {
            console.error('Error al actualizar el producto:', error);
          });
      })
      .catch(error => {
        console.error('Error al obtener el producto:', error);
      });
  };

  // Paginación lógica
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);
  const indiceUltimoProducto = paginaActual * productosPorPagina;
  const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
  const productosPaginados = productos.slice(indicePrimerProducto, indiceUltimoProducto);

  const cambiarPagina = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', marginBottom: '150px' }}>
      <Menu />
      <div style={{ margin: '20px', paddingTop: '140px' }}>
        <Link to="/crear-producto">
          <button style={{ margin: '10px', padding: '10px', backgroundColor: '#4CAF50', color: 'white' }}>Agregar producto</button>
        </Link>
        {/* <button style={{ margin: '10px', padding: '10px', backgroundColor: '#008CBA', color: 'white' }} onClick={() => setShowModal(true)}>Generar Excel</button> */}
        <Modal show={showModal} onHide={cerrarModal}>
          <Modal.Header closeButton>
            {/* <Modal.Title>Generar Excel</Modal.Title> */}
          </Modal.Header>
          <Modal.Body className="modal-body">
            <label>Fecha desde:</label>
            <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} />
            <label>Fecha hasta:</label>
            <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} />
          </Modal.Body>
          <Modal.Footer>
            {/* <button onClick={generarExcel}>Generar</button> */}
            <button onClick={cerrarModal}>Cerrar</button>
          </Modal.Footer>
        </Modal>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: 'white', backgroundColor: '#6E2A65' }}>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Producto</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Marca</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Modelo</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Precio</th>
              {/* <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Cantidad vendida</th> */}
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Costo de envío</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Categoria</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosPaginados.map(producto => (
              <tr
                key={producto.id}
                className={producto.isDeleted ? 'eliminado' : ''}
                style={{ backgroundColor: producto.isDeleted ? '#ff6961' : '#2ECC71' }}
              >
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{producto.producto}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{producto.marca}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{producto.modelo}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{producto.precio}</td>
                {/* <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{producto.cantidadVendida}</td> */}
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{producto.costoEnvio}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{producto.idCategoria}</td>
                <td className="acciones" style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  <button onClick={() => cambiarEstadoProducto(producto.id, producto.isDeleted)}>
                    {producto.isDeleted ? 'Restaurar' : 'Eliminar'}
                  </button>
                  <Link to={`/productos/${producto.id}/modificar`}>
                    <button>Modificar</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Paginación */}
        {totalPaginas > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              Anterior
            </button>
            {[...Array(totalPaginas)].map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => cambiarPagina(idx + 1)}
                style={{
                  fontWeight: paginaActual === idx + 1 ? 'bold' : 'normal',
                  margin: '0 4px'
                }}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventarioList;