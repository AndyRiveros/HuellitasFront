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
    nombre: string;
    apellido: string;
    direccion: string;
    dni: number;
    mail: string;
    telefono: string;
    imagenPerfil?: string; 
}
