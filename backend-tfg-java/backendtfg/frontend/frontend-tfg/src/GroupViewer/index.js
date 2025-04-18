import React, { useEffect } from 'react';
import fetchService from '../services/fetchService';
import { useLocalState } from '../utils/useLocalState';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AddUserToGroup from '../ModalWindows/AddUserToGroup';

const GroupViewer = () => {

    const [authValue, setAuthValue] = useLocalState("", "authValue");
    const [currentUser, setCurrentUser] = useLocalState("", "currentUser"); //Usuario logueado
    
    const groupId = window.location.href.split("/groups/")[1]; //Obtenemos el id de la tarea de la URL
    const [group, setGroup] = useState(""); //Grupo al que accedemos
    const [creator, setCreator] = useState(""); //Creador del grupo

    const [groupUsers, setGroupUsers] = useState([]); //Usuarios del grupo (tipo UserDTO)
    const [groupTasks, setGroupTasks] = useState([]); 

    const [updatedUserIds, setUpdatedUserIds] = useState([]);

    useEffect(() => {
        fetchService(`groups/${groupId}`, "GET", authValue, null) //Petición asíncrona a nuestra APIRest
            .then(groupData => {
              setGroup(groupData);
            })
            .catch(error => {
                console.error(error.message);
                setGroup(null);
            });
        console.log(group);
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
        .then( usersData => {
          setGroupUsers(usersData);
        })
      } else {
        setGroupUsers([creator]);
      }
      if (group.tasksIds && group.tasksIds.length > 0){
        fetchService("tasks/getTasksFromIds", "POST", authValue, {tasksIDs: group.tasksIds})
        .then( tasksData => {
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
    }

    function saveFieldUpdate(field, value) { //Función que guarda los datos de la tarea y nos permite modificarlo las veces que queramos
      const groupCopy = {...group};
      groupCopy[field] = value;
      setGroup(groupCopy);
    }

    function deleteGroupDB(){
      fetchService(`groups/deleteGroupId/${groupId}`, "DELETE", authValue, null)
      .then(groupData => {
        alert("Grupo eliminado con éxito");
        window.location.href = "/dashboard"; //Redirigimos al dashboard
      })
    }

    function addUsersGroup(){
      if (updatedUserIds.length === 0) fetchService(`group/deleteUsers/${groupId}`, "PUT", authValue, null) //Si no hay usuarios
      else fetchService(`groups/setUsers/${groupId}`, "PUT", authValue, updatedUserIds) //Si hay 
    }

    return (
        <div>
          {group ? (
          <>
              <h1> Grupo <input type="text" value = {group.name} onChange={(e) => saveFieldUpdate("name", e.target.value)} /></h1>
              <h3>Creado por: {creator.name} {creator.surname}</h3>
              <h3>Tareas</h3>
              <ul>
                {groupTasks && groupTasks.map(task => (
                  <li key={task.id}> 
                  <Link to={`/tasks/${task.id}`}>{task.name}</Link>
                  </li>
                ))}
              </ul>
              <h3>Miembros</h3>
              <ul>
                {groupUsers && groupUsers.map(member => (
                  <li key={member.id}>
                    <Link to={`/user/${member.id}`}>{member.name} {member.surname}</Link>
                  </li>
                ))}
              </ul>
                {currentUser.id === group.creatorId ? (
                <>
                  <AddUserToGroup
                    parentGroup={group}
                    onSaveUsers={(updatedUsers) => setUpdatedUserIds(updatedUsers)}
                  />
                  <button id="saveGroupButton" onClick={() => saveGroupDB()}>Guardar cambios</button>
                  <button id="deleteGroupButton" onClick={() => deleteGroupDB()}>Eliminar grupo</button>
                </>
                ) : (
                  <></>
                )}
          </>
          ) : (
              <> 
                  <h2>Grupo no encontrado</h2>
              </>
          )
          }
        </div>
    );
};

export default GroupViewer;