import '../App.css'
import { Routes, Route } from 'react-router-dom';
import InstrumentoList from '../components/InstrumentoList';

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<InstrumentoList />} />
    </Routes>
  );
}

export default Router;