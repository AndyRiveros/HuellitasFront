import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Rol } from '../types/Usuario';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  direccion: string;
  dni: number;
  mail: string;
  rol: Rol;
}

interface AuthContextType {
  usuario: Usuario | null;
  iniciarSesion: (usuario: Usuario) => void;
  cerrarSesion: () => void;
  actualizarPerfil: (datosActualizados: Partial<Usuario>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    // Restaurar el usuario desde localStorage al cargar la página
    const usuarioGuardado = localStorage.getItem('usuario');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const iniciarSesion = (usuario: Usuario) => {
    setUsuario(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario)); // Guardar en localStorage
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('usuario'); // Eliminar del localStorage
  };

  const actualizarPerfil = (datosActualizados: Partial<Usuario>) => {
    if (usuario) {
      const usuarioActualizado = { ...usuario, ...datosActualizados };
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado)); // Actualizar en localStorage
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion, actualizarPerfil }}>
      {children}
    </AuthContext.Provider>
  );
};