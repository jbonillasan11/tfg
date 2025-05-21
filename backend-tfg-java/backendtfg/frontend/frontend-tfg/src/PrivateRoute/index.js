import React from 'react';
import { useLocalState } from '../utils/useLocalState';
import { Navigate } from 'react-router-dom';

const PrivateRoute= ({ children }) => { //Si estamos autenticados, nos permitirá acceder
                                         //Si no lo estamos, nos redirigirá a la página de login
    
    const [authValue] = useLocalState("", "authValue");                        
    return (
        authValue ? children : <Navigate to="/login" />
    );
};

export default PrivateRoute;