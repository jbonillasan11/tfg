import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocalState } from '../utils/useLocalState';
import fetchService from '../services/fetchService';

const TaskViewer = () => {

    const[authValue, setAuthValue] = useLocalState("", "authValue");
    const [currentUser, setCurrentUser] = useLocalState("", "currentUser");
    const taskId = window.location.href.split("/tasks/")[1]; //Obtenemos el id de la tarea de la URL
    const[task, setTask] = useState("");
    const[creator, setCreator] = useState("");

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
      fetchService(`tasks/${taskId}`, "PUT", authValue, task)
      .then(taskData => {
        setTask(taskData);
        alert("Tarea guardada con éxito");
      })
    }

    function deleteTaskDB(){
      fetchService(`tasks/deleteTaskId/${taskId}`, "DELETE", authValue, null)
      .then(taskData => {
        alert("Tarea eliminada con éxito");
        window.location.href = "/dashboard"; //Redirigimos al dashboard
      })
    }

    function shareTask(){
      //Ventana modal, barra de busqueda para usuarios, muestra los ya agregados, boton agregar para los nuevos, desmarcar checkbox para eliminar a los ya agregados
    }

    function saveTaskResponse(){
      
    }

    function sendResponse(){  
      
    }
    
    
    return (
        <div>
            {task ? ( 
              currentUser.userType === "PROFESSOR" ? (
            <>
                <h1>Tarea: <input type="text" value = {task.name} onChange={(e) => saveFieldUpdate("name", e.target.value)} /></h1>
                <h3>Creada por: {creator.name} {creator.surname}</h3>
                <h2>Plazo hasta: <input type="date" value={task.due} onChange={(e) => saveFieldUpdate("due", e.target.value)} /></h2>
                <h3>Descripción: <input type="text" value = {task.description} onChange={(e) => saveFieldUpdate("description", e.target.value)} /></h3>
                <h3>Tarea repasable: <input type="checkbox" checked={task.redoable} onChange={(e) => saveFieldUpdate("redoable", e.target.checked)} /></h3>

                <button id="shareTask" onClick={() => shareTask()}>Gestionar usuarios</button>
                <button id="saveTaskButton" onClick={() => saveTaskDB()}>Guardar</button>
                <button id="deleteTaskButton" onClick={() => deleteTaskDB()}>Eliminar tarea</button>
                {// Habrá que mostrar la lista de usuarios que tienen acceso a la tarea, que permita acceder a sus respuestas y corregirlas
                }
                
            </>
            ) : (
              <>
                <h1>Tarea: {task.name}</h1>
                <h3>Creada por: {creator.name} {creator.surname}</h3>
                <h2>Plazo hasta: {task.due}</h2>
                <h3>Descripción: {task.description}</h3>
                <h3>Datos: <input type="text" value = {task.taskData} onChange={(e) => saveFieldUpdate("taskData", e.target.value)} /></h3>
                <button id="saveTaskResponse" onClick={() => saveTaskResponse()}>Guardar respuesta</button>
                <button id="sendResponse" onClick={() => sendResponse()}>Enviar respuesta</button>
              </>
              
            )
            ) : (
                <> 
                    <h2>Tarea no encontrada</h2>
                </>
            )
            }
        </div>
    );
};

export default TaskViewer;