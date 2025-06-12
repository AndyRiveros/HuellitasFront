import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import Producto from '../types/Productos';
import Categoria from '../types/Categoria';

const validationSchema = yup.object().shape({
  producto: yup.string().required('Requerido'),
  marca: yup.string().required('Requerido'),
  modelo: yup.string().required('Requerido'),
  precio: yup.number().typeError('Debe ser un número').required('Requerido'),
  costoEnvio: yup.string().required('Requerido'),
  imagen: yup.string().required('Requerido'),
  descripcion: yup.string(),
  especie: yup.string().required('Requerido'),
  tipo: yup.string().required('Requerido'),
  etapa: yup.string(),
  categoria: yup.object().shape({
    id: yup.string().required('Selecciona una categoría'),
  }),
});

const ModificarProducto: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [producto, setProducto] = useState<any>({
    id: 0,
    producto: '',
    marca: '',
    modelo: '',
    imagen: '',
    precio: '',
    costoEnvio: '',
    cantidadVendida: 0,
    descripcion: '',
    idCategoria: 0,
    isDeleted: false,
    especie: '',
    tipo: '',
    etapa: '',
    categoria: { id: '' }, // Importante para Formik/yup
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const fetchProductoYCategorias = async () => {
      const responseProducto = await fetch(`http://localhost:8080/api/productos/${id}`);
      const dataProducto = await responseProducto.json();

      // Asegura que categoria.id sea string para el select y validación
      setProducto({
        ...dataProducto,
        precio: String(dataProducto.precio),
        costoEnvio: String(dataProducto.costoEnvio),
        cantidadVendida: Number(dataProducto.cantidadVendida),
        especie: dataProducto.especie || '',
        tipo: dataProducto.tipo || '',
        etapa: dataProducto.etapa || '',
        categoria: { id: String(dataProducto.idCategoria || dataProducto.categoria?.id || '') },
      });

      const responseCategorias = await fetch('http://localhost:8080/api/categorias');
      const dataCategorias = await responseCategorias.json();
      setCategorias(dataCategorias);
    };

    fetchProductoYCategorias();
  }, [id]);

  const handleSubmit = async (values: any) => {
    // Asegura que idCategoria se envíe correctamente al backend
    const valuesToSend = {
      ...values,
      idCategoria: Number(values.categoria.id),
    };
    try {
      const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(valuesToSend),
      });

      if (response.status === 200) {
        navigate('/productos');
      } else {
        console.error('Error al modificar el producto');
      }
    } catch (error) {
      console.error('Error inesperado:', error);
    }
  };

  return (
    <div style={{ marginBottom: '150px' }}>
      <Formik
        enableReinitialize
        initialValues={producto}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isValid, isSubmitting }) => (
          <Form className="form-container">
            <div className="form-group">
              <label htmlFor="producto">Producto:</label>
              <Field type="text" id="producto" name="producto" />
              <ErrorMessage name="producto" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="marca">Marca:</label>
              <Field type="text" id="marca" name="marca" />
              <ErrorMessage name="marca" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="modelo">Modelo:</label>
              <Field type="text" id="modelo" name="modelo" />
              <ErrorMessage name="modelo" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="imagen">Imagen:</label>
              <Field type="text" id="imagen" name="imagen" />
              <ErrorMessage name="imagen" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="precio">Precio:</label>
              <Field type="text" id="precio" name="precio" />
              <ErrorMessage name="precio" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="costoEnvio">Costo de envío:</label>
              <Field type="text" id="costoEnvio" name="costoEnvio" />
              <ErrorMessage name="costoEnvio" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="descripcion">Descripción:</label>
              <Field as="textarea" id="descripcion" name="descripcion" />
              <ErrorMessage name="descripcion" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="categoria.id">Categoría:</label>
              <Field as="select" id="categoria.id" name="categoria.id">
                <option value="">Selecciona una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.denominacion}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="categoria.id" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="especie">Especie:  </label>
              <Field as="select" name="especie">
                <option value="">Selecciona especie</option>
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
                <option value="ave">Ave</option>
                <option value="pez">Pez</option>
              </Field>
              <ErrorMessage name="especie" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="tipo">Tipo:   </label>
              <Field as="select" name="tipo">
                <option value="">Selecciona tipo</option>
                <option value="alimento">Alimento</option>
                <option value="salud">Salud</option>
                <option value="estetica">Estética</option>
                <option value="snack">Snack</option>
                <option value="oferta">Oferta</option>
              </Field>
              <ErrorMessage name="tipo" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="etapa">Etapa (opcional):</label>
              <Field as="select" name="etapa">
                <option value="">Selecciona etapa</option>
                <option value="cachorro">Cachorro</option>
                <option value="adulto">Adulto</option>
                <option value="senior">Senior</option>
              </Field>
              <ErrorMessage name="etapa" component="div" className="error-message" />
            </div>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="submit-button"
            >
              Modificar Producto
            </button>
            <button type="button" onClick={() => navigate(-1)} className="cancel-button">Cancelar</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ModificarProducto;