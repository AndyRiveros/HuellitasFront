import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup'; // Importing the 'yup' package
import { useNavigate, useParams } from 'react-router-dom';
import Producto from '../types/Productos';
import Categoria from '../types/Categoria';
// Importando la interfaz Producto


const validationSchema = yup.object().shape({
  producto: yup.string().required('Requerido'),
  marca: yup.string().required('Requerido'),
  modelo: yup.string().required('Requerido'),
  precio: yup.number().required('Requerido'),
  costoEnvio: yup.string().required('Requerido'),
  imagen: yup.string().required('Requerido'),
  descripcion: yup.string(),
  especie: yup.string().required('Requerido'), // Nuevo
  tipo: yup.string().required('Requerido'),    // Nuevo
  etapa: yup.string(),                         // Opcional
  categoria: yup.object().shape({
    id: yup.string().required('Selecciona una categoría'),
  }),
});

const ModificarProducto: React.FC = () => {
  const navigate = useNavigate(); // Use the useHistory hook

    const { id } = useParams(); // Obtener el id desde los parámetros de la URL
  const [producto, setProducto] = useState<Producto>({
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
     especie: '',   // Nuevo
  tipo: '',      // Nuevo
  etapa: '', 
  });
    const [categorias, setCategorias] = useState<Categoria[]>([]); // Estado para las categorías

    useEffect(() => {
        // Carga de datos del producto y las categorías
        const fetchProductoYCategorias = () => {
          fetch(`http://localhost:8080/api/productos/${id}`)
            .then(responseProducto => responseProducto.json())
            .then(dataProducto => {
              setProducto({
                ...dataProducto,
                precio: String(dataProducto.precio),
                costoEnvio: String(dataProducto.costoEnvio),
                cantidadVendida: Number(dataProducto.cantidadVendida) ,
                idCategoria: dataProducto.idCategoria,
              });
      
              fetch('http://localhost:8080/api/categorias') // Ruta para obtener las categorías
                .then(responseCategorias => responseCategorias.json())
                .then(dataCategorias => {
                  setCategorias(dataCategorias);
                });
            });
        };
      
        fetchProductoYCategorias();
      }, [id]);

  const handleSubmit = async (values: Producto) => {
    try {
        console.log(values.id); // Agrega esta línea
      const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.status === 200) {
        // Actualizar la interfaz con el mensaje de éxito
        console.log('Producto modificado correctamente');
        navigate('/productos');
      } else {
        // Manejar el error de actualización
        console.error('Error al modificar el producto');
      }
    } catch (error) {
      console.error('Error inesperado:', error);
    }
  };

  return (
  <div style={{ marginBottom: '150px' }}> {/* Contenedor con margen inferior */}
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
            {touched.producto && errors.producto && (
              <ErrorMessage name="producto" component="div" className="error-message" />
            )}
          </div>
          <div className="form-group">
            <label htmlFor="marca">Marca:</label>
            <Field type="text" id="marca" name="marca" />
            {touched.marca && errors.marca && (
              <ErrorMessage name="marca" component="div" className="error-message" />
            )}
          </div>
          <div className="form-group">
            <label htmlFor="modelo">Modelo:</label>
            <Field type="text" id="modelo" name="modelo" />
            {touched.modelo && errors.modelo && (
              <ErrorMessage name="modelo" component="div" className="error-message" />
            )}
          </div>
          <div className="form-group">
            <label htmlFor="imagen">Imagen:</label>
            <Field type="text" id="imagen" name="imagen" />
            {touched.imagen && errors.imagen && (
              <ErrorMessage name="imagen" component="div" className="error-message" />
            )}
          </div>
          <div className="form-group">
            <label htmlFor="precio">Precio:</label>
            <Field type="text" id="precio" name="precio" />
            {touched.precio && errors.precio && (
              <ErrorMessage name="precio" component="div" className="error-message" />
            )}
          </div>
         <div className="form-group">
          <label htmlFor="costoEnvio">Costo de envío:</label>
         <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 4 }}>$</span>
        <Field type="text" id="costoEnvio" name="costoEnvio" style={{ flex: 1 }} />
           </div>
  {touched.costoEnvio && errors.costoEnvio && (
    <ErrorMessage name="costoEnvio" component="div" className="error-message" />
  )}
</div>
          {/* <div className="form-group">
            <label htmlFor="cantidadVendida">Cantidad Vendida:</label>
            <Field type="text" id="cantidadVendida" name="cantidadVendida" />
            {touched.cantidadVendida && errors.cantidadVendida && (
              <ErrorMessage name="cantidadVendida" component="div" className="error-message" />
            )}
          </div> */}
          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <Field type="textarea" id="descripcion" name="descripcion" />
            {touched.descripcion && errors.descripcion && (
              <ErrorMessage name="descripcion" component="div" className="error-message" />
            )}
          </div>
          <div className="form-group">
            <label htmlFor="categoria.id">Categoría:</label>
            <Field as="select" id="categoria.id" name="categoria.id">
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.denominacion}
                </option>
              ))}
            </Field>
            {touched.idCategoria && errors.idCategoria && (
              <ErrorMessage name="categoria.id" component="div" className="error-message" />
            )}
          </div>
          <div className="form-group">
  <label htmlFor="especie">Especie:  </label>
  <Field as="select" name="especie">
    <option value="">Selecciona especie</option>
    <option value="perro">Perro</option>
    <option value="gato">Gato</option>
    <option value="ave">Ave</option>
    <option value="pez">Pez</option>
    {/* Agrega más si necesitas */}
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
    {/* Agrega más si necesitas */}
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
              disabled={!isValid || isSubmitting}  // Ahora utilizas las propiedades correctamente
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

