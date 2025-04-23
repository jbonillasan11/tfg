import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocalState } from '../utils/useLocalState';
import fetchService from '../services/fetchService';
import AddUserToTask from '../ModalWindows/AddUserToTask';
import { ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TopBar from '../Components/TopBar';

const TaskViewer = () => {

    const navigate = useNavigate();

    const[authValue, setAuthValue] = useLocalState("", "authValue");
    const [currentUser, setCurrentUser] = useLocalState("", "currentUser");

    const taskId = window.location.href.split("/tasks/")[1]; //Obtenemos el id de la tarea de la URL
    const[task, setTask] = useState("");
    const[creator, setCreator] = useState("");

    const [updatedUserIds, setUpdatedUserIds] = useState([]);

    useEffect(() => {
      fetchService(`tasks/${taskId}`, "GET", authValue, null) //Petición asíncrona a nuestra APIRest
        .then(taskData => {
          setTask(taskData);
        });
    }, [authValue, taskId])

    useEffect(() => {
      if (task !== ""){
        fetchService(`users/getUserId/${task.creatorId}`, "GET", authValue)
        .then(creatorData => {
          setCreator(creatorData);
        });
      }
    }, [authValue, task])

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
      .then(taskData => {
        alert("Tarea eliminada con éxito");
        window.location.href = "/dashboard"; //Redirigimos al dashboard
      })
    }

    function saveChanges(){
      if (updatedUserIds.length === 0) fetchService(`tasks/deleteUsers/${taskId}`, "PUT", authValue, null) //Si no hay usuarios
      else fetchService(`tasks/setUsers/${taskId}`, "PUT", authValue, updatedUserIds) //Si hay 
    }

    function editTaskData(){
      //Editar tarea en ventana distinta o en la misma
    }

    function goToTask(){
      //Redirigimos a la plantilla de la tarea, con los datos y solución parcial del alumno
    }

    function sendResponse(){  
      //Guardamos respuesta en el usuario o en la tarea
    }
    
    
    return (
      <>
        <div>
          <TopBar currentUser={currentUser} />
          {task ? ( 
            currentUser.userType === "PROFESSOR" ? ( //Que muestre ambos como alumno, pero si es profesor y pulsa editar se muestre esto? Uso booleano para renderzar una cosa u otra, su valor cambia atendiendo a si se pulsa el botón
          <>
              <h1>Tarea: <input type="text" value = {task.name} onChange={(e) => saveFieldUpdate("name", e.target.value)} /></h1>
              <h3>Creada por: {creator.name} {creator.surname}</h3>
              <h2>Plazo hasta: <input type="date" value={task.due} onChange={(e) => saveFieldUpdate("due", e.target.value)} /></h2>
              <h3>Descripción: <input type="text" value = {task.description} onChange={(e) => saveFieldUpdate("description", e.target.value)} /></h3>
              <h3>Tarea repasable: <input type="checkbox" checked={task.redoable} onChange={(e) => saveFieldUpdate("redoable", e.target.checked)} /></h3>

              <button id="editTask" onClick={() => editTaskData()}>Tarea</button>
              <button id="saveTaskButton" onClick={() => saveTaskDB()}>Guardar cambios</button>
              <button id="deleteTaskButton" onClick={() => confirmTaskDeletion()}>Eliminar tarea</button>
              <AddUserToTask
                parentTask={task}
                onSaveUsers={(updatedUsers) => setUpdatedUserIds(updatedUsers)}
              />
              <p>{task.taskData} {// Escribir plantilla de la tarea
              } </p>
              <h3>Usuarios</h3>
              <ListGroup>
                {task.assigneesUserIds && task.assigneesUserIds.map(userId => (
                  <ListGroup.Item key= {userId}
                      action
                      //onClick={() => ()}>
                        >
                      {"link a la tarea con las respuestas del usuario"} Nombre y apellido de los usuarios, con estado y fecha de subida
                  </ListGroup.Item>
                  ))}
              </ListGroup>
              
          </>
          ) : (
            <>
              <h1>Tarea: {task.name}</h1>
              <h3>Creada por: {creator.name} {creator.surname}</h3>
              <h2>Plazo hasta: {task.due}</h2>
              <h3>Descripción: {task.description}</h3>
              <h3>Datos: <input type="text" value = {task.taskData} onChange={(e) => saveFieldUpdate("taskData", e.target.value)} /></h3>
              {//Si la nota es -1, renderizamos opciones de resolver, etcétera
                //Si la nota es otro valor, renderizamos la nota y ocultamos los botones
                //Si la tarea es repasable, mostramos la nota y los botones
                //Respuestas correctas si no es repasable en otro botón?
              }
              <button id="goToTask" onClick={() => goToTask()}>Resolver</button>
              <button id="sendResponse" onClick={() => sendResponse()}>Enviar respuesta</button>
              <p>Tu progreso: {task.taskData} {// Escribir estado de la respuesta del alumno, con botón para seguir o subir
              } </p>
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