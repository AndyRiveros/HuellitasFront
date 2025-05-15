import Pedido from "./Pedido";


/* eslint-disable @typescript-eslint/no-explicit-any */
interface PedidoDetalle {
    id?: number;
    cantidad: number;
    pedido?: Pedido;
    producto?: any; // Reemplaza 'any' con la interfaz correcta para 'Producto'
}

export default PedidoDetalle;