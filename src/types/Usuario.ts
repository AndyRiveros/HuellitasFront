export enum Rol {
    ADMIN = 'ADMIN',
    OPERADOR = 'OPERADOR',
    VISOR = 'VISOR'
}

export default interface Usuario {
    id: number;
    nombreUsuario: string;
    clave: string;
    rol: Rol;
}