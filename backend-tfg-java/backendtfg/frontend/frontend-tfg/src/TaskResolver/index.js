import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import fetchService from '../services/fetchService';
import { useLocalState } from '../utils/useLocalState';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import FillTheBlankRender from '../QuestionRenders/FillTheBlankRender';
import { useNavigate } from 'react-router-dom';
import DragAndDropRender from '../QuestionRenders/DragAndDropRender';
import MultipleChoiceRender from '../QuestionRenders/MultipleChoiceRender';
import OpenAnswerRender from '../QuestionRenders/OpenAnswerRender';
import TrueOrFalseRender from '../QuestionRenders/TrueOrFalseRender';

const TaskResolver = () => {

    const [authValue] = useLocalState("", "authValue");
    const [currentUser] = useLocalState("", "currentUser");

    const navigate = useNavigate();

    const location = useLocation();
    const state = location.state || {};
    const task = state.task || null;
    const [responses, setResponses] = useState(state.response.response || []);
    const [corrections, setCorrections] = useState(state.response.corrections || []);
    
    function saveResponseUpdate(index, value) {
        const copy = [...responses];
        copy[index] = value;
        setResponses(copy);
    }

    function saveCorrectionUpdate(index, value) {
        const copy = [...corrections];
        copy[index] = value;
        setCorrections(copy);
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
            {task && (
                <div> 
                    <h1>Tarea: {task.name}</h1>
                    <Button onClick={() => {saveChanges("IN_PROGRESS"); alert("Respuestas guardadas")}}>Guardar progreso</Button>
                    <Button onClick={() => {saveChanges("COMPLETED"); alert("Respuestas enviadas"); navigate("/dashboard")}}>Guardar y enviar</Button>
                    <div>
                        {task && task.content.map((question, index) => (
                            <div key={index}> {questionRender(question, index)} </div>
                            
                        ))}
                    </div>
                </div>
            )}
            
        </div>
        
    );
};

export default TaskResolver;  