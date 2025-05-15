import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InstrumentoList from './components/InstrumentoList';
import InstrumentoDetail from './components/InstrumentoDetail';
import Home from './components/Home'; // Importa el componente Home
import 'bootstrap/dist/css/bootstrap.min.css';
import Mapa from './components/Mapa';
import CrearInstrumentoForm from './components/CrearInstrumentoForm';
import ModificarInstrumento from './components/ModificarInstrumento';
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
            <Route path="/instrumentos" element={<InstrumentoList />} /> {/* Accesible sin autenticación */}
            <Route path="/instrumento/:id" element={<InstrumentoDetail />} /> {/* Accesible sin autenticación */}
            <Route path="/perfil" element={<RutaPrivada><Perfil /></RutaPrivada>} /> {/* Protegido */}
            <Route path="/inventario" element={<RutaPrivada><InventarioList /></RutaPrivada>} /> {/* Protegido */}
            <Route path="/crear-instrumento" element={<RutaPrivada><CrearInstrumentoForm /></RutaPrivada>} /> {/* Protegido */}
            <Route path="/instrumentos/:id/modificar" element={<RutaPrivada><ModificarInstrumento /></RutaPrivada>} /> {/* Protegido */}
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