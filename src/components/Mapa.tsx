import React from 'react';
import Menu from './Menu';
import '../styles/Nosotros.css';

const Mapa = () => {
  return (
    <>
      <Menu />
      <div className="main-content" style={{ paddingTop: '140px' }}>
        <div className="acarrecado-container">
          <h2 className="acarrecado-titulo">
            <span className="huella-animada"></span> ¡ACÁ PODÉS ENCONTRARNOS!
          </h2>
          <p className="acarrecado-subtitulo">
            Nuestro local está ubicado en Mendoza Shopping, ¡te esperamos con la mejor atención!
          </p>
        </div>

        <div className="map-wrapper">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13398.765965138957!2d-68.79896165!3d-32.90632415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e0ea0bc78593d%3A0x61932a53d62932c7!2sMendoza%20Shopping!5e0!3m2!1ses-419!2sar!4v1718318393894!5m2!1ses-419!2sar"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="map-iframe"
            title="Mapa Mendoza Shopping"
          ></iframe>

          <button
            className="btn-maps"
            onClick={() =>
              window.open(
                'https://www.google.com/maps/search/?api=1&query=Mendoza+Shopping+Mendoza+Argentina',
                '_blank'
              )
            }
          >
            Ver en Google Maps
          </button>
        </div>

        <div className="col-md-12 mb-5">
          <h2 className="titulo-nosotros">
            <span className="huella-animada">🐾</span> ¿Cómo trabajamos?🐾
          </h2>
          <p className="descripcion-nosotros">
            En <strong>nuestro pet shop</strong> nos enfocamos en brindar una experiencia <em>cálida, personalizada y responsable</em>. 
            Trabajamos con <span className="resaltado-morado">amor y compromiso</span> para que cada mascota reciba 
            los productos y cuidados que merece. <br />
            <em>¡Te esperamos con la mejor atención y un equipo apasionado por los animales!</em>
          </p>
        </div>
      </div>
    </>
  );
};

export default Mapa;