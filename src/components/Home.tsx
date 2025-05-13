import React from 'react';
import Menu from './Menu';
import { Carousel } from 'react-bootstrap'; // Asegúrate de instalar este paquete
import '../styles/Home.css';

const Home = () => {
  return (
    <div>
    <Menu />
    <div className="home-container home "> 
      <div className="title-container divsep">
        <h2 className="title anton-regular">Casa B3 - Instrumentos Musicales</h2>
      </div>
      <div className='divsep'>
        <div className="description">
          <p className='parrafo'> 
          ¡Bienvenidos a Casa B3 Instrumentos Musicales! Aquí encontrarás una amplia selección de instrumentos de calidad y accesorios para todos los músicos, desde principiantes hasta profesionales. Ven y descubre la pasión por la música en cada rincón de nuestra tienda. ¡Tu sonido perfecto te espera!</p>
        </div>
      </div>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="img/musica1.png"
            alt="Imagen 1"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="img/musica2.jpg"
            alt="Imagen 2"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="img/musica3.jpg"
            alt="Imagen 3"
          />
        </Carousel.Item>
      </Carousel>
    </div>
    </div>
  );
}

export default Home;