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
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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

    useEffect(() => {
        fetchService(`users/getUserId/${userId}`, "GET", authValue)
        .then(userData => {
            setResponsesObject(userData.responses[task.id]); //Respuestas del usuario
        });
    }, [userId]);

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
            alert("Corrección guardada");
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
            {task && user ? (
                <h2>
                    Corrección de la tarea {task.name} del alumno {user.name} {user.surname}
                </h2>
                    ) : (
                        <h2>Cargando...</h2>
                    )
            }
            <Button id="saveInProgressCorrection" onClick={() => saveCorrectionUpdateDB(responsesObject, totalScore, "CORRECTION_IN_PROGRESS")}>
                  Guardar y continuar
            </Button>
            <Button id="saveCompletedCorrection" onClick={() => saveCorrectionUpdateDB(responsesObject, totalScore, "CORRECTED")}>
                  Guardar y enviar
            </Button>
            {task && responsesObject?.response && task.content.map((question, index) => (
                <div key={index}> {questionRender(question, index)} </div>
            ))}
            <div style={{ marginTop: "20px" }}>
                <h4>Nota total:</h4>
                    {totalScore}
            </div>
        </div>
    );
};

export default TaskCorrector;