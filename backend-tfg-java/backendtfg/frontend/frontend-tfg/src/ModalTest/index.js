import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import fetchService from '../services/fetchService';
import { useLocalState } from '../utils/useLocalState';

function ModalTest({parentTask, onSaveUsers}) {

  const [authValue, setAuthValue] = useLocalState("", "authValue");

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
  }, []);

  function addUser(user){
    if (!taskUsers.some(u => u.id === user.id)) {
      setTaskUsers([...taskUsers, user]); // Añadimos el usuario a la lista de usuarios de la tarea
      setUsers(users.filter((u) => u.id !== user.id)); // Eliminamos el usuario de la lista de usuarios buscados
    }
  }

  function removeUser(user){   
    setTaskUsers(taskUsers.filter((u) => u.id !== user.id)); // Eliminamos el usuario de la lista de usuarios de la tarea 
    if (!users.some(u => u.id === user.id)) { // No puedo eliminar usuario si está en users????????????????????????
      setUsers([user, ...users]); // Añadimos el usuario a la lista de usuarios buscados para corregir rápidamente
    }
  }

  function addGroup(group){
    const groupUsers = group.usersIds; // Filtramos los usuarios que pertenecen a la tarea
    const newUsersToAdd = groupUsers.filter( // Permite repetidos??????????????????????
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
      <Button onClick={() => setModalShow(true)}>Gestionar usuarios</Button>
      <Modal
        size="lg"
        show={modalShow}
        onHide={() => {setModalShow(false); resetFields()} }
        aria-labelledby="example-modal-sizes-title-lg"
      >

        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Gestionar usuarios
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
           
            <div className="row mt-4">
                <div className="col">
                <Form.Group className="mb-3">
                    <Form.Label>Nombre o apellidos</Form.Label>
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

                <Form.Group className="mb-3">
                    <Form.Label>Nombre del grupo</Form.Label>
                    <Form.Control
                    type="text"
                    value={searchTextGroup}
                    onChange={(e) => setSearchTextGroup(e.target.value)}
                    />
                </Form.Group>

                <h6>Grupos encontrados</h6>
                <ListGroup>
                    {groups.map((group) => ( //En cada elemento, checkbox que ejecute la función de añadir al usuario
                    <ListGroup.Item key={group.id}
                        action
                        onClick={() => addGroup(group)}>
                        {group.name}
                    </ListGroup.Item>
                    ))}
                </ListGroup>

                <Button onClick={buscarUsuario} className="me-2">Buscar</Button>
                <Button onClick={resetFields} variant="secondary">Limpiar</Button>
                </div>

                <div className="col">
                <h6>Miembros actuales</h6>
                <ListGroup>
                    {taskUsers.map((user) => ( //En cada elemento, checkbox que ejecute la función de eliminar el usuario
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
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={saveChanges}>
                    Guardar cambios
                </Button>
            </Modal.Footer>

      </Modal>
    </>
  );
}

export default ModalTest;