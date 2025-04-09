import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
    return (
        <div>
            <h1>Home</h1>
            <p>
                <Link to={"/login"}>Inicio sesión</Link>
                <Link to={"/register"}>Registro</Link>
            </p>
        </div>
    );
};

export default Homepage;