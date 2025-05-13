import Pedido from "./Pedido";


/* eslint-disable @typescript-eslint/no-explicit-any */
interface PedidoDetalle {
    id?: number;
    cantidad: number;
    pedido?: Pedido;
    instrumento?: any; // Reemplaza 'any' con la interfaz correcta para 'Instrumento'
}

export default PedidoDetalle;