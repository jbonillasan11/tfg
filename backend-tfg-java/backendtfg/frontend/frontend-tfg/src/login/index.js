import React, {useEffect, useState} from 'react';
import { useLocalState } from '../utils/useLocalState';
import { Link } from 'react-router-dom';
import getCurrentUser from '../utils/getCurrentUser';

const Login = () => {

    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");

    //Queremos acceder a authValue, por lo que lo guardaremos en un estado local, haciendo uso de nuestra función creada
    //Podríamos usar un useState, pero queremos que el valor persista en memoria
    const [authValue, setAuthValue] = useLocalState("", "authValue");

    function loginInfoSend() { 

            const reqBody = {
                "email": email,
                "password": password
            }

            fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(reqBody)
            })
            .then(response =>{
                if (response.status === 200) {
                    return Promise.all([response.json(), response.headers])
                } else {
                    return Promise.reject("Credenciales incorrectas");
                }})
            .then(([body, headers]) => {
                setAuthValue(headers.get("authorization"));
                window.location.href = "/dashboard";
            })
            .catch((message) => {alert(message)});
    }
    
    return (
        <>
            <div>
                <label htmlFor="email">Correo electrónico</label>
                <input type="email" id="loginEmail" value = {email} onChange={(event) => setEmail(event.target.value)}/>
            </div>
            <div>
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="loginPassword" value = {password} onChange={(event) => setPassword(event.target.value)}/>
            </div>
            <div>
                <button id="loginButton" onClick={() => loginInfoSend()}>Iniciar sesión</button>
            </div>
            <p> 
                <Link to={"/register"}>No tienes una cuenta? Regístrate</Link>
            </p>
        </>
    );
};

export default Login;