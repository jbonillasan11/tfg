import React from 'react';
import FillTheBlankRender from '../QuestionRenders/FillTheBlankRender';
import DragAndDropRender from '../QuestionRenders/DragAndDropRender';
import MultipleChoiceRender from '../QuestionRenders/MultipleChoiceRender';
import OpenAnswerRender from '../QuestionRenders/OpenAnswerRender';
import TrueOrFalseRender from '../QuestionRenders/TrueOrFalseRender';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

const TaskCorrection = () => {

    const location = useLocation();
    const state = location.state;
    const task = state.task || null;
    const responsesObject = state.response || null;

    const [totalScore] = useState(responsesObject.calification || 0);

    function questionRender(question, index){
        switch (question.type) { //Por cada pregunta renderiza los elementos propios del tipo. La respuesta quedará guardada en un índice dentro de responses
            case "FILL_THE_BLANK":
                return (
                    <FillTheBlankRender
                        question={question}
                        index={index}
                        responseParent={responsesObject.response[index]}
                        responsesObject={responsesObject}
                        isReview={true}
                    />
                );

            case "MULTIPLE_CHOICE":
                return (    
                    <MultipleChoiceRender
                        question={question}
                        index={index}
                        responseParent={responsesObject.response[index]}
                        responsesObject={responsesObject}
                        isReview={true}
                    />
                );

            case "DRAG": 
                return (
                    <DragAndDropRender
                        question={question}
                        index={index}
                        responseParent={responsesObject.response[index]}
                        responsesObject={responsesObject}
                        isReview={true}
                    />
                );

            case "TRUE_FALSE":
                return (
                    <TrueOrFalseRender
                        question={question}
                        index={index}
                        responseParent={responsesObject.response[index]}
                        responsesObject={responsesObject}
                        isReview={true}
                    />
                );
            case "OPEN_ANSWER":
                return (
                    <OpenAnswerRender
                        question={question}
                        index={index}
                        responseParent={responsesObject.response[index]}
                        responsesObject={responsesObject}
                        isReview={true}
                    />
                );
            default:
                return (<></>);
        }
    };

    return (
        <div>
             {task ? (
                <h2>
                    Corrección de la tarea {task.name}
                </h2>
                    ) : (
                        <h2>Cargando...</h2>
                    )
            }
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

export default TaskCorrection;