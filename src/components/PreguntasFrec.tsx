import React, { useState } from 'react';
import Menu from './Menu';
import '../styles/Preguntas.css';

const preguntas = [
  {pregunta: "¿QUÉ ES HUELLITAS PET SHOP?",respuesta:"Es el sitio web donde vas a poder encontrar todo lo que necesitás para tus mascotas.Registrándote en HUELLITAS PET SHOP vas a poder adquirir todos los productos que ofrecen las mejores veterinarias del país."},
  {pregunta: "¿QUÉ PRODUCTOS Y MARCAS VENDEN?",respuesta:"En HUELLITAS PET SHOP vas a encontrar todos los productos que ofrecen las veterinarias o petshops de renombre.Nuestro objetivo es que encuentres las mejores marcas en categorias principales como alimentos pero tambien accesorios para tu mascota."},
  {pregunta: "¿PARA COMPRAR LOS PRODUCTOS,HACE FALTA TENER UNA CUENTA?",respuesta:"Para poder realizar una compra es necesario que estés registrado y logueado en HUELLITAS PET SHOP. Te recomendamos que lo hagas la primera vez que ingresás al sitio, aunque podés igualmente completarlo al momento del checkout."},
  {pregunta: "¿HAY UNA COMPRA MINIMA OBLIGATORIA?",respuesta:"No, en nuestra web puedes realizar la compra que quieras sin un importe mínimo obligatorio."},
  {pregunta: "¿QUÉ DEBO HACER SI EL PRODUCTO NO LLEGA EN BUEN ESTADO?",respuesta:"HUELLITAS PET SHOP sólo vende artículos en perfecto estado, por lo que si, excepcionalmente te llega un producto con algun desperfecto ponte en contacto con nuestro departamento de atención al cliente haciendo uso de cualquiera de nuestras vías de contacto."},
  {pregunta: "¿DONDE SE ENCUENTRAN?",respuesta:"Nuestro local está ubicado en Mendoza Shopping."}
];

const PreguntasFrec = () => {
  const [abierta, setAbierta] = useState<number | null>(null);

  const toggle = (index: number) => {
    setAbierta(abierta === index ? null : index);
  };

  return (
    <>
      <Menu />
      <div className="preguntas-page">
        <h1 className="preguntas-titulo">PREGUNTAS FRECUENTES</h1>
        <ul className="preguntas-lista">
          {preguntas.map((item, index) => (
            <li key={index} className="pregunta-item">
              <div className="pregunta-header" onClick={() => toggle(index)}>
                <strong>{item.pregunta}</strong>
                <span className="flechita">{abierta === index ? "-" : "+"}</span>
              </div>
              {abierta === index && (
                <p className="pregunta-respuesta">{item.respuesta}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default PreguntasFrec;
