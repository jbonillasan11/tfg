import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {

    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[passwordRepeat, setPasswordRepeat] = useState("");
    const[org, setOrg] = useState("");
    const[name, setName] = useState("");
    const[surname, setSurname] = useState("");
    const [selectedOption, setSelectedOption] = useState("");

    function registerInfoSend() {

        const reqBody = {
            "email": email,
            "password": password,
            "name": name,
            "surname": surname,
            "organization": org,
            "userType": selectedOption
        }
        if (!password.match(passwordRepeat)) {
            alert("Las contraseñas no coinciden");
            return;
        }

        if (!(email || password || name || surname || org)) {
            alert("Debes rellenar todos los campos");
            return;
        }

        console.log("Datos enviados:", reqBody);

        fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(reqBody)
        })
        .then(response => {
            if (response.status === 409) {
              alert("Email ya registrado");
            } else if (response.status === 200) {
              alert("Usuario registrado con éxito");
              window.location.href = "/login";
            } else {
              alert("Error en el registro");
            }
          })
    }

    const radioButtonHandler = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div style ={{margin: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <>
            <div style = {{padding: "0.5%"}}>
                <label htmlFor="name">Nombre</label>
                <br></br>
                <input type="text" id="registerName" value = {name} onChange={(event) => setName(event.target.value)}/>
            </div>
            <div style = {{padding: "0.5%"}}>
                <label htmlFor="surname">Apellidos</label>
                <br></br>
                <input type="text" id="registerSurname" value = {surname} onChange={(event) => setSurname(event.target.value)}/>
            </div>
            <div style = {{padding: "0.5%"}}>
                <label htmlFor="organization">Organización</label>
                <br></br>
                <input type="text" id="registerOrg" value = {org} onChange={(event) => setOrg(event.target.value)}/>
            </div>
            <div style = {{padding: "0.5%"}}>
                <label htmlFor="email">Correo electrónico</label>
                <br></br>
                <input type="email" id="registerEmail" value = {email} onChange={(event) => setEmail(event.target.value)}/>
            </div>
            <div style = {{padding: "0.5%"}}>
                <label htmlFor="password">Contraseña</label>
                <br></br>
                <input type="password" id="registerPassword" value = {password} onChange={(event) => setPassword(event.target.value)}/>
            </div>
            <div style = {{padding: "0.5%"}}>
                <label htmlFor="passwordRepeat">Repite tu contraseña</label>
                <br></br>
                <input type="password" id="registerPwdRepeat" value = {passwordRepeat} onChange={(event) => setPasswordRepeat(event.target.value)}/>
            </div>
            
            <div style = {{padding: "0.5%"}}>
            <h3>Selecciona una opción:</h3>
                <label>
                <input
                type="radio"
                value="STUDENT"
                checked={selectedOption === "STUDENT"}
                onChange={radioButtonHandler}
                />
                Estudiante
                </label>

                <label>
                <input
                type="radio"
                value="PROFESSOR"
                checked={selectedOption === "PROFESSOR"}
                onChange={radioButtonHandler}
                />
                Docente
                </label>
            </div>
            <br></br>
            <div style = {{padding: "0.5%"}}>
                <button id="registerButton" onClick={() => registerInfoSend()}>Regístrate</button>
            </div>
            <p>
                <Link to={"/login"}>Ya tienes una cuenta? Inicia sesión</Link>
            </p>
        </>
        </div>
    );
};

export default Register;