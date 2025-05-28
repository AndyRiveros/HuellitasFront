interface Producto {
    id: number;
    producto: string;
    marca: string;
    modelo: string;
    imagen: string;
    precio: string;
    costoEnvio: string;
    cantidadVendida: number;
    descripcion?: string;
    idCategoria: number;
    isDeleted: boolean;
    especie?: string; // Nuevo
    tipo?: string;    // Nuevo
    etapa?: string;   // Nuevo (opcional)
}

export default Producto;