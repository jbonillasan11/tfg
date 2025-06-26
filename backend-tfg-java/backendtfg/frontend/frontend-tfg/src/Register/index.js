import { useState } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import AlertModal from '../ModalWindows/AlertModal';
import passwordVerifier from '../utils/passwordVerifier';

const Register = () => {

    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[passwordRepeat, setPasswordRepeat] = useState("");
    const[org, setOrg] = useState("");
    const[name, setName] = useState("");
    const[surname, setSurname] = useState("");
    const [selectedOption, setSelectedOption] = useState("");

    const [pwdMismatch, setPwdMismatch] = useState(false);
    const [unfilledFields, setUnfilledFields] = useState(false);

    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [navigateTo, setNavigateTo] = useState(null);
    const [noValidPwd, setNoValidPwd] = useState(false);
    const [noValidEmail, setNoValidEmail] = useState(false);


    function registerInfoSend() {
        setPwdMismatch(false);
        setUnfilledFields(false);
        setNoValidPwd(false);

        if (!passwordVerifier(password)) { //Si no es pwd válida, no enviamos nada
            setNoValidPwd(true); 
            return;
        }

        if (!isValidEmail(email)) { //Si no es email válido, no enviamos nada
            setNoValidEmail(true);
            return;
        }

        const reqBody = {
            "email": email,
            "password": password,
            "name": name,
            "surname": surname,
            "fullname": name + " " + surname,
            "organization": org,
            "userType": selectedOption
        }

        if (!password.match(passwordRepeat)) { //Si las pwd no coinciden, no enviamos nada
            setPwdMismatch(true);
            return;
        }

        if (!(email || password || name || surname || org)) { //Si falta algún dato, no enviamos nada
            setUnfilledFields(true);
            return;
        }

        fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(reqBody)
        })
        .then(response => {
            if (response.status === 409) {
              setShowAlertError(true);
              setAlertMessage("Email ya registrado");
            } else if (response.status === 200) {
              setShowAlert(true);
              setAlertMessage("Usuario registrado con éxito");
              setNavigateTo("/login");
            } else {
              setShowAlertError(true);
              setAlertMessage("Error en el registro");
            }
          })
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const radioButtonHandler = (event) => {
        setSelectedOption(event.target.value);
    };

    return (

        <div align="center" style={{marginTop: "7rem", marginBottom: "10rem"}}>
            <img src="https://res.cloudinary.com/dmtwfww3b/image/upload/v1750965761/ludikids_solo_texto_spyiy9.png" className="logo-white" alt="Logo" style = {{marginBottom: "2rem"}}/>
            <h1>Bienvenido!</h1>
            <div style={{
                background: "linear-gradient(to bottom, #1a237e 78%, #f9f9f9 85%)",
                color: "white",
                padding: "2rem",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                margin: "auto",
                width: "50rem",
                marginTop: "3rem",
            }}>
                <AlertModal
                    showModal={showAlert}
                    onHide={() => setShowAlert(false)}
                    message={alertMessage}
                    navigateTo ={navigateTo}
                />
                <AlertModal
                    showModal={showAlertError}
                    onHide={() => setShowAlertError(false)}
                    message={alertMessage}
                    error={true}
                />
                <h3>Crea una cuenta</h3>
                <h4>Introduce tus datos</h4>

                <div style = {{padding: "0.5%", marginTop: "1.5rem"}}>
                    <Form.Label htmlFor="name">Nombre</Form.Label>
                    <Form.Control style={{ width: "40rem" }} type="text" id="registerName" value = {name} onChange={(event) => setName(event.target.value)}/>
                </div>
                <div style = {{padding: "0.5%", marginTop: "1.5rem"}}>
                    <Form.Label htmlFor="surname">Apellidos</Form.Label>
                    <Form.Control style={{ width: "40rem" }} type="text" id="registerSurname" value = {surname} onChange={(event) => setSurname(event.target.value)}/>
                </div>
                <div style = {{padding: "0.5%", marginTop: "1.5rem"}}>
                    <Form.Label htmlFor="organization">Organización</Form.Label>
                    <Form.Control style={{ width: "40rem" }} type="text" id="registerOrg" value = {org} onChange={(event) => setOrg(event.target.value)}/>
                </div>
                <div style = {{padding: "0.5%", marginTop: "1.5rem"}}>
                    <Form.Label htmlFor="email">Correo electrónico</Form.Label>
                    <Form.Control style={{ width: "40rem" }} type="email" id="registerEmail" value = {email} onChange={(event) => setEmail(event.target.value)}/>
                </div>
                <div style = {{padding: "0.5%", marginTop: "1.5rem"}}>
                    <Form.Label htmlFor="password">Contraseña</Form.Label>
                    <Form.Control style={{ width: "40rem" }} type="password" id="registerPassword" value = {password} onChange={(event) => setPassword(event.target.value)}/>
                    <p style={{fontStyle:"italic", color:"#6c757d", marginTop:"0.5rem", fontSize:"0.9rem"}}>Debe contener al menos 8 caracteres, mayúscula, minúscula, un dígito y un carácter especial</p>  
                </div>
                <div style = {{padding: "0.5%", marginTop: "1rem"}}>
                    <Form.Label htmlFor="passwordRepeat">Repite tu contraseña</Form.Label>
                    <Form.Control style={{ width: "40rem" }} type="password" id="registerPwdRepeat" value = {passwordRepeat} onChange={(event) => setPasswordRepeat(event.target.value)}/>
                </div>
            
                <div style = {{padding: "0.5%", marginTop: "1.5rem" }}>
                    <h4 className="mb-3">Selecciona tu rol</h4>
                    <Card style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", alignItems: "center" }}>
                        <Form>
                            <div className="d-flex justify-content-center gap-5">
                            <Form.Check
                                type="radio"
                                label={<span style={{ fontSize: "1.2rem", fontWeight: "600" }}>Estudiante</span>}
                                name="userType"
                                value="STUDENT"
                                checked={selectedOption === "STUDENT"}
                                onChange={radioButtonHandler}
                                id="studentRadio"
                            />
                            <Form.Check
                                type="radio"
                                label={<span style={{ fontSize: "1.2rem", fontWeight: "600" }}>Docente</span>}
                                name="userType"
                                value="PROFESSOR"
                                checked={selectedOption === "PROFESSOR"}
                                onChange={radioButtonHandler}
                                id="professorRadio"
                            />
                            </div>
                        </Form>
                    </Card>
                </div>
                {pwdMismatch && (
                    <p style={{color:"red", fontSize:"0.9rem", marginTop:"1rem", fontWeight:"bold"}}>Las contraseñas no coinciden!</p>
                )}
                {unfilledFields && (
                    <p style={{color:"red", fontSize:"0.9rem", marginTop:"1rem", fontWeight:"bold"}}>Debes rellenar todos los campos!</p>
                )}
                {noValidPwd && (
                    <p style={{color:"red", fontSize:"0.9rem", marginTop:"1rem", fontWeight:"bold"}}>La contraseña no es válida!</p>
                )}
                {noValidEmail && (
                    <p style={{color:"red", fontSize:"0.9rem", marginTop:"1rem", fontWeight:"bold"}}>El email no es válido!</p>
                )}
                <div style = {{padding: "0.5%", marginTop: "2rem", marginBottom: "2rem"}}>
                    <button className="main-button" id="registerButton" onClick={() => registerInfoSend()}>Regístrate</button>
                </div>
                <p>
                    <Link to={"/login"}>Ya tienes una cuenta? Inicia sesión</Link>
                </p>
            </div>

        </div>
    );
};

export default Register;