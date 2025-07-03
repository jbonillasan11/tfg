import { useState } from 'react';
import { useLocalState } from '../utils/useLocalState';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import AlertModal from '../ModalWindows/AlertModal';

const Login = () => {

    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");

    //Queremos acceder a authValue, por lo que lo guardaremos en un estado local, haciendo uso de nuestra función creada
    //Podríamos usar un useState, pero queremos que el valor persista en memoria
    const [authValue, setAuthValue] = useLocalState("", "authValue");

    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    function loginInfoSend() { 
        const reqBody = {
            "email": email,
            "password": password
        }

        fetch("http://localhost:8080/auth/login", { //No usamos fetchService, queremos hacer un tratamiento más complejo de la respuesta
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
                setAlertMessage("Error al iniciar sesión. Por favor, comprueba tus credenciales.");
                setShowAlert(true);
            }})
        .then(([body, headers]) => {
            setAuthValue(headers.get("authorization"));
            window.location.href = "/dashboard";
        })
        .catch((error) => {
            setAlertMessage("Error al iniciar sesión. Por favor, comprueba tus credenciales.");
            setShowAlert(true);
        });
    }
    
    return (
        <div align="center" style={{marginTop: "10rem", marginBottom: "10rem"}}>
            <AlertModal
                showModal={showAlert}
                onHide={() => setShowAlert(false)}
                message={alertMessage}
                error ={true}
            />
            <img src="/ludikids solo texto.png" className="logo-white" alt="Logo" style = {{marginBottom: "2rem"}}/>
            <h1>Bienvenido!</h1>
            <div style={{
                background: "linear-gradient(to bottom, #1a237e 50%, #f9f9f9 70%)",
                color: "white",
                padding: "2rem",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                margin: "auto",
                width: "60rem",
                marginTop: "5rem",
            }}>

                <h3>Inicia sesión</h3>

                <div style={{ marginTop: "3rem", marginBottom: "1rem" }}>
                    <Form.Label htmlFor="email">Introduce tu correo electrónico</Form.Label>
                    <Form.Control style={{ width: "40rem" }} type="email" id="loginEmail" value = {email} onChange={(event) => setEmail(event.target.value)}/>
                </div>

                <div style={{ marginBottom: "3rem" }}>
                    <Form.Label htmlFor="password">Introduce tu contraseña</Form.Label>
                    <Form.Control style={{ width: "40rem" }} type="password" id="loginPassword" value = {password} onChange={(event) => setPassword(event.target.value)}/>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                    <button className="main-button" onClick={loginInfoSend}>Iniciar sesión</button>
                </div>

                <p>
                    <Link to={"/register"}>¿No tienes una cuenta? Regístrate</Link>
                </p>
                </div>

        </div>
    );
};

export default Login;