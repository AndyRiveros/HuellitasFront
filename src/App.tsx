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
import ResultadosBusqueda from './components/ResultadosBusqueda';
import PreguntasFrec from './components/PreguntasFrec';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CarritoProvider>
          <Router>
        <div>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/mapa" element={<Mapa />} />
                <Route path='/preguntasfrec' element={<PreguntasFrec/>} />
                <Route path="/productos" element={<ProductoList />} />
                <Route path="/producto/:id" element={<ProductoDetail />} />
                <Route path="/perfil" element={<RutaPrivada><Perfil /></RutaPrivada>} />
                <Route path="/inventario" element={<RutaPrivada><InventarioList /></RutaPrivada>} />
                <Route path="/crear-producto" element={<RutaPrivada><CrearProductoForm /></RutaPrivada>} />
                <Route path="/productos/:id/modificar" element={<RutaPrivada><ModificarProducto /></RutaPrivada>} />
                <Route path="/mercadopago" element={<RutaPrivada><CheckoutMP /></RutaPrivada>} />
                <Route path="/google-charts" element={<RutaPrivada><ChartsGoogle /></RutaPrivada>} />
                <Route path="*" element={<Home />} />
                <Route path="/resultados" element={<ResultadosBusqueda />} />
              </Routes>
            </div>
            <Footer />
          </Router>
      </CarritoProvider>
    </AuthProvider>
  );
};
<div className="full-width-section" style={{ backgroundColor: '#8e2673' }}>
  {/* contenido */}
</div>

export default App;
