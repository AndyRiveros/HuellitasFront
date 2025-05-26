import { useEffect, useState, useContext } from 'react';
import Menu from './Menu';
import { Carousel } from 'react-bootstrap';
import '../styles/Home.css';
import Producto from '../types/Productos';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import { CarritoContext } from '../components/CarritoContext';
import Modal from 'react-modal';
import Carrito from './Carrito';
import FloatingCarritoButton from './FloatingCarritoButton';


const Home = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const authContext = useContext(AuthContext);
  const carritoContext = useContext(CarritoContext);
  const usuario = authContext ? authContext.usuario : undefined;
  const navigate = useNavigate();
  


  const [showCarrito, setShowCarrito] = useState(false);


  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/productos');
        const data = await response.json();

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


  const agregarAlCarrito = (producto: Producto) => {
    if (!usuario) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      navigate('/login'); // Redirige al login si no está autenticado
      return;
    }

    carritoContext?.agregarAlCarrito(producto);
  };

  const abrirCarrito = () => {
    setShowCarrito(true);
  };

  const cerrarCarrito = () => {
    setShowCarrito(false);
  };


  return (
    <div>
      <Menu />
      <div className="home-container home"  style={{ paddingTop: '148px' }}>
        <div className="title-container divsep">
          <h2 className="title anton-regular">HUELLITAS - Pet Shop</h2>
        </div>
        <div className="divsep" style={{ marginBottom: 0, paddingBottom: 0 }}>
          <div className="description" style={{ marginBottom: 20, paddingBottom: 0 }}>
            <p className="parrafo" style={{ marginBottom: 0, paddingBottom: 0 }}>
              ¡Bienvenidos a Huellitas Pet! Aquí encontrarás todo lo que necesitas para consentir a tus mascotas: alimentos de alta calidad, juguetes divertidos, ropa adorable, accesorios y mucho más. Nos especializamos en ofrecer productos para todo tipo de mascotas, desde perros y gatos hasta aves, peces y pequeños roedores. ¡Tu mascota merece lo mejor, y en Huellitas Pet lo tenemos todo!
            </p>
          </div>
        </div>
        <div className="divsep" style={{ marginBottom: 20 }}>
</div>

  {/* Mostrar el carrito flotante solo si el usuario no es ADMIN */}
        {usuario?.rol !== 'ADMIN' && (carritoContext?.carrito?.length ?? 0) > 0 && (
          <FloatingCarritoButton onClick={abrirCarrito} />
        )}
        <Modal isOpen={showCarrito} onRequestClose={cerrarCarrito}>
          <Carrito carrito={carritoContext?.carrito || []} onEliminarDelCarrito={carritoContext?.eliminarDelCarrito || (() => {})} />
          <button onClick={cerrarCarrito}>Cerrar Carrito</button>
        </Modal>
        <Carousel className="custom-carousel">
          <Carousel.Item>
            <img className="d-block w-100" src="img/banner.jpg" alt="Imagen 1" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="img/banner2.jpg" alt="Imagen 2" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="https://thumbs.dreamstime.com/b/muchos-gatos-de-diferentes-razas-y-tama%C3%B1os-sobre-fondo-blanco-banner-web-para-publicidad-cl%C3%ADnicas-veterinarias-sal%C3%B3n-belleza-278094388.jpg" alt="Imagen 3" />
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
              }, [] as Producto[][]).map((grupo, index) => (
                <Carousel.Item key={index}>
                  <div className="productos-row">
                    {grupo.map((producto) => (
                      <div className="producto-card" key={producto.id}>
                        <img
                          src={producto.imagen}
                          alt={producto.producto}
                          className="producto-imagen"
                        />
                        <h4>{producto.producto}</h4>
                        <p>Precio: ${producto.precio}</p>
                        {/* Mostrar el botón "Agregar al carrito" solo si el usuario no es ADMIN */}
                        {usuario?.rol !== 'ADMIN' && (
                          <button onClick={() => agregarAlCarrito(producto)}>
                            Agregar al carrito
                          </button>
                        )}
                        <Link to={`/producto/${producto.id}`}>
                          <button>Ver detalles</button>
                        </Link>
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
        {/* Carrusel de productos para adultos */}
        <div className="productos-existentes">
          <h3 className="section-title">Lo más vendido</h3>
          <Carousel className="productos-carousel" indicators={false}>
            {productos.length > 0 ? (
              productos.reduce((result, producto, index) => {
                const groupIndex = Math.floor(index / 4);
                if (!result[groupIndex]) {
                  result[groupIndex] = [];
                }
                result[groupIndex].push(producto);
                return result;
              }, [] as Producto[][]).map((grupo, index) => (
                <Carousel.Item key={index}>
                  <div className="productos-row">
                    {grupo.map((producto) => (
                      <div className="producto-card" key={producto.id}>
                        <img
                          src={producto.imagen}
                          alt={producto.producto}
                          className="producto-imagen"
                        />
                        <h4>{producto.producto}</h4>
                        <p>Precio: ${producto.precio}</p>
                       {/* Mostrar el botón "Agregar al carrito" solo si el usuario no es ADMIN */}
                        {usuario?.rol !== 'ADMIN' && (
                          <button onClick={() => agregarAlCarrito(producto)}>
                            Agregar al carrito
                          </button>
                        )}
                        <Link to={`/producto/${producto.id}`}>
                          <button>Ver detalles</button>
                        </Link>
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
        {/* Carrusel de productos para cachorros */}
        <div className="productos-existentes">
          <h3 className="section-title">Nuevos Ingresos</h3>
          <Carousel className="productos-carousel" indicators={false}>
            {productos.length > 0 ? (
              productos.reduce((result, producto, index) => {
                const groupIndex = Math.floor(index / 4);
                if (!result[groupIndex]) {
                  result[groupIndex] = [];
                }
                result[groupIndex].push(producto);
                return result;
              }, [] as Producto[][]).map((grupo, index) => (
                <Carousel.Item key={index}>
                  <div className="productos-row">
                    {grupo.map((producto) => (
                      <div className="producto-card" key={producto.id}>
                        <img
                          src={producto.imagen}
                          alt={producto.producto}
                          className="producto-imagen"
                        />
                        <h4>{producto.producto}</h4>
                        <p>Precio: ${producto.precio}</p>
                       {/* Mostrar el botón "Agregar al carrito" solo si el usuario no es ADMIN */}
                        {usuario?.rol !== 'ADMIN' && (
                          <button onClick={() => agregarAlCarrito(producto)}>
                            Agregar al carrito
                          </button>
                        )}
                        <Link to={`/producto/${producto.id}`}>
                          <button>Ver detalles</button>
                        </Link>
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