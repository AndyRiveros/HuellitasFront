/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {  useNavigate } from 'react-router-dom';
import Categoria from '../types/Categoria';
// import Resizer from 'react-image-file-resizer'; // Import the Resizer module

import '../styles/CrearInstrumento.css'; // Importa tu archivo CSS aquí


const CrearInstrumentoForm: React.FC = () => {
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState<Categoria[]>([]);
  
    useEffect(() => {
      fetch('http://localhost:8080/api/categorias')
        .then((response) => response.json())
        .then((data) => setCategorias(data));
    }, []);
  
    const validationSchema = Yup.object().shape({
      instrumento: Yup.string().required('Requerido'),
      marca: Yup.string().required('Requerido'),
      modelo: Yup.string().required('Requerido'),
      precio: Yup.number().required('Requerido'),
      costoEnvio: Yup.string().required('Requerido'),
      imagen: Yup.string().required('Requerido'),
      descripcion: Yup.string(),
      categoria: Yup.object().shape({
        id: Yup.string().required('Selecciona una categoría'),
      }),
    });

    const handleSubmit = (values: any, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
      
      fetch(`http://localhost:8080/api/instrumentos?idCategoria=${values.categoria.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        navigate('/instrumentos'); 
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  
      setSubmitting(false);
  };

  return (
    <Formik
  initialValues={{ instrumento: '', marca: '', modelo: '', precio: '', costoEnvio: '', imagen: '', descripcion: '',     cantidadVendida: 0,   categoria: { id: '' }, // Objeto de tipo Categoria
}}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  {({ isSubmitting }) => (
    <Form className="form-container" style={{color: 'white'}}>
      <div className="form-group">
        <label htmlFor="instrumento">Instrumento:</label>
        <Field type="text" name="instrumento" />
        <ErrorMessage name="instrumento" component="div" className="error-message" />
      </div>
      <div className="form-group">
        <label htmlFor="marca">Marca:</label>
        <Field type="text" name="marca" />
        <ErrorMessage name="marca" component="div" className="error-message" />
      </div>
      <div className="form-group">
        <label htmlFor="modelo">Modelo:</label>
        <Field type="text" name="modelo" />
        <ErrorMessage name="modelo" component="div" className="error-message" />
      </div>
      <div className="form-group">
        <label htmlFor="precio">Precio:</label>
        <Field type="text" name="precio" />
        <ErrorMessage name="precio" component="div" className="error-message" />
      </div>
      <div className="form-group">
        <label htmlFor="costoEnvio">Costo de Envío:</label>
        <Field type="text" name="costoEnvio" />
        <ErrorMessage name="costoEnvio" component="div" className="error-message" />
      </div>
      <div className="form-group">
        <label htmlFor="imagen">Imagen:</label>
        <Field type="text" name="imagen" />
        <ErrorMessage name="imagen" component="div" className="error-message" />
      </div>
      <div className="form-group">
        <label htmlFor="descripcion">Descripción:</label>
        <Field type="text" name="descripcion" />
        <ErrorMessage name="descripcion" component="div" className="error-message" />
      </div>
      <div className="form-group">
        <label htmlFor="categoria.id">Categoría:</label> 
        <Field as="select" name="categoria.id"> 
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}> 
                {categoria.denominacion} 
            </option>
            ))}
        </Field>
  <ErrorMessage name="categoria.id" component="div" className="error-message" />
</div>
      <button type="submit" disabled={isSubmitting} className="submit-button">Crear Instrumento</button>
      <button type="button" onClick={() => navigate(-1)} className="cancel-button">Cancelar</button>
    </Form>
  )}
</Formik>
  );
};

export default CrearInstrumentoForm;