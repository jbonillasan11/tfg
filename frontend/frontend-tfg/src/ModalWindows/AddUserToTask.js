import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form, ListGroup } from 'react-bootstrap';
import fetchService from '../services/fetchService';
import { useLocalState } from '../utils/useLocalState';

function AddUserToTask({parentTask, onSaveUsers}) {

  const [authValue] = useLocalState("", "authValue");

  const task = parentTask;
  const [taskUsers, setTaskUsers] = useState([]);
  const [taskUsersAux, setTaskUsersAux] = useState([]); //Auxiliar para guardar los usuarios de la tarea y no perderlos al buscar

  const [modalShow, setModalShow] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchTextGroup, setSearchTextGroup] = useState("");

  const [users, setUsers] = useState([]);

  const [groups, setGroups] = useState([]);//Ids de los grupos que se encuentran en la tarea, para no volver a añadirlos

  

  function handleClose (){
    setModalShow(false);
    setTaskUsers(taskUsersAux);
    resetFields();
  }

  function handleCloseSave(){
    setModalShow(false);
    resetFields();
  }

  function buscarUsuario(){ //Aqui fetch al backend con el texto, devuelve los ids. Tendrá que filtrar los que se encuentren en taskUsers
    if (searchText === "" && searchTextGroup === "") return;

    if (searchText !== ""){
      fetchService(`users/getUsersNameSearch?nameFragment=${encodeURIComponent(searchText)}`, "GET", authValue, null) // Buscamos los usuarios que contengan en su nombre el fragmento introducido
      .then(response => {
        setUsers(response);
      });
    }

    if (searchTextGroup !== ""){
      fetchService(`groups/getGroupsNameSearch?nameFragment=${encodeURIComponent(searchTextGroup)}`, "GET", authValue, null) // Buscamos los grupos que contengan en su nombre el fragmento introducido
      .then(response => {
        setGroups(response);
      });
    }

  }

  function resetFields(){
    setSearchText("");
    setSearchTextGroup("");
    setUsers([]);
    setGroups([]);
  }

  useEffect(() => {
    fetchService(`users/getUsers`, "POST", authValue, task.assigneesUserIds) //Obtenemos todos los usuarios de la base de datos
    .then(response => {
      setTaskUsers(response);
      setTaskUsersAux(response);
    });
  }, [authValue, task]);

  function addUser(user){
    if (!taskUsers.some(u => u.id === user.id)) {
      setTaskUsers([...taskUsers, user]); // Añadimos el usuario a la lista de usuarios de la tarea
      setUsers(users.filter((u) => u.id !== user.id)); // Eliminamos el usuario de la lista de usuarios buscados
    }
  }

  function removeUser(user){   
    setTaskUsers(taskUsers.filter((u) => u.id !== user.id)); // Eliminamos el usuario de la lista de usuarios de la tarea 
    if (!users.some(u => u.id === user.id)) {
      setUsers([user, ...users]); // Añadimos el usuario a la lista de usuarios buscados para corregir rápidamente
    }
  }

  function addGroup(group){
    const groupUsers = group.usersIds; // Filtramos los usuarios que pertenecen a la tarea
    const newUsersToAdd = groupUsers.filter(
      id => !taskUsers.some(user => user.id === id)
    );
    fetchService(`users/getUsers`, "POST", authValue, newUsersToAdd)
    .then(response => {
      setTaskUsers(prev => [...prev, ...response]); // Añadimos los usuarios a la lista de usuarios de la tarea
    });
  }

  function saveChanges(){
    const ids = taskUsers.map(user => user.id);
    if (onSaveUsers) {
      onSaveUsers(ids);
    }
    handleCloseSave();
  }
    
  return (
    <>
      <button className="main-button" onClick={() => setModalShow(true)}>Gestionar usuarios</button>
      <Modal
        size="lg"
        show={modalShow}
        onHide={() => {handleClose()} }
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

                <Form.Group className="mb-3" style={{marginTop: "1rem"}}>
                    <h5>Nombre del grupo</h5>
                    <Form.Control
                    type="text"
                    value={searchTextGroup}
                    onChange={(e) => setSearchTextGroup(e.target.value)}
                    />
                </Form.Group>

                <h6>Grupos encontrados</h6>
                <ListGroup>
                    {groups.map((group) => ( //En cada elemento, pulsarlo lo añade a la tarea
                    <ListGroup.Item key={group.id}
                        action
                        onClick={() => addGroup(group)}>
                        {group.name}
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
                <h5>Miembros actuales</h5>
                <ListGroup>
                    {taskUsers.map((user) => ( //En cada elemento, pulsarlo lo elimina de la tarea
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

export default AddUserToTask;