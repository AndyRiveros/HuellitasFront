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


const App: React.FC = () => {
  return (
    <AuthProvider>
    <Router>
      <div>
      <Routes>
            <Route path="/" element={<Signup />} /> {/* Agrega esta línea */}
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<RutaPrivada><Home /></RutaPrivada>} />
            <Route path='/mapa' element={<RutaPrivada><Mapa /></RutaPrivada>} />
            <Route path="/instrumentos" element={<RutaPrivada><InstrumentoList /></RutaPrivada>} />
            <Route path="/inventario" element={<RutaPrivada><InventarioList /></RutaPrivada>} />
            <Route path="/instrumento/:id" element={<RutaPrivada><InstrumentoDetail /></RutaPrivada>} />
            <Route path="/crear-instrumento" element={<RutaPrivada><CrearInstrumentoForm /></RutaPrivada>} />
            <Route path="/instrumentos/:id/modificar" element={<RutaPrivada><ModificarInstrumento /></RutaPrivada>} />
            <Route path="/mercadopago" element={<RutaPrivada><CheckoutMP /></RutaPrivada>} />
            <Route path='/google-charts' element={<RutaPrivada><ChartsGoogle /></RutaPrivada>} />
            <Route path="*" element={<Login />} />
          </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
};

export default App;