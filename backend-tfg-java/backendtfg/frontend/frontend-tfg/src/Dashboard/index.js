import { useLocalState } from '../utils/useLocalState';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import fetchService from '../services/fetchService';
import ChatButton from '../Components/ChatButton';
import LogoutButton from '../Components/LogoutButton';
import ProfileButton from '../Components/ProfileButton';

const Dashboard = ({ stateExample }) => {

  const[authValue, setAuthValue] = useLocalState("", "authValue");
  const [currentUser, setCurrentUser] = useLocalState("", "currentUser");
  
  const [taskIds, setTaskIds] = useState([]);
  const [groupIds, setGroupIds] = useState([]);

  const [tasks, setTasks] = useState("");
  const [groups, setGroups] = useState("");

  
  
  useEffect(() => {
    fetchService("users/getCurrentUser", "GET", authValue, null) //Petición asíncrona a nuestra APIRest
      .then(user => {
        setCurrentUser(user);
      })
  }, [authValue])

  useEffect(() => {
    fetchService("users/getUserTasks", "GET", authValue, null) //Petición asíncrona a nuestra APIRest
    .then(tasksListIds => {
        setTaskIds(tasksListIds); //Tenemos la lista de Ids de tareas
    })  
  }, [authValue])

  useEffect(() => {
    if (taskIds.length === 0 || taskIds === null) return; //Si no hay tareas, no hacemos nada

    fetchService("tasks/getTasksFromIds", "POST", authValue, taskIds)
      .then(taskList => {
        setTasks(taskList);
      })
  }, [taskIds])

    useEffect(() => {
      fetchService("users/getUserGroups", "GET", authValue, null) //Petición asíncrona a nuestra APIRest
        .then(groupList => {
          setGroupIds(groupList); //Tenemos la lista de Ids de grupos
        })
    }, [authValue])

    useEffect (() => {
      if (groupIds.length === 0 || groupIds === null) return; //Si no hay grupos, no hacemos nada

      fetchService("groups/getGroupsFromIds", "POST", authValue, groupIds) //Petición asíncrona a nuestra APIRest
        .then(groupList => {
          setGroups(groupList);
        })
    }, [groupIds])

        function createAssignment() {
      fetchService("tasks/newEmptyTask", "POST", authValue, null) //Peticion asíncrona a nuestra APIRest
          .then(task => {
            window.location.href = `/tasks/${task.id}`;
          })
    }

    function createGroup() {
      fetchService("groups/newGroup", "POST", authValue, null) //Peticion asíncrona a nuestra APIRest
        .then(group => {
          window.location.href = `/groups/${group.id}`;
        })
    }

    if (!currentUser) return <div>Cargando dashboard...</div>;
    
    return (
        <>
            <div>
              <h1>Bienvenido, {currentUser.name}</h1>
            </div>
            <div align="right" style ={{margin: "20px"}}>
              <h3>Chatea con otros miembros de {currentUser.organization}</h3>
              <ChatButton />
            </div>
            <div>
              <h2>Tareas</h2>
              <ul>
                {tasks && tasks.map(task => ( //li modificable por div si prefiero que no aparezca con el formato lista
                  <li key={task.id}> 
                    <Link to={`/tasks/${task.id}`}>{task.name === "" ? "Tarea sin nombre" : task.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            {currentUser.userType === "PROFESSOR" ? (
              <div style ={{margin: "20px"}}>
                  <button onClick={() => createAssignment()}>Nueva tarea</button>
              </div>
            ) : (
              <></>
            )}
            <div>
              <h2>Grupos</h2>
              <ul>
                {groups && groups.map(group => ( //li modificable por div si prefiero que no aparezca con el formato lista
                  <li key={group.id}> 
                    <Link to={`/groups/${group.id}`}>{group.name === "" ? "Grupo sin nombre" : group.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
              {currentUser.userType === "PROFESSOR" ? ( 
                <div style ={{margin: "20px"}}>
                  <button onClick={() => createGroup()}>Nuevo grupo</button>
                </div>  
              ) : (
                <></>
              )}
              <ProfileButton id={currentUser.id} />
              <LogoutButton />
        </>
    );
}; 

export default Dashboard;