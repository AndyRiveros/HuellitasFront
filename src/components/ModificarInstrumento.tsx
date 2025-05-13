import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup'; // Importing the 'yup' package
import { useNavigate, useParams } from 'react-router-dom';
import Instrumento from '../types/Instrumentos';
import Categoria from '../types/Categoria';
// Importando la interfaz Instrumento


const validationSchema = yup.object({
  instrumento: yup.string(),
  marca: yup.string(),
  modelo: yup.string(),
  imagen: yup.string().url(),
  precio: yup.string(), // Cambiado a string porque se espera un string
  costoEnvio: yup.string(), // Cambiado a string porque se espera un string
  cantidadVendida: yup.number(), // Cambiado a string porque se espera un string
  descripcion: yup.string(),
  categoria: yup.object().shape({
    id: yup.string(),
  }),
});

const ModificarInstrumento: React.FC = () => {
  const navigate = useNavigate(); // Use the useHistory hook

    const { id } = useParams(); // Obtener el id desde los parámetros de la URL
  const [instrumento, setInstrumento] = useState<Instrumento>({
    id: 0,
    instrumento: '',
    marca: '',
    modelo: '',
    imagen: '',
    precio: '',
    costoEnvio: '',
    cantidadVendida: 0,
    descripcion: '',
    idCategoria: 0,
    isDeleted: false,
  });
    const [categorias, setCategorias] = useState<Categoria[]>([]); // Estado para las categorías

    useEffect(() => {
        // Carga de datos del instrumento y las categorías
        const fetchInstrumentoYCategorias = () => {
          fetch(`http://localhost:8080/api/instrumentos/${id}`)
            .then(responseInstrumento => responseInstrumento.json())
            .then(dataInstrumento => {
              setInstrumento({
                ...dataInstrumento,
                precio: String(dataInstrumento.precio),
                costoEnvio: String(dataInstrumento.costoEnvio),
                cantidadVendida: Number(dataInstrumento.cantidadVendida) ,
                idCategoria: dataInstrumento.idCategoria,
              });
      
              fetch('http://localhost:8080/api/categorias') // Ruta para obtener las categorías
                .then(responseCategorias => responseCategorias.json())
                .then(dataCategorias => {
                  setCategorias(dataCategorias);
                });
            });
        };
      
        fetchInstrumentoYCategorias();
      }, [id]);

  const handleSubmit = async (values: Instrumento) => {
    try {
        console.log(values.id); // Agrega esta línea
      const response = await fetch(`http://localhost:8080/api/instrumentos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.status === 200) {
        // Actualizar la interfaz con el mensaje de éxito
        console.log('Instrumento modificado correctamente');
        navigate('/instrumentos');
      } else {
        // Manejar el error de actualización
        console.error('Error al modificar el instrumento');
      }
    } catch (error) {
      console.error('Error inesperado:', error);
    }
  };

  return (
    <Formik
        enableReinitialize
      initialValues={instrumento}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isValid, isSubmitting }) => (
        <Form className="form-container">
          <div className="form-group">
            <label htmlFor="instrumento">Instrumento:</label>
            <Field type="text" id="instrumento" name="instrumento" />
            {touched.instrumento && errors.instrumento && (
              <ErrorMessage name="instrumento" component="div" className="error-message" />
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
            <Field type="text" id="costoEnvio" name="costoEnvio" />
            {touched.costoEnvio && errors.costoEnvio && (
              <ErrorMessage name="costoEnvio" component="div" className="error-message" />
            )}
          </div>
          <div className="form-group">
            <label htmlFor="cantidadVendida">Cantidad Vendida:</label>
            <Field type="text" id="cantidadVendida" name="cantidadVendida" />
            {touched.cantidadVendida && errors.cantidadVendida && (
              <ErrorMessage name="cantidadVendida" component="div" className="error-message" />
            )}
          </div>
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
          <button 
              type="submit" 
              disabled={!isValid || isSubmitting}  // Ahora utilizas las propiedades correctamente
              className="submit-button"
            >
                Modificar Instrumento
            </button>
            <button type="button" onClick={() => navigate(-1)} className="cancel-button">Cancelar</button>
        </Form>
      )}
    </Formik>
  );
};

export default ModificarInstrumento;

