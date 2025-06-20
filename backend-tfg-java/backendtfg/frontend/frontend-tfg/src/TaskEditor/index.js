import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import AddQuestion from '../ModalWindows/AddQuestion';
import fetchService from '../services/fetchService';
import { useLocalState } from '../utils/useLocalState';
import TopBar from '../Components/TopBar';
import AlertModal from '../ModalWindows/AlertModal';

const TaskEditor = () => {

    const[authValue] = useLocalState("", "authValue");
    const[currentUser] = useLocalState("", "currentUser");

    const taskId = useLocation().state.task.id;
    const [task, setTask] = useState("");
    const [createdQuestion, setCreatedQuestion] = useState(null); //Pregunta recién creada en el modal
    const [newQuestions, setNewQuestions] = useState(null); //Conjunto de preguntas nuevas, no en la tarea, a guardar
    const [toDelete, setToDelete] = useState([]); //Pregunta a eliminar, no en la tarea

    const [shownQuestions, setShownQuestions] = useState(null); //Conjunto de preguntas que se muestran en la tarea, a mostrar

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
            fetchService(`tasks/${taskId}`, "GET", authValue, null) //Petición asíncrona a nuestra APIRest
            .then(taskData => {
              setTask(taskData);
              setShownQuestions(taskData.content);
            });
    }, [taskId, authValue]);

    useEffect(() => {
        if (createdQuestion) {
            setNewQuestions((prevQuestions) => {
                if (prevQuestions) {
                    return [...prevQuestions, createdQuestion];
                } else {
                    return [createdQuestion];
                }
            });
        }
    }, [createdQuestion]);

    const handleMediaUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetchService("mediaUploader/upload", "POST", authValue, formData);  
        return(response.url);
    }

    async function saveChanges() {
        const taskCopy = { ...task };
        if (newQuestions){
            for (const question of newQuestions) {
                if (question.media) {
                    const responseURL = await handleMediaUpload(question.media);
                    question.mediaURL = responseURL;
                }
            }
            taskCopy.content = [...task.content, ...newQuestions];
        }
        if (toDelete && toDelete.length > 0) {
            for (const question of toDelete) {
                if (question.mediaURL) {
                    await fetchService(`mediaUploader/delete`, "DELETE", authValue, question.mediaURL); //El firewall de Spring rechaza slashes en la URL, por lo que lo enviamos como body
                }
            }
            taskCopy.content = taskCopy.content.filter( // Filtramos las preguntas eliminadas de taskCopy.content si ya estaban
                (q) => !toDelete.some((deletedQ) => q.question === deletedQ.question)
            );
        }
        await fetchService(`tasks/${task.id}`, "PUT", authValue, taskCopy);
        setShowAlert(true);
        setAlertMessage("Preguntas guardadas! Recarga la página para ver los cambios.");
    }

    function deleteQuestion(index) {
        const updatedQuestions = shownQuestions.filter((_, i) => i !== index);
        setShownQuestions(updatedQuestions);
        setToDelete(prev => [...prev, shownQuestions[index]]);
        task.content = updatedQuestions;
    }

    function typeToText (type) {
        switch (type) {
            case "TRUE_FALSE":
                return "Verdadero/Falso";
            case "MULTIPLE_CHOICE":
                return "Opción múltiple";
            case "FILL_THE_BLANK":
                return "Rellenar los espacios en blanco";
            case "DRAG":
                return "Arrastrar";
            case "OPEN_ANSWER":
                return "Respuesta abierta";
            default:
                return "";
        }
    }

    function handleCreatedQuestion(question) {
        setCreatedQuestion(question);
        shownQuestions.push(question);
    }

    return (
        <div>
            <TopBar currentUser={currentUser} />
            <div className="container mt-4">
                <div className="mb-3">
                    <h1>Editando {task.name}</h1>
                </div>
                <AlertModal
                    showModal={showAlert}
                    onHide={() => setShowAlert(false)}
                    message={alertMessage}
                />
                <div className="mb-3" style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <AddQuestion
                        onSaveQuestion={handleCreatedQuestion}
                    />
                    <button className="main-button"
                        onClick={() => {
                            saveChanges("IN_PROGRESS");
                            setShowAlert(true);
                            setAlertMessage("Respuestas guardadas!");
                    }}> 
                        Guardar progreso
                    </button>
                </div>
                    <div className="p-4 border rounded bg-light shadow-sm">
                        {shownQuestions && shownQuestions.map((element, index) => (
                            <div key={index} className="mb-4 p-3 border rounded bg-white shadow-sm">
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    gap: "2rem"
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <h4>Pregunta {index + 1}: {typeToText(element.type)}</h4>
                                        <p style={{ fontSize: "1.1rem", marginTop: "0.75rem" }}><strong>Enunciado:</strong> {element.question}</p>
                                        {element.correctAnswer && <p><strong>Respuesta correcta:</strong> {element.correctAnswer}</p>}
                                        {element.options && element.options.length > 0 && (
                                            <>
                                                <p><strong>Opciones:</strong></p>
                                                <ListGroup style={{ paddingLeft: "1.2rem" }}>
                                                    {element.options.map((option, i) => (
                                                        <ListGroup.Item key={i}>{option}</ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            </>
                                        )}
                                        {element.maxPoints && <p style={{ fontSize: "1.1rem", marginTop: "1rem" }}><strong>Puntuación máxima:</strong> {element.maxPoints}</p>}
                                    </div>

                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        minWidth: "160px",
                                        maxWidth: "220px",
                                        width: "100%",
                                        height: "100%"
                                    }}>
                                        {element.mediaURL && (
                                            <img
                                                src={element.mediaURL}
                                                alt={`Decoración pregunta ${index}`}
                                                style={{
                                                    width: "100%",
                                                    height: "auto",
                                                    maxHeight: "200px",
                                                    objectFit: "contain",
                                                    borderRadius: "12px",
                                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                                    marginBottom: "0.75rem"
                                                }}
                                            />
                                        )}
                                        <button
                                            className="delete-button"
                                            onClick={() => deleteQuestion(index)}
                                        >
                                            Eliminar pregunta
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <p style={{ fontSize: "1.1rem", marginTop: "0.75rem", fontStyle: "italic", color: "#6c757d" }}>El contenido multimedia se cargará una vez se hayan guardado los cambios.</p>
                    </div>

                </div>
        </div>
    );
};

export default TaskEditor;