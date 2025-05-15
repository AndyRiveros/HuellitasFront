import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductoList from './components/ProductoList';
import ProductoDetail from './components/ProductoDetail';
import Home from './components/Home'; // Importa el componente Home
import 'bootstrap/dist/css/bootstrap.min.css';
import Mapa from './components/Mapa';
import CrearProductoForm from './components/CrearProductoForm';
import ModificarProducto from './components/ModificarProducto';
import CheckoutMP from './components/CheckoutMP';
import Login from './components/Login';
import { AuthProvider } from './utils/AuthContext';
import { RutaPrivada } from './utils/RutaPrivada';
import ChartsGoogle from './components/ChartsGoogle';
import Signup from './components/SignUp';
import InventarioList from './components/InventarioList';
import Perfil from './components/Perfil';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer';
import { CarritoProvider } from './components/CarritoContext';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <CarritoProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} /> {/* Página principal accesible sin autenticación */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/productos" element={<ProductoList />} /> {/* Accesible sin autenticación */}
            <Route path="/producto/:id" element={<ProductoDetail />} /> {/* Accesible sin autenticación */}
            <Route path="/perfil" element={<RutaPrivada><Perfil /></RutaPrivada>} /> {/* Protegido */}
            <Route path="/inventario" element={<RutaPrivada><InventarioList /></RutaPrivada>} /> {/* Protegido */}
            <Route path="/crear-producto" element={<RutaPrivada><CrearProductoForm /></RutaPrivada>} /> {/* Protegido */}
            <Route path="/productos/:id/modificar" element={<RutaPrivada><ModificarProducto /></RutaPrivada>} /> {/* Protegido */}
            <Route path="/mercadopago" element={<RutaPrivada><CheckoutMP /></RutaPrivada>} /> {/* Protegido */}
            <Route path="/google-charts" element={<RutaPrivada><ChartsGoogle /></RutaPrivada>} /> {/* Protegido */}
            <Route path="*" element={<Home />} /> {/* Redirige a Home si la ruta no existe */}
          </Routes>
        </div>
        <Footer />
      </Router>
      </CarritoProvider>
    </AuthProvider>
  );
};

export default App;