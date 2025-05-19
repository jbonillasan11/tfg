import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocalState } from '../utils/useLocalState';
import fetchService from '../services/fetchService';
import AddUserToTask from '../ModalWindows/AddUserToTask';
import { Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TopBar from '../Components/TopBar';

const TaskViewer = () => {

    const navigate = useNavigate();

    const [authValue] = useLocalState("", "authValue");
    const [currentUser] = useLocalState("", "currentUser");

    const taskId = window.location.href.split("/tasks/")[1]; //Obtenemos el id de la tarea de la URL
    const [task, setTask] = useState("");
    const [creator, setCreator] = useState("");

    const [users, setUsers] = useState([]);
    const [response, setResponse] = useState({});
    const [correction, setCorrection] = useState({});

    const [updatedUserIds, setUpdatedUserIds] = useState([]);

    useEffect(() => {
        fetchService(`tasks/${taskId}`, "GET", authValue, null) //Petición asíncrona a nuestra APIRest
        .then(taskData => {
          setTask(taskData);
          setUpdatedUserIds(taskData.assigneesUserIds);
        });
    }, [])

    useEffect(() => {
      if (task !== ""){
        fetchService(`users/getUserId/${task.creatorId}`, "GET", authValue)
        .then(creatorData => {
          setCreator(creatorData);
        });
      }
    }, [authValue, task])

    useEffect(() => { //hook que obtiene la información de los usuarios en la tarea, solo para profesores
      if (task !== "" && currentUser.userType === "PROFESSOR"){
        fetchService("users/getUsers", "POST", authValue, task.assigneesUserIds)
        .then(usersData => {
          setUsers(usersData);
        })
      }
    }, [task])

    useEffect(() => {
      if (currentUser.userType === "PROFESSOR") return;
      fetchService(`users/getUserId/${currentUser.id}`, "GET", authValue)
      .then(userData => {
          setResponse(userData.responses[taskId]); //Respuestas del usuario
      });
    }, [])

    function saveFieldUpdate(field, value) { //Función que guarda los datos de la tarea y nos permite modificarlo las veces que queramos
      const taskCopy = {...task};
      taskCopy[field] = value;
      setTask(taskCopy);
    }

    function saveTaskDB(){
      saveChanges(); //Guardamos los cambios de los usuarios
      fetchService(`tasks/${taskId}`, "PUT", authValue, task)
      .then(taskData => {
        setTask(taskData);
        alert("Tarea guardada con éxito");
      })
    }

    function confirmTaskDeletion(){
      if (window.confirm("¿Estás seguro de que quieres eliminar la tarea? Esta acción no se puede deshacer.")) { //Sustituir por ventana emergente
        deleteTaskDB();
      }
    }

    function deleteTaskDB(){
      fetchService(`tasks/deleteTaskId/${taskId}`, "DELETE", authValue, null)
      .then(() => {
        alert("Tarea eliminada con éxito");
        navigate("/dashboard"); //Redirigimos al dashboard
      })
    }

    function saveChanges(){
      if (updatedUserIds.length === 0) fetchService(`tasks/deleteUsers/${taskId}`, "PUT", authValue, null) //Si no hay usuarios
      else fetchService(`tasks/setUsers/${taskId}`, "PUT", authValue, updatedUserIds) //Si hay 
    }

    function editTaskData(){
      navigate(`/tasks/${taskId}/edit`, {state: {task}});
    }

    function handleUserCorrection(user){
      navigate(`/tasks/${taskId}/corrector/${user.id}`, {state: {task, user}})
    }

    //Agrupar en un effect?
    let showButton = false;
    let showCorrectionButton

    if (response && (response.taskState === "PENDING" || response.taskState === "IN_PROGRESS")) {
      if (response.calification !== -1 && !task.redoable) {
        showButton = false;
      } else if (response.calification !== -1 && task.redoable) {
        showButton = true;
      } else showButton = true;
    } else if (response && response.taskState === "CORRECTED") {
        showCorrectionButton = true;
    }
    
    
    return (
      <>
        <div>
          <TopBar currentUser={currentUser} />
          {task ? ( 
            currentUser.userType === "PROFESSOR" ? ( //RENDERIZADO PARA DOCENTES
          <>
              <h1>Tarea: <input type="text" value = {task.name} onChange={(e) => saveFieldUpdate("name", e.target.value)} /></h1>
              <h3>Creada por: {creator.name} {creator.surname}</h3>
              <h2>Plazo hasta: <input type="date" value={task.due} onChange={(e) => saveFieldUpdate("due", e.target.value)} /></h2>
              <h3>Descripción: <input type="text" value = {task.description} onChange={(e) => saveFieldUpdate("description", e.target.value)} /></h3>
              <h3>Tarea repasable: <input type="checkbox" checked={task.redoable} onChange={(e) => {saveFieldUpdate("redoable", e.target.checked); console.log(task.redoable)} }/></h3>

              <Button id="editTask" onClick={() => editTaskData()}>Tarea</Button>
              <Button id="saveTaskButton" onClick={() => saveTaskDB()}>Guardar cambios</Button>
              <Button id="deleteTaskButton" onClick={() => confirmTaskDeletion()}>Eliminar tarea</Button>
              
              <AddUserToTask
                parentTask={task}
                onSaveUsers={(updatedUsers) => setUpdatedUserIds(updatedUsers)}
              />

              <p>{task.taskData} {// Escribir plantilla de la tarea
              } </p>

              <h3>Usuarios</h3>
              {users && users.map(user => {
                return (
                  <ListGroup.Item
                    key={user.id}
                    action
                    onClick={() => handleUserCorrection(user)}
                  >
                    <div><strong>{user.name} {user.surname}</strong></div>
                    <div>Estado: {user.responses[taskId].taskState}</div> {/* Estilo según su valor, color */}	
                    <div>Fecha de subida: {user.responses[taskId].uploadDate}</div> {/* Que se muestre solo cuando haya sido entregada */}	
                    <div>Calificación: {user.responses[taskId].calification !== -1 ? user.responses[taskId].calification : "No calificado"}</div>
                  </ListGroup.Item>
                );
              })}
          </>
          ) : ( //RENDERIZADO PARA ESTUDIANTES
            <>
              <h1>Tarea: {task.name}</h1>
              <h3>Creada por: {creator.name} {creator.surname}</h3>
              <h2>Plazo hasta: {task.due}</h2>
              <h3>Descripción: {task.description}</h3>
              {showButton && (
                <Button id="goToTask" onClick={() => navigate(`/tasks/${taskId}/responses/${currentUser.id}`, {state: {task, response}})}>
                  Resolver
                </Button>
              )}
              {response && (
                <div>Tu tarea: {
                  <div>
                    <div>Estado: {response.taskState}</div> {/* Estilo según su valor, color */}	
                    <div>Fecha de subida: {response.uploadDate}</div> {/* Que se muestre solo cuando haya sido entregada */}	
                    <div>
                      {response.calification != null && response.calification !== -1 ? (
                        <>Calificación: {response.calification}</>
                      ) : (
                        "No calificado"
                      )}
                    </div>
                  </div>
              }</div>
              )}
              {showCorrectionButton && (
                <Button id="goToTaskCorrection" onClick={() => navigate(`/tasks/${taskId}/correction/${currentUser.id}`, {state: {task, response}})}>
                  Revisar corrección
                </Button>
              )}
            </>
            
          )
          ) : (
              <> 
                  <h2>Tarea no encontrada</h2>
              </>
          )
        }
      </div>
    </>
  );
};

export default TaskViewer;