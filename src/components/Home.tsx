import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import { Carousel } from 'react-bootstrap'; // Asegúrate de instalar este paquete
import '../styles/Home.css';
import Instrumento from '../types/Instrumentos'; // Asegúrate de tener este tipo definido

const Home = () => {
  const [productos, setProductos] = useState<Instrumento[]>([]);

  useEffect(() => {
    // Llamada al backend para obtener todos los productos
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/instrumentos');
        const data = await response.json();

        // Asegúrate de que los datos sean un array
        if (Array.isArray(data)) {
          setProductos(data);
        } else {
          console.error('El formato de los datos no es válido:', data);
        }
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div>
      <Menu />
      <div className="home-container home">
        <div className="title-container divsep">
          <h2 className="title anton-regular">HUELLITAS - Pet Shop</h2>
        </div>
        <div className="divsep">
          <div className="description">
            <p className="parrafo">
              ¡Bienvenidos a Huellitas Pet! Aquí encontrarás todo lo que necesitas para consentir a tus mascotas: alimentos de alta calidad, juguetes divertidos, ropa adorable, accesorios y mucho más. Nos especializamos en ofrecer productos para todo tipo de mascotas, desde perros y gatos hasta aves, peces y pequeños roedores. ¡Tu mascota merece lo mejor, y en Huellitas Pet lo tenemos todo!
            </p>
          </div>
        </div>
       <Carousel className="custom-carousel">
  <Carousel.Item>
    <img className="d-block w-100" src="img/banner.jpg" alt="Imagen 1" />
  </Carousel.Item>
  <Carousel.Item>
    <img className="d-block w-100" src="img/banner2.jpg" alt="Imagen 2" />
  </Carousel.Item>
  <Carousel.Item>
    <img className="d-block w-100" src="img/musica3.jpg" alt="Imagen 3" />
  </Carousel.Item>
</Carousel>

        {/* Carrusel de productos existentes */}
        <div className="productos-existentes">
          <h3 className="section-title">Nuestros Productos</h3>
          <Carousel className="productos-carousel" indicators={false}>
            {productos.length > 0 ? (
              productos.reduce((result, producto, index) => {
                const groupIndex = Math.floor(index / 4);
                if (!result[groupIndex]) {
                  result[groupIndex] = [];
                }
                result[groupIndex].push(producto);
                return result;
              }, [] as Instrumento[][]).map((grupo, index) => (
                <Carousel.Item key={index}>
                  <div className="productos-row">
                    {grupo.map((producto) => (
                      <div className="producto-card" key={producto.id}>
                        <img
                          src={producto.imagen}
                          alt={producto.instrumento}
                          className="producto-imagen"
                        />
                        <h4>{producto.instrumento}</h4>
                        <p>Precio: ${producto.precio}</p>
                      </div>
                    ))}
                  </div>
                </Carousel.Item>
              ))
            ) : (
              <p>Cargando productos...</p>
            )}
          </Carousel>
        </div>
        {/* Carrusel de productos existentes */}
        <div className="productos-existentes">
          <h3 className="section-title">Para Adultos</h3>
          <Carousel className="productos-carousel" indicators={false}>
            {productos.length > 0 ? (
              productos.reduce((result, producto, index) => {
                const groupIndex = Math.floor(index / 4);
                if (!result[groupIndex]) {
                  result[groupIndex] = [];
                }
                result[groupIndex].push(producto);
                return result;
              }, [] as Instrumento[][]).map((grupo, index) => (
                <Carousel.Item key={index}>
                  <div className="productos-row">
                    {grupo.map((producto) => (
                      <div className="producto-card" key={producto.id}>
                        <img
                          src={producto.imagen}
                          alt={producto.instrumento}
                          className="producto-imagen"
                        />
                        <h4>{producto.instrumento}</h4>
                        <p>Precio: ${producto.precio}</p>
                      </div>
                    ))}
                  </div>
                </Carousel.Item>
              ))
            ) : (
              <p>Cargando productos...</p>
            )}
          </Carousel>
        </div>
        {/* Carrusel de productos existentes */}
        <div className="productos-existentes">
          <h3 className="section-title">Para Cachorros</h3>
          <Carousel className="productos-carousel" indicators={false}>
            {productos.length > 0 ? (
              productos.reduce((result, producto, index) => {
                const groupIndex = Math.floor(index / 4);
                if (!result[groupIndex]) {
                  result[groupIndex] = [];
                }
                result[groupIndex].push(producto);
                return result;
              }, [] as Instrumento[][]).map((grupo, index) => (
                <Carousel.Item key={index}>
                  <div className="productos-row">
                    {grupo.map((producto) => (
                      <div className="producto-card" key={producto.id}>
                        <img
                          src={producto.imagen}
                          alt={producto.instrumento}
                          className="producto-imagen"
                        />
                        <h4>{producto.instrumento}</h4>
                        <p>Precio: ${producto.precio}</p>
                      </div>
                    ))}
                  </div>
                </Carousel.Item>
              ))
            ) : (
              <p>Cargando productos...</p>
            )}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Home;