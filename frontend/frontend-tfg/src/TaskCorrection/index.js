import React from 'react';
import FillTheBlankRender from '../QuestionRenders/FillTheBlankRender';
import DragAndDropRender from '../QuestionRenders/DragAndDropRender';
import MultipleChoiceRender from '../QuestionRenders/MultipleChoiceRender';
import OpenAnswerRender from '../QuestionRenders/OpenAnswerRender';
import TrueOrFalseRender from '../QuestionRenders/TrueOrFalseRender';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import TopBar from '../Components/TopBar';
import { useLocalState } from '../utils/useLocalState';

const TaskCorrection = () => {

    const location = useLocation();
    const state = location.state;
    const task = state.task || null;
    const responsesObject = state.response || null;
    const [currentUser] = useLocalState("", "currentUser");

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
            <TopBar currentUser={currentUser} />
            <div className="container mt-4">
                {task ? (
                    <div style={{ padding: "1rem" }}>
                        <h2>
                            Corrección de la tarea {task.name}
                        </h2>
                        {task.description && (
                            <p className="text-secondary fst-italic">{task.description}</p>
                        )}
                    </div>
                ) : (
                    <h2 style={{ padding: "1rem" }}>Cargando...</h2>
                )}
                <div className="p-4 border rounded bg-light shadow-sm">
                    {task && responsesObject?.response && task.content.map((question, index) => (
                        <div key={index}> {questionRender(question, index)} </div>
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

export default TaskCorrection;