import { useEffect } from 'react';
import { useState } from 'react';
import { useLocalState } from '../utils/useLocalState';
import fetchService from '../services/fetchService';
import AddUserToTask from '../ModalWindows/AddUserToTask';
import { ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TopBar from '../Components/TopBar';
import AlertModal from '../ModalWindows/AlertModal';
import ConfirmDeletionWindow from '../ModalWindows/ConfirmDeletionWindow';

const TaskViewer = () => {

    const navigate = useNavigate();

    const [authValue] = useLocalState("", "authValue");
    const [currentUser] = useLocalState("", "currentUser");

    const taskId = window.location.href.split("/tasks/")[1]; //Obtenemos el id de la tarea de la URL
    const [task, setTask] = useState("");
    const [creator, setCreator] = useState("");

    const [users, setUsers] = useState([]);
    const [response, setResponse] = useState({});

    const [updatedUserIds, setUpdatedUserIds] = useState([]);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [navigateTo, setNavigateTo] = useState(null);
    const [showAlertDeletion, setShowAlertDeletion] = useState(false);

    useEffect(() => {
        fetchService(`tasks/${taskId}`, "GET", authValue, null) //Petición asíncrona a nuestra APIRest
        .then(taskData => {
          setTask(taskData);
          setUpdatedUserIds(taskData.assigneesUserIds);
        });
    }, [taskId, authValue]);

    useEffect(() => {
      if (task !== ""){
        fetchService(`users/getUserId/${task.creatorId}`, "GET", authValue)
        .then(creatorData => {
          setCreator(creatorData);
        });
      }
    }, [authValue, task])

    useEffect(() => { //Obtenemos la información de los usuarios en la tarea, solo para profesores
      if (task !== "" && currentUser.userType === "PROFESSOR"){
        fetchService("users/getUsers", "POST", authValue, task.assigneesUserIds)
        .then(usersData => {
          setUsers(usersData);
        })
      }
    }, [task, authValue, currentUser, taskId])

    useEffect(() => {
      if (currentUser.userType === "PROFESSOR") return;
      fetchService(`users/getUserId/${currentUser.id}`, "GET", authValue)
      .then(userData => {
          setResponse(userData.responses[taskId]); //Respuestas del usuario
      });
    }, [currentUser, authValue, taskId]);

    function saveFieldUpdate(field, value) { //Función que guarda los datos de la tarea y nos permite modificarlo las veces que queramos
      const taskCopy = {...task};
      taskCopy[field] = value;
      setTask(taskCopy);
    }

    async function saveTaskDB() {
      const updatedAssignees = await saveChanges(); 

      const updatedTask = {
        ...task,
        assigneesUserIds: updatedAssignees
      };
      const taskData = await fetchService(`tasks/${taskId}`, "PUT", authValue, updatedTask);

      setTask(taskData);
      setShowAlert(true);
      setAlertMessage("Tarea guardada! Recarga la página para ver los cambios.");
    }

    function confirmTaskDeletion(){
      setShowAlertDeletion(true);
      setAlertMessage("¿Estás seguro de que quieres eliminar la tarea? Esta acción no se puede deshacer.");
    }

    function deleteTaskDB(){
      fetchService(`tasks/deleteTaskId/${taskId}`, "DELETE", authValue, null)
      .then(() => {
        setShowAlert(true);
        setAlertMessage("Tarea eliminada con éxito");
        setNavigateTo("/dashboard"); //Redirigimos al dashboard
      })
    }

    async function saveChanges() { //Gestiona los nuevos usuarios, añadiendo la tarea a todos ellos
      let response;
      if (updatedUserIds.length === 0) {
        response = await fetchService(`tasks/deleteUsers/${taskId}`, "PUT", authValue, null);
      } else {
        response = await fetchService(`tasks/setUsers/${taskId}`, "PUT", authValue, updatedUserIds);
      }

      return response.assigneesUserIds; // Devuelve solo lo que necesitas
    }

    function editTaskData(){
      navigate(`/tasks/${taskId}/edit`, {state: {task}});
    }

    function handleUserCorrection(user){
      if (user.responses[taskId].taskState === "PENDING") return;
      navigate(`/tasks/${taskId}/corrector/${user.id}`, {state: {task, user}})
    }

    function taskStateStyles(state){
      switch (state) {
        case "COMPLETED":
          return["text-success", "Completada"];
        case "IN_PROGRESS":
          return ["text-warning", "En progreso"];
        case "CORRECTION_IN_PROGRESS":
          return ["text-danger", "Corrección en progreso"];
        case "CORRECTED":
          return ["text-primary", "Corregida"];
        default:
          return ["text-secondary", "Pendiente"];
      }
    }

    let showButton = false;
    let showCorrectionButton

    if (response && (response.taskState === "PENDING" || response.taskState === "IN_PROGRESS")) {
        showButton = true;
    } else if (response && response.taskState === "CORRECTED") {
        showCorrectionButton = true;
    }
    
    return (
      <>
        <div>
          <TopBar currentUser={currentUser} />
          <AlertModal
            showModal={showAlert}
            onHide={() => setShowAlert(false)}
            message={alertMessage}
            redirectTo={navigateTo}
          />
          <ConfirmDeletionWindow
            showModal={showAlertDeletion}
            onHide={() => setShowAlertDeletion(false)}
            onConfirm={deleteTaskDB}
            message={alertMessage}
            navigateTo={navigateTo}
          />
          {task ? ( 
            currentUser.userType === "PROFESSOR" ? ( //RENDERIZADO PARA DOCENTES
          <div style={{ padding: "2rem" }}>
              <h1>Tarea <input type="text" value = {task.name} onChange={(e) => saveFieldUpdate("name", e.target.value)} /></h1>
              <h4>Creada por {creator.name} {creator.surname}</h4>
              <h3>Descripción: <input type="text" style={{width: "40%"}} value = {task.description} onChange={(e) => saveFieldUpdate("description", e.target.value)} /></h3>
              <h2>Fecha máxima de entrega:  <input style = {{width: "10%", border: "none"}} type="date" value={task.due} onChange={(e) => saveFieldUpdate("due", e.target.value)} /></h2>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                <label htmlFor="redoableCheck" style={{ fontSize: "2rem", margin: 0, marginRight: "1rem", fontWeight: "600" }}>
                  Repasable?
                </label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="redoableCheck"
                  checked={task.redoable}
                  onChange={(e) => saveFieldUpdate("redoable", e.target.checked)}
                  style={{ transform: "scale(1.5)" }}
                />
              </div>
              <button id="editTask" className="main-button" onClick={() => editTaskData()}>Editar preguntas</button>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button id="saveTaskButton" className="main-button" onClick={() => saveTaskDB()}>Guardar cambios</button>
                <button id="deleteTaskButton" className="delete-button" onClick={() => confirmTaskDeletion()}>Eliminar tarea</button>
              </div>
              <div className="d-flex align-items-center justify-content-between mt-4 mb-3">
                <h3 className="mb-0">Usuarios y entregas</h3>
                <AddUserToTask
                  parentTask={task}
                  onSaveUsers={(updatedUsers) => setUpdatedUserIds(updatedUsers)}
                />
              </div>

              <ListGroup className="mx-4">
                {users &&
                  users
                    .filter(user => user.userType === "STUDENT")
                    .map(user => {
                      const response = user.responses[taskId];
                      const [stateColor, stateText] = taskStateStyles(response ? response.taskState : "PENDING");
                      return (
                        <ListGroup.Item
                          key={user.id}
                          action
                          onClick={() => handleUserCorrection(user)}
                          className="bg-white mb-3 shadow-sm rounded"
                        >
                          <div><strong>{user.name} {user.surname}</strong></div>
                          <div>
                            Estado: <strong className={stateColor}>{stateText}</strong>
                          </div>
                         {response.uploadDate && (
                            <div>
                              Fecha de subida:{" "}
                              <span
                                style={{
                                  color: new Date(response.uploadDate) > new Date(task.due) ? "red" : "green",
                                  fontWeight: "bold"
                                }}
                              >
                                {new Date(response.uploadDate).toLocaleDateString('es-ES')}
                              </span>
                            </div>
                          )}

                          <div>
                            Calificación:{" "}
                            {response.calification !== -1
                              ? response.calification
                              : "No calificado"}
                          </div>
                        </ListGroup.Item>
                      );

                    })}
              </ListGroup>
            </div>
          ) : ( //RENDERIZADO PARA ESTUDIANTES
            
            <div style={{ padding: "2rem" }}>
              <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                  Tarea {task.name}
                </h1>

                <h3 style={{ fontSize: "1.25rem", color: "#555", marginBottom: "1rem" }}>
                  Creada por {creator.name} {creator.surname}
                </h3>

                <div style={{ fontStyle: "italic", color: "#6c757d", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
                  {task.description}
                </div>

                <h4 style={{ color: "#333", marginTop: "1rem" }}>
                  Plazo hasta {new Date(task.due).toLocaleDateString('es-ES')}
                </h4>
              </div>

              {response && (
                <div className="card mt-4 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Tu intento</h5>
                    
                    <p className="card-text">
                      <strong>Estado:</strong>{" "}
                      <span
                        className={taskStateStyles(response.taskState)[0]}
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {taskStateStyles(response.taskState)[1]}
                      </span>
                    </p>

                    {response.taskState === "COMPLETED" && (
                      <p className="card-text">
                        <strong>Fecha de subida:</strong> {new Date(response.uploadDate).toLocaleDateString('es-ES')}
                      </p>
                    )}

                    <p className="card-text">
                      <strong>Calificación:</strong>{" "}
                      {response.calification != null && response.calification !== -1 ? (
                        <span>{response.calification}</span>
                      ) : (
                        <span className="text-muted">No calificado</span>
                      )}
                    </p>
                  </div>
                </div>
              )}

               {showButton && (
                <button id="goToTask" className="main-button" style={{marginTop:"1.5rem"}} onClick={() => navigate(`/tasks/${taskId}/responses/${currentUser.id}`, {state: {task, response}})}>
                  Resolver
                </button>
              )}
              {showCorrectionButton && (
                <>
                  {task.redoable ? (
                    <button id="goToTaskRedo" className="main-button" style={{marginTop:"2rem"}}onClick={ () =>{ 
                        const resetResponse = {...response, response: [], calification: -1, taskState: "PENDING"};
                        navigate(`/tasks/${taskId}/responses/${currentUser.id}`, {state: {task, response: resetResponse}})
                      }}>
                        Resolver de nuevo
                    </button>
                  ) : (
                    <button id="goToTaskCorrection" className="main-button" style={{marginTop:"1.5rem"}} onClick={() => navigate(`/tasks/${taskId}/correction/${currentUser.id}`, {state: {task, response}})}>
                      Revisar corrección
                    </button>)}
                </>
              )}
            </div>
            
          )
          ) : (
              <div style={{ padding: "2rem" }}> 
                  <h2>Tarea no encontrada</h2>
              </div>
          )
        }
      </div>
    </>
  );
};

export default TaskViewer;