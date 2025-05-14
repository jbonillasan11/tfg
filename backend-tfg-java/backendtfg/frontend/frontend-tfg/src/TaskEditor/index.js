import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import AddQuestion from '../ModalWindows/AddQuestion';
import fetchService from '../services/fetchService';
import { useLocalState } from '../utils/useLocalState';


const TaskEditor = () => {

    const[authValue] = useLocalState("", "authValue");

    const taskId = useLocation().state.task.id;
    const [task, setTask] = useState("");
    const [createdQuestion, setCreatedQuestion] = useState(null); //Pregunta recién creada en el modal
    const [newQuestions, setNewQuestions] = useState(null); //Conjunto de preguntas nuevas, no en la tarea, a guardar

    const [shownQuestions, setShownQuestions] = useState(null); //Conjunto de preguntas que se muestran en la tarea, a mostrar

    useEffect(() => {
            fetchService(`tasks/${taskId}`, "GET", authValue, null) //Petición asíncrona a nuestra APIRest
            .then(taskData => {
              setTask(taskData);
              setShownQuestions(taskData.content);
            });
    }, []);

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

    function saveChanges() {
        const taskCopy = { ...task };
        if (newQuestions){
            taskCopy.content = [...task.content, ...newQuestions];
        }
        fetchService(`tasks/${task.id}`, "PUT", authValue, taskCopy)
        .then(alert("Preguntas guardadas"));
    }

    function deleteQuestion(index) {
        const updatedQuestions = shownQuestions.filter((_, i) => i !== index);
        setShownQuestions(updatedQuestions);
        task.content = updatedQuestions;
    }


    return (
        <div>
            <h1>Editando: {task.name}</h1>
            <AddQuestion
                onSaveQuestion={setCreatedQuestion}
            />
            <Button onClick={() => saveChanges()}>Guardar cambios</Button> 
            {newQuestions && newQuestions.map((newQuestion, index) => (
                <div key={index}>
                    <p>Pregunta del tipo {newQuestion.type}</p>
                    <p>Pregunta: {newQuestion.question}</p>
                    {newQuestion.correctAnswer && <p>Respuesta correcta: {newQuestion.correctAnswer}</p>}   
                    {newQuestion.options && (<p>Opciones: </p>) && (             
                        newQuestion.options.map((option, index) => (
                            <p key={index}>{option}</p>
                        )   
                    ))}
                    {newQuestion.maxPoints && <p>Puntuación máxima: {newQuestion.maxPoints}</p>}
                </div>
            ))}
            {shownQuestions && shownQuestions.map((element, index) => (
                <div key={index}>
                    <h2>Pregunta {index+1}: {element.type}</h2>
                    <p>Enunciado: {element.question}</p>
                    {element.correctAnswer && <p>Respuesta correcta: {element.correctAnswer}</p>}   
                    {element.options && element.options.length > 0 && (
                        <>
                            <p>Opciones:</p>
                            {element.options.map((option, index) => (
                            <p key={index}>{option}</p>
                            ))}
                        </>
                        )}
                    {element.maxPoints && <p>Puntuación máxima: {element.maxPoints}</p>}
                    <p>{element.media}</p>
                    {<Button onClick={() => deleteQuestion(index)}>Eliminar pregunta</Button>}
                </div>
            ))}
            
  
        </div>
    );
};

export default TaskEditor;