
interface Producto {
    id: number;
    producto: string;
    marca: string;
    modelo: string;
    imagen: string;
    precio: string;
    costoEnvio: string;
    cantidadVendida: number;
    descripcion?: string; // Podemos hacer la descripción opcional si no está presente en todos los productos
    idCategoria: number;
    isDeleted: boolean;
  }
  
  export default Producto;