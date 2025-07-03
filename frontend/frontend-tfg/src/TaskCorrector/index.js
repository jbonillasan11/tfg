import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLocalState } from '../utils/useLocalState';
import { useState } from 'react';
import fetchService from '../services/fetchService';
import FillTheBlankRender from '../QuestionRenders/FillTheBlankRender';
import DragAndDropRender from '../QuestionRenders/DragAndDropRender';
import MultipleChoiceRender from '../QuestionRenders/MultipleChoiceRender';
import OpenAnswerRender from '../QuestionRenders/OpenAnswerRender';
import TrueOrFalseRender from '../QuestionRenders/TrueOrFalseRender';
import { useNavigate } from 'react-router-dom';
import TopBar from '../Components/TopBar';
import AlertModal from '../ModalWindows/AlertModal';

const TaskCorrector = () => {

    const [authValue] = useLocalState("", "authValue");
    const [currentUser] = useLocalState("", "currentUser");

    const location = useLocation();
    const state = location.state || {};
    const task = state.task || null;

    const user = state.user || null;
    const [userId] = useState(user?.id ?? null);

    const [responsesObject, setResponsesObject] = useState([]); //Objeto formado por calificación, respuestas, correcciones, estado, fecha de subida

    const [calification, setCalification] = useState([]);

    const [totalScore, setTotalScore] = useState(responsesObject.calification || 0);

    const navigate = useNavigate();

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        fetchService(`users/getUserId/${userId}`, "GET", authValue)
        .then(userData => {
            setResponsesObject(userData.responses[task.id]); //Respuestas del usuario
        });
    }, [userId, authValue]);

    useEffect(() => {
        const list = responsesObject.corrections ?? [];
        setCalification(list.map(item => item.calification));
    }, [responsesObject]);

    useEffect(() => {
        setTotalScore(calification.reduce((sum, val) => sum + (parseFloat(val) || 0), 0))
    }, [calification]);
    
    function saveCorrectionUpdate(index, value) {
        const correctionsCopy = [...responsesObject.corrections];
        correctionsCopy[index] = value;

        const calificationCopy = [...calification];
        calificationCopy[index] = value.calification;

        setCalification(calificationCopy);
        setResponsesObject(prev => ({
            ...prev,
            corrections: correctionsCopy
        }));
    }

    function saveCorrectionUpdateDB(responsesObject, score, status) {
        const updatedResponsesObject = {
            ...responsesObject,
            calification: score,
            taskState: status
        };
        fetchService( `users/${userId}/saveCorrections/${task.id}`, "PUT", authValue, updatedResponsesObject)
        .then(() => {
            setShowAlert(true);
            setAlertMessage("Corrección guardada");
            if (status === "CORRECTED") {
                navigate(`/tasks/${task.id}`);
            }
        })
    }

    function questionRender(question, index){
        switch (question.type) { //Por cada pregunta renderiza los elementos propios del tipo. La respuesta quedará guardada en un índice dentro de responses
            case "FILL_THE_BLANK":
                return (
                    <FillTheBlankRender
                        question={question}
                        index={index}
                        responseParent={responsesObject.response[index]}
                        responsesObject={responsesObject}
                        onCorrectionUpdate={saveCorrectionUpdate}
                        isTeacher={currentUser.userType === "PROFESSOR"} //En teoría siempre es true
                    />
                );

            case "MULTIPLE_CHOICE":
                return (    
                    <MultipleChoiceRender
                        question={question}
                        index={index}
                        responseParent={responsesObject.response[index]}
                        responsesObject={responsesObject}
                        onCorrectionUpdate={saveCorrectionUpdate}
                        isTeacher={currentUser.userType === "PROFESSOR"}
                    />
                );

            case "DRAG": 
                return (
                    <DragAndDropRender
                        question={question}
                        index={index}
                        responseParent={responsesObject.response[index]}
                        responsesObject={responsesObject}
                        onCorrectionUpdate={saveCorrectionUpdate}
                        isTeacher={currentUser.userType === "PROFESSOR"}
                    />
                );

            case "TRUE_FALSE":
                return (
                    <TrueOrFalseRender
                        question={question}
                        index={index}
                        responseParent={responsesObject.response[index]}
                        responsesObject={responsesObject}
                        onCorrectionUpdate={saveCorrectionUpdate}
                        isTeacher={currentUser.userType === "PROFESSOR"}
                    />
                );
            case "OPEN_ANSWER":
                return (
                    <OpenAnswerRender
                        question={question}
                        index={index}
                        responseParent={responsesObject.response[index]}
                        responsesObject={responsesObject}
                        onCorrectionUpdate={saveCorrectionUpdate}
                        isTeacher={currentUser.userType === "PROFESSOR"}
                    />
                );
            default:
                return (<></>);
        }
    };

    return (
        <div>
            <TopBar currentUser={currentUser} />
            <div className="container mt-4">
                <AlertModal
                    showModal={showAlert}
                    onHide={() => setShowAlert(false)}
                    message={alertMessage}
                />
                {task && user ? (
                    <div style={{ padding: "1rem" }}>
                        <h2>
                            Corrección de la tarea {task.name} del alumno {user.name} {user.surname}
                        </h2>
                        {task.description && (
                            <p className="text-secondary fst-italic">{task.description}</p>
                        )}
                    </div>
                ) : (
                    <h2 style={{ padding: "1rem" }}>Cargando...</h2>
                )}
                <div style={{ display: "flex", justifyContent: "right", marginBottom: "1rem" }}>
                     <button className="main-button" id="saveInProgressCorrection" onClick={() => saveCorrectionUpdateDB(responsesObject, totalScore, "CORRECTION_IN_PROGRESS")}>
                        Guardar y continuar
                    </button>
                    <button className="main-button" id="saveCompletedCorrection" onClick={() => saveCorrectionUpdateDB(responsesObject, totalScore, "CORRECTED")}>
                        Guardar y enviar
                    </button>
                </div>
                <div className="p-4 border rounded bg-light shadow-sm">
                    {task && responsesObject?.response && task.content.map((question, index) => (
                        <div key={index} className="mb-3"> 
                            {questionRender(question, index)} 
                        </div>
                    ))}
                </div>
                <div className="text-center mt-4"
                    style={{
                        padding: "1rem",
                        backgroundColor: totalScore >= 5 ? "#d4edda" : "#f8d7da",
                        border: `1px solid ${totalScore >= 5 ? "#c3e6cb" : "#f5c6cb"}`,
                        borderRadius: "12px",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: totalScore >= 5 ? "#155724" : "#721c24",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                        marginBottom: "1rem"
                    }}>
                    Nota final: {totalScore}
                </div>
            </div>
        </div>
    );
};

export default TaskCorrector;