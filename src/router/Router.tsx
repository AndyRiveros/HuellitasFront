import '../App.css'
import { Routes, Route } from 'react-router-dom';
import ProductoList from '../components/ProductoList';

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductoList />} />
    </Routes>
  );
}

export default Router;