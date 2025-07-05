import { useLocation } from 'react-router-dom';
import fetchService from '../services/fetchService';
import { useLocalState } from '../utils/useLocalState';
import { useState } from 'react';
import FillTheBlankRender from '../QuestionRenders/FillTheBlankRender';
import DragAndDropRender from '../QuestionRenders/DragAndDropRender';
import MultipleChoiceRender from '../QuestionRenders/MultipleChoiceRender';
import OpenAnswerRender from '../QuestionRenders/OpenAnswerRender';
import TrueOrFalseRender from '../QuestionRenders/TrueOrFalseRender';
import TopBar from '../Components/TopBar';
import AlertModal from '../ModalWindows/AlertModal';

const TaskResolver = () => {

    const [authValue] = useLocalState("", "authValue");
    const [currentUser] = useLocalState("", "currentUser");

    const location = useLocation();
    const state = location.state || {};
    const task = state.task || null;
    const [responses, setResponses] = useState(state.response.response || []);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [navigateTo, setNavigateTo] = useState(null);
    
    function saveResponseUpdate(index, value) {
        const copy = [...responses];
        copy[index] = value;
        setResponses(copy);
    }

    function questionRender(question, index){
        switch (question.type) { //Por cada pregunta renderiza los elementos propios del tipo. La respuesta quedará guardada en un índice dentro de responses
            case "FILL_THE_BLANK":
                return (
                    <FillTheBlankRender
                        question={question}
                        index={index}
                        responseParent={responses[index]}
                        onResponseUpdate={saveResponseUpdate}
                        responsesObject={responses}
                        isTeacher={currentUser.userType === "PROFESSOR"}
                    />
                );

            case "MULTIPLE_CHOICE":
                return (    
                    <MultipleChoiceRender
                        question={question}
                        index={index}
                        responseParent={responses[index]}
                        onResponseUpdate={saveResponseUpdate}
                        responsesObject={responses}
                        isTeacher={currentUser.userType === "PROFESSOR"}
                    />
                );

            case "DRAG": 
                return (
                    <DragAndDropRender
                        question={question}
                        index={index}
                        responseParent={responses[index]}
                        onResponseUpdate={saveResponseUpdate}
                        responsesObject={responses}
                        isTeacher={currentUser.userType === "PROFESSOR"}
                    />
                );

            case "TRUE_FALSE":
                return (
                    <TrueOrFalseRender
                        question={question}
                        index={index}
                        responseParent={responses[index]}
                        onResponseUpdate={saveResponseUpdate}
                        responsesObject={responses}
                        isTeacher={currentUser.userType === "PROFESSOR"}
                    />
                );
            case "OPEN_ANSWER":
                return (
                    <OpenAnswerRender
                        question={question}
                        index={index}
                        responseParent={responses[index]}
                        onResponseUpdate={saveResponseUpdate}
                        responsesObject={responses}
                        isTeacher={currentUser.userType === "PROFESSOR"}
                    />
                );
            default:
                return (<></>);
        }
    };

    function saveChanges(state){
        const reqBody = {
            taskState: state,
            response: responses.map(r =>
                Array.isArray(r) ? r : [r] //Convierto las respuestas individuales en arrays para que lo reciba el backend
            )
        }
        fetchService(`users/${currentUser.id}/saveResponses/${task.id}`, "PUT", authValue, reqBody)
    }

    return (
        <div>
            <TopBar currentUser={currentUser} />
            {task && (
                <div className="container mt-4">
                    <AlertModal
                        showModal={showAlert}
                        onHide={() => setShowAlert(false)}
                        message={alertMessage}
                        navigateTo={navigateTo}
                    />
                    <div className="mb-3">
                        <h1>Tarea: {task.name}</h1>
                        {task.description && (
                            <p className="text-secondary fst-italic">{task.description}</p>
                        )}
                    </div>

                    <div className="mb-3" style={{ display: "flex", justifyContent: "right" }}>
                        <button className="main-button"
                            onClick={() => {
                                saveChanges("IN_PROGRESS");
                                setShowAlert(true);
                                setAlertMessage("Respuestas guardadas");
                        }}
                        > 
                            Guardar progreso
                        </button>
                    </div>
                    <div className="p-4 border rounded bg-light shadow-sm">
                        {task.content.map((question, index) => (
                        <div key={index} className="mb-3">
                            {questionRender(question, index)}
                        </div>
                        ))}
                    </div>
                    <div className="mb-3" style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
                        <button className="main-button"
                            onClick={() => {
                                saveChanges("COMPLETED");
                                setShowAlert(true);
                                setAlertMessage("Respuestas guardadas");
                                setNavigateTo("/dashboard");
                        }}
                        >
                            Guardar y enviar
                        </button>
                    </div>
                </div>
            )}
            </div>
        
    );
};

export default TaskResolver;  