import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Instrumento from '../types/Instrumentos';
import Menu from './Menu';
import { Modal } from 'react-bootstrap';

const InventarioList: React.FC = () => {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [showModal, setShowModal] = useState(false);

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
  };

  useEffect(() => {
    const fetchInstrumentos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/instrumentos');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error al obtener instrumentos:', error);
        return [];
      }
    };

    fetchInstrumentos()
      .then(instrumentos => {
        setInstrumentos(instrumentos);
      })
      .catch(error => {
        console.error('Error al obtener instrumentos:', error);
      });
  }, []);

  const cambiarEstadoInstrumento = (id: number, isDeleted: boolean) => {
    const nuevoEstado = !isDeleted;
  
    axios.get(`http://localhost:8080/api/instrumentos/${id}`)
      .then(response => {
        const instrumento = response.data;
        instrumento.isDeleted = nuevoEstado;
  
        axios.put(`http://localhost:8080/api/instrumentos/${id}`, instrumento)
          .then(() => {
            setInstrumentos(prevInstrumentos => prevInstrumentos.map(instrumento =>
              instrumento.id === id ? { ...instrumento, isDeleted: nuevoEstado } : instrumento
            ));
          })
          .catch(error => {
            console.error('Error al actualizar el instrumento:', error);
          });
      })
      .catch(error => {
        console.error('Error al obtener el instrumento:', error);
      });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <Menu /> 
      <div style={{ margin: '20px' }}>
        <Link to="/crear-instrumento">
          <button style={{ margin: '10px', padding: '10px', backgroundColor: '#4CAF50', color: 'white' }}>Agregar Instrumento</button>
        </Link>
        <button style={{ margin: '10px', padding: '10px', backgroundColor: '#008CBA', color: 'white' }} onClick={() => setShowModal(true)}>Generar Excel</button>
        <Modal show={showModal} onHide={cerrarModal}>
          <Modal.Header closeButton>
            <Modal.Title>Generar Excel</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <label>Fecha desde:</label>
            <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} />
            <label>Fecha hasta:</label>
            <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} />
          </Modal.Body>
          <Modal.Footer>
            <button onClick={generarExcel}>Generar</button>
            <button onClick={cerrarModal}>Cerrar</button>
          </Modal.Footer>
        </Modal>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}> 
          <thead>
            <tr style={{ color: 'white', backgroundColor: 'black' }}>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Instrumento</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Marca</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Modelo</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Precio</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Cantidad vendida</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Costo de envío</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Categoria</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {instrumentos.map(instrumento => (
              <tr
                key={instrumento.id}
                className={instrumento.isDeleted ? 'eliminado' : ''}
                style={{ backgroundColor: instrumento.isDeleted ? '#FFBABA' : '#B0E57C' }}
              >
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{instrumento.instrumento}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{instrumento.marca}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{instrumento.modelo}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{instrumento.precio}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{instrumento.cantidadVendida}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{instrumento.costoEnvio}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{instrumento.idCategoria}</td>
                <td className="acciones" style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  <button onClick={() => cambiarEstadoInstrumento(instrumento.id, instrumento.isDeleted)}>
                    {instrumento.isDeleted ? 'Restaurar' : 'Eliminar'}
                  </button>
                  <Link to={`/instrumentos/${instrumento.id}/modificar`}>
                    <button>Modificar</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventarioList;
