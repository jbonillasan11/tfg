import React from 'react';
import { useLocation } from 'react-router-dom';
import fetchService from '../services/fetchService';
import { useLocalState } from '../utils/useLocalState';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import FillTheBlank from '../QuestionRenders/FillTheBlank';
import MultipleChoice from '../QuestionRenders/MultipleChoice';
import TrueOrFalse from '../QuestionRenders/TrueOrFalse';
import OpenAnswer from '../QuestionRenders/OpenAnswer';
import DragAndDrop from '../QuestionRenders/DragAndDrop';
import { useNavigate } from 'react-router-dom';

const TaskResolver = () => {

    const [authValue] = useLocalState("", "authValue");
    const [currentUser] = useLocalState("", "currentUser");

    const navigate = useNavigate();

    const location = useLocation();
    const state = location.state || {};
    const task = state.task || null;
    const [responses, setResponses] = useState(state.response.response || []);
    
    function saveResponseUpdate(index, value) {
        const copy = [...responses];
        copy[index] = value;
        setResponses(copy);
    }

    function questionRender(question, index){
        switch (question.type) { //Por cada pregunta renderiza los elementos propios del tipo. La respuesta quedará guardada en un índice dentro de responses
            case "FILL_THE_BLANK":
                return (
                    <FillTheBlank
                        question={question}
                        index={index}
                        responsesParent={responses[index]}
                        onResponseUpdate={saveResponseUpdate}
                    />
                );

            case "MULTIPLE_CHOICE":
                return (    
                    <MultipleChoice
                        question={question}
                        index={index}
                        responseParent={responses[index]}
                        onResponseUpdate={saveResponseUpdate}
                    />
                );

            case "DRAG": 
                return (
                    <DragAndDrop
                        question={question}
                        index={index}
                        responsesParent={responses[index]}
                        onResponseUpdate={saveResponseUpdate}
                    />
                );

            case "TRUE_FALSE":
                return (
                    <TrueOrFalse
                        question={question}
                        index={index}
                        responseParent={responses[index]}
                        onResponseUpdate={saveResponseUpdate}
                    />
                );
            case "OPEN_ANSWER":
                return (
                    <OpenAnswer
                        question={question}
                        index={index}
                        responseParent={responses[index]}
                        onResponseUpdate={saveResponseUpdate}
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