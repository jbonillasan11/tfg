import { useEffect } from 'react';
import fetchService from '../services/fetchService';
import { useLocalState } from '../utils/useLocalState';
import { useState } from 'react';
import AddUserToGroup from '../ModalWindows/AddUserToGroup';
import { ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TopBar from '../Components/TopBar';
import Forum from '../Forum/Forum';

const GroupViewer = () => {

    const navigate = useNavigate();

    const [authValue] = useLocalState("", "authValue");
    const [currentUser] = useLocalState("", "currentUser"); //Usuario logueado
    
    const groupId = window.location.href.split("/groups/")[1]; //Obtenemos el id de la tarea de la URL
    const [group, setGroup] = useState(""); //Grupo al que accedemos
    const [creator, setCreator] = useState(""); //Creador del grupo

    const [groupUsers, setGroupUsers] = useState([]); //Usuarios del grupo (tipo UserDTO)
    const [groupTasks, setGroupTasks] = useState([]); 

    const [updatedUserIds, setUpdatedUserIds] = useState([]);

    useEffect(() => {
      fetchService(`groups/${groupId}`, "GET", authValue, null)
          .then(groupData => {
            setGroup(groupData);
          })
          .catch(error => {
            console.error(error.message);
            setGroup("");
          });
    }, [])
    
    useEffect(() => {
      if (group !== ""){
        fetchService(`users/getUserId/${group.creatorId}`, "GET", authValue)
        .then(creatorData => {
          setCreator(creatorData);
        });
      }
    }, [authValue, group])

    useEffect (() => {
      if (group.usersIds && group.usersIds.length >= 1){
        fetchService("users/getUsers", "POST", authValue, group.usersIds)
        .then(usersData => {
          setGroupUsers(usersData);
        })
      } else {
        setGroupUsers([creator]);
      }
      if (group.tasksIds && group.tasksIds.length > 0){
        fetchService("tasks/getTasksFromIds", "POST", authValue, {tasksIDs: group.tasksIds})
        .then(tasksData => {
          setGroupTasks(tasksData);
        })
      }
    }, [group])

    function saveGroupDB(){
      addUsersGroup(); //Actualizamos los usuarios por fuera del PUT, ya que es un método algo más complejo
      fetchService(`groups/${groupId}`, "PUT", authValue, group)
      .then(groupData => {
        setGroup(groupData);
        alert("Grupo guardado con éxito");
      })
      window.location.reload();
    }

    function saveFieldUpdate(field, value) { //Función que guarda los datos del grupo y nos permite modificarlo las veces que queramos
      const groupCopy = {...group};
      groupCopy[field] = value;
      setGroup(groupCopy);
    }

    function confirmGroupDeletion(){
      if (window.confirm("¿Estás seguro de que quieres eliminar el grupo? Esta acción no se puede deshacer.")) { //Sustituir por ventana emergente
        deleteGroupDB();
      }
    }

    function deleteGroupDB(){
      fetchService(`groups/deleteGroupId/${groupId}`, "DELETE", authValue, null)
      .then(() => {
        alert("Grupo eliminado con éxito");
        navigate("/dashboard") ; //Redirigimos al dashboard
      })
    }

    function addUsersGroup(){
      if (updatedUserIds.length === 0) fetchService(`groups/setUsers/${groupId}`, "PUT", authValue, [currentUser.id]) //Si no hay usuarios, eliminamos a todos menos al actual
      else fetchService(`groups/setUsers/${groupId}`, "PUT", authValue, updatedUserIds) //Si hay 
      window.location.reload();
    }

    function groupForum(){

    }

    console.log(updatedUserIds) 

    return (
      <>
        <TopBar currentUser={currentUser} />
        <div>
          {group ? (
            <>
                <h1> Grupo <input type="text" value = {group.name} onChange={(e) => saveFieldUpdate("name", e.target.value)} /></h1>
                <h3> Creado por: {creator.name} {creator.surname} </h3>
                <h3> Tareas </h3>
                <ListGroup>
                  {groupTasks && groupTasks.map(task => (
                    <ListGroup.Item key= {task.id}
                        action
                        onClick={() => navigate(`/tasks/${task.id}`)}>
                        {task.name}
                    </ListGroup.Item>
                    ))}
                </ListGroup>
                <h3>Miembros</h3>
                <ListGroup>
                  {groupUsers && groupUsers.map(member => (
                    <ListGroup.Item key= {member.id}
                        action
                        onClick={() => navigate(`/user/${member.id}`)}>
                        {member.name} {member.surname}
                    </ListGroup.Item>
                    ))}
                </ListGroup>
                  {currentUser.id === group.creatorId ? (
                  <>
                    <AddUserToGroup
                      parentGroup={group}
                      onSaveUsers={(updatedUsers) => setUpdatedUserIds(updatedUsers)}
                    />
                    <button id="saveGroupButton" onClick={() => saveGroupDB()}>Guardar cambios</button>
                    <button id="deleteGroupButton" onClick={() => confirmGroupDeletion()}>Eliminar grupo</button>
                    <button id="groupForum" onClick={() => groupForum()}>Foro del grupo</button>
                  </>
                  ) : (
                    <></>
                  )}
                  <Forum
                    forumId={group.forumId}
                    senderId={currentUser.id}
                    authValue={authValue}
                    currentUser={currentUser}
                    groupName={group.name}
                  />
            </>
          ) : (
              <> 
                  <h2>Grupo no encontrado</h2>
              </>
          )
          }
        </div>
      </>
    );
};

export default GroupViewer;