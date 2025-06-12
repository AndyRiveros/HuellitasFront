import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductoList from './components/ProductoList';
import ProductoDetail from './components/ProductoDetail';
import Home from './components/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Mapa from './components/Mapa';
import CrearProductoForm from './components/CrearProductoForm';
import ModificarProducto from './components/ModificarProducto';
import CheckoutMP from './components/CheckoutMP';
import Login from './components/Login';
import { AuthProvider } from './utils/AuthContext';
import { RutaPrivada } from './utils/RutaPrivada';
import AdminUsuariosPanel from './components/AdminUsuariosPanel';
import Signup from './components/SignUp';
import InventarioList from './components/InventarioList';
import Perfil from './components/Perfil';
import Footer from './components/Footer';
import { CarritoProvider } from './components/CarritoContext';
import ResultadosBusqueda from './components/ResultadosBusqueda';
import PreguntasFrec from './components/PreguntasFrec';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword'; // ✅ nuevo import
import AdminLogin from './components/AdminLogin';

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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} /> {/* ✅ nueva ruta */}
              <Route path="/mapa" element={<Mapa />} />
              <Route path="/productos" element={<ProductoList />} />
              <Route path="/preguntasfrec" element={<PreguntasFrec />} />
              <Route path="/producto/:id" element={<ProductoDetail />} />
              <Route path="/perfil" element={<RutaPrivada><Perfil /></RutaPrivada>} />
              <Route path="/inventario" element={<RutaPrivada><InventarioList /></RutaPrivada>} />
              <Route path="/crear-producto" element={<RutaPrivada><CrearProductoForm /></RutaPrivada>} />
              <Route path="/productos/:id/modificar" element={<RutaPrivada><ModificarProducto /></RutaPrivada>} />
              <Route path="/mercadopago" element={<RutaPrivada><CheckoutMP /></RutaPrivada>} />
<Route path="/admin-usuarios" element={<AdminUsuariosPanel />} />              <Route path="/resultados" element={<ResultadosBusqueda />} />
              <Route path="*" element={<Home />} />
              <Route path="/admin-login" element={<AdminLogin />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </CarritoProvider>
    </AuthProvider>
  );
};

export default App;
