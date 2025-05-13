import React, { createContext, useState, ReactNode } from 'react';
import { Rol } from '../types/Usuario';

interface AuthContextType {
  usuario: { nombre: string, rol: Rol } | null;
  iniciarSesion: (nombreUsuario: string, rol: Rol) => void;
  cerrarSesion: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [usuario, setUsuario] = useState<{ nombre: string, rol: Rol } | null>(null);

  const iniciarSesion = (nombreUsuario: string, rol: Rol) => {
    setUsuario({ nombre: nombreUsuario, rol });
  };

  const cerrarSesion = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};