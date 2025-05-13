import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export const RutaPrivada = ({ children }: { children: React.ReactNode }) => {
    const authContext = useContext(AuthContext);
    const usuario = authContext ? authContext.usuario : undefined;

  return usuario ? children : <Navigate to='/' />;
};