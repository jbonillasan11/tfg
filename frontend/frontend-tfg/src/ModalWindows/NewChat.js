import { useLocalState } from '../utils/useLocalState';
import { useState, useEffect } from 'react';
import fetchService from '../services/fetchService';
import { Modal, Form, ListGroup } from 'react-bootstrap';

function NewChat ({currentUser, onCreateChat}) {

    const [authValue] = useLocalState("", "authValue");

    const [modalShow, setModalShow] = useState(false);

    const [searchText, setSearchText] = useState("");
    const [users, setUsers] = useState([]); //Usuarios resultado de la búsqueda

    const [chatUsers, setChatUsers] = useState([]); //Lista usuarios del chat

    
    useEffect(() => {
        setChatUsers([currentUser]);
    }, [currentUser])

    function buscarUsuario(){
        if (searchText === "") return;

        if (searchText !== ""){
        fetchService(`users/getUsersNameSearch?nameFragment=${encodeURIComponent(searchText)}`, "GET", authValue, null)
        .then(response => {
            setUsers(response);
        });
        }
    }

    function addUser(user){
        if (!chatUsers.some(u => u.id === user.id)) {
            setChatUsers([...chatUsers, user]); // Añadimos el usuario a la lista de usuarios de la tarea
            setUsers(users.filter((u) => u.id !== user.id)); // Eliminamos el usuario de la lista de usuarios buscados
        }
    }
    
    function removeUser(user){   
        setChatUsers(chatUsers.filter((u) => u.id !== user.id)); // Eliminamos el usuario de la lista de usuarios de la tarea 
        if (!users.some(u => u.id === user.id)) {
            setUsers([user, ...users]); // Añadimos el usuario a la lista de usuarios buscados para corregir rápidamente
        }
    }

    async function saveChanges(){
        if (chatUsers.length <= 1) return;
        const reqBody = chatUsers.map(user => user.id);
        await fetchService(`chats/newChat`, "POST", authValue, reqBody)
        .then(response => {
            setModalShow(false);
            setChatUsers([]);
            if (onCreateChat) onCreateChat(response); // Callback para actualizar la lista de chats en el componente padre
            console.log(response);
            handleClose();
        });
    }

    function handleClose(){
        setModalShow(false);     
        resetFields();
    }

    function resetFields(){
        setSearchText("");
        setUsers([]);
        setChatUsers([]);
        setChatUsers([currentUser]);
    }

    return (
        <>
            <button className="main-button" onClick={() => setModalShow(true)}>Nuevo chat</button>
            <Modal
                size="lg"
                show={modalShow}
                onHide={() => {setModalShow(false); resetFields()} }
                aria-labelledby="example-modal-sizes-title-lg"
                style={{alignContent: "center"}}
            >

                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Nuevo chat
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div style={{ display: "flex", alignItems: "stretch", height: "80%", padding: "1rem", }}>
                        <div style={{flex:1}}>
                            <Form.Group className="mb-3" style={{ paddingRight: "1rem" }}>
                                <h5>Nombre o apellidos</h5>
                                <Form.Control
                                    type="text"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </Form.Group>

                            <h6>Usuarios encontrados</h6>
                            <ListGroup>
                                {users.map((user) => ( //En cada elemento, checkbox que ejecute la función de añadir al usuario
                                <ListGroup.Item key={user.id}
                                    action
                                    onClick={() => addUser(user)}>
                                    {user.name} {user.surname}
                                </ListGroup.Item>
                                ))}
                            </ListGroup>

                            <div style={{marginTop: "2.5rem"}}>
                                <button className="main-button" onClick={buscarUsuario}>Buscar</button>
                                <button className="secondary-button" onClick={resetFields}>Limpiar</button>
                            </div>
                        </div>

                        <div style={{ width: "1px", backgroundColor: "#aaa", margin: "0 1rem", }}></div>
                        <div style={{ flex: 1 }}>
                            <h6>Miembros actuales</h6>
                            <ListGroup>
                                {chatUsers.map((user) => (
                                <ListGroup.Item key={user.id}
                                    action
                                    onClick={() => removeUser(user)}>
                                    {user.name} {user.surname}
                                </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                    </div>
                    </Modal.Body>
        
                    <Modal.Footer>
                        <button className="secondary-button" onClick={handleClose}>
                            Cerrar
                        </button>
                        <button className="main-button" onClick={saveChanges}>
                            Crear
                        </button>
                    </Modal.Footer>
            </Modal>
        </>
    );
};

export default NewChat;