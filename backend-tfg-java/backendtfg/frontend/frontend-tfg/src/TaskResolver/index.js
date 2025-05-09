import React from 'react';
import { useLocation } from 'react-router-dom';
import fetchService from '../services/fetchService';
import { useLocalState } from '../utils/useLocalState';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { Form } from 'react-bootstrap';

const TaskResolver = () => {

    const [authValue] = useLocalState("", "authValue");
    const [currentUser] = useLocalState("", "currentUser");

    const location = useLocation();
    const state = location.state || {};
    const task = state.task || null;
    const [responses, setResponses] = useState([], state.response); 

    function saveResponseUpdate(index, value) { //Función que guarda los datos de la tarea y nos permite modificarlo las veces que queramos
        const responsesCopy = {...responses};
        responsesCopy[index] = value;
        setResponses(responsesCopy);
      }

    function questionRender(question, index){
        switch (question.type) { //Por cada pregunta renderiza los elementos propios del tipo. La respuesta quedará guardada en un índice dentro de responses
            case "FILL_THE_BLANK":{
                const segmentos = question.question.split("_"); //Revisar, qué ocurre si hay más de un _, cómo gestiono las respuestas
                return (
                <div key={index}>
                    <h4>Rellenar los huecos</h4>
                    {segmentos.map((segmento, i) => (
                    <span key={i}>
                        {segmento}
                        {i < segmentos.length - 1 && (
                        <Form.Control
                            type="text"
                            value={responses[index]?.[i] || ""}
                            onChange={(e) => {
                                const current = [...(responses[index] || [])];
                                current[i] = e.target.value;
                                saveResponseUpdate(index, current);
                            }}
                            style={{ display: "inline-block", width: "auto", margin: "0 5px" }}
                        />
                        )}
                        {console.log(responses)}
                    </span>
                    ))}
                </div>
                );
            }               
            case "MULTIPLE_CHOICE":
                return (
                    <div>
                        <h4>Opción múltiple</h4>
                    </div>
                );
            case "DRAG":
                return (
                    <div>
                        <h4>Arrastrar y soltar</h4>
                    </div>
                );
            case "TRUE_FALSE":
                return (
                    <div>
                        <h4>Verdadero o falso</h4>
                    </div>
                );
            case "OPEN_ANSWER":
                return (
                    <div>
                        <h4>Respuesta abierta</h4>
                    </div>
                );
            default:
                return (<></>);
        }
    }

    function saveChanges(state){
        const reqBody = {
            taskState: state,
            responses: responses
        }
        fetchService(`users/saveResponses`, "PUT", authValue, reqBody) //Envía la lista de String de responses
    }

    return (
        <div>
            {task && (
                <div> 
                    <h1>Tarea: {task.name}</h1>
                    <Button onClick={() => saveChanges("IN_PROGRESS")}>Guardar progreso</Button>
                    <Button onClick={() => saveChanges("COMPLETED")}>Guardar y enviar</Button>
                    <div>
                        {task && task.content.map((question, index) => (
                            questionRender(question, index)
                        ))}
                    </div>
                </div>
            )}
            
        </div>
        
    );
};

export default TaskResolver;  