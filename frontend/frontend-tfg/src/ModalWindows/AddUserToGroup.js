import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form, ListGroup } from 'react-bootstrap';
import fetchService from '../services/fetchService';
import { useLocalState } from '../utils/useLocalState';

function AddUserToGroup({parentGroup, onSaveUsers}) {

  const [authValue] = useLocalState("", "authValue");

  const group = parentGroup;
  const [groupUsers, setGroupUsers] = useState([]);
  const [groupUsersAux, setGroupUsersAux] = useState([]); //Auxiliar para guardar los usuarios de la tarea y no perderlos al buscar

  const [users, setUsers] = useState([]);

  const [modalShow, setModalShow] = useState(false);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
      if ((group !== "")){
          fetchService(`users/getUsers`, "POST", authValue, group.usersIds) //Obtenemos todos los usuarios de la base de datos
          .then(response => {
            setGroupUsers(response);
            setGroupUsersAux(response);
          });
      }
    }, [authValue, group]);

  function buscarUsuario(){
      if (searchText === "") return;
  
      if (searchText !== ""){
        fetchService(`users/getUsersNameSearch?nameFragment=${encodeURIComponent(searchText)}`, "GET", authValue, null) // Buscamos los usuarios que contengan en su nombre el fragmento introducido
        .then(response => {
          setUsers(response);
        });
      }
  }

  function addUser(user){
      if (!groupUsers.some(u => u.id === user.id)) {
        setGroupUsers([...groupUsers, user]); // Añadimos el usuario a la lista de usuarios de la tarea
        setUsers(users.filter((u) => u.id !== user.id)); // Eliminamos el usuario de la lista de usuarios buscados
      }
    }
  
  function removeUser(user){   
  setGroupUsers(groupUsers.filter((u) => u.id !== user.id)); // Eliminamos el usuario de la lista de usuarios de la tarea 
  if (!users.some(u => u.id === user.id)) {
      setUsers([user, ...users]); // Añadimos el usuario a la lista de usuarios buscados para corregir rápidamente
  }
  }
  
  function handleClose (){
      setModalShow(false);
      setGroupUsers(groupUsersAux);
      resetFields();
  }

  function resetFields(){
      setSearchText("");
      setUsers([]);
  }

  function saveChanges(){
      const ids = groupUsers.map(user => user.id);
      if (onSaveUsers) {
        onSaveUsers(ids);
      }
      handleCloseSave();
  }

  function handleCloseSave(){
      setModalShow(false);
      resetFields();
  }

return (
  <>
    <button className="main-button" onClick={() => setModalShow(true)}>Gestionar miembros</button>
    <Modal
      size="lg"
      show={modalShow}
      onHide={() => {handleClose()}}
      aria-labelledby="example-modal-sizes-title-lg"
      style={{alignContent: "center"}}
    >

      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Gestionar usuarios
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
                  {users.map((user) => ( //En cada elemento, pulsarlo lo añade a la tarea
                  <ListGroup.Item key={user.id}
                      action
                      onClick={() => addUser(user)}>
                      {user.name} {user.surname}
                  </ListGroup.Item>
                  ))}
              </ListGroup>

              <div style={{marginTop: "2.5rem"}}>
                <button className="main-button" onClick={buscarUsuario} >Buscar</button>
                <button className="secondary-button" onClick={resetFields} >Limpiar</button>
              </div>
            </div>

          <div style={{ width: "1px", backgroundColor: "#aaa", margin: "0 1rem", }}></div>
            <div style={{ flex: 1 }}>
              <h5>Miembros actuales</h5>
              <ListGroup>
                  {groupUsers.map((user) => ( //En cada elemento, checkbox que ejecute la función de eliminar el usuario
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
            <button className="main-button" onClick={saveChanges}>
              Guardar cambios
            </button>
          </Modal.Footer>
    </Modal>
  </>
);
}

export default AddUserToGroup;