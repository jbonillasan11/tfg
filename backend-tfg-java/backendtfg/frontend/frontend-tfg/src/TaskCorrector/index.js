import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLocalState } from '../utils/useLocalState';
import { useState } from 'react';
import fetchService from '../services/fetchService';
import FillTheBlank from '../QuestionRenders/FillTheBlank';
import MultipleChoice from '../QuestionRenders/MultipleChoice';
import TrueOrFalse from '../QuestionRenders/TrueOrFalse';
import OpenAnswer from '../QuestionRenders/OpenAnswer';
import DragAndDrop from '../QuestionRenders/DragAndDrop';

const TaskCorrector = () => {

    const [authValue] = useLocalState("", "authValue");
    const [currentUser] = useLocalState("", "currentUser");

    const location = useLocation();
    const state = location.state || {};
    const task = state.task || null;

    const [studentUser, setStudentUser] = useState(state.userId || null);
    const [responses, setResponses] = useState(state.response.response || []);
    const [corrections, setCorrections] = useState(state.response.correction || []);

    useEffect(() => {
        fetchService(`users/getUserId/${studentUser}`, "GET", authValue)
        .then(userData => {
            setStudentUser(userData); //Usuario
            setResponses(userData.responses[task.id].response); //Respuestas del usuario
            setCorrections(userData.responses[task.id].corrections); //Correcciones previas del usuario
        });
    }, []);
    
    function saveCorrectionUpdate(index, value) {
        const copy = [...corrections];
        copy[index] = value;
        setCorrections(copy);
    }

    function questionRender(question, index){
        switch (question.type) { //Por cada pregunta renderiza los elementos propios del tipo. La respuesta quedará guardada en un índice dentro de responses
            case "FILL_THE_BLANK":
                return (
                    <FillTheBlank
                        question={question}
                        index={index}
                        responsesParent={responses[index]}
                        correctionsParent={corrections[index]}
                        onCorrectionUpdate={saveCorrectionUpdate}
                        isTeacher={currentUser.userType === "PROFESSOR"} //En teoría siempre es true
                    />
                );

            case "MULTIPLE_CHOICE":
                return (    
                    <MultipleChoice
                        question={question}
                        index={index}
                        responsesParent={responses[index]}
                        correctionsParent={corrections[index]} //Sustituir por respuesta correcta?
                        onCorrectionUpdate={saveCorrectionUpdate}
                        isTeacher={currentUser.userType === "PROFESSOR"}
                    />
                );

            case "DRAG": 
                return (
                    <DragAndDrop
                        question={question}
                        index={index}
                        responsesParent={responses[index]}
                        correctionsParent={corrections[index]}  //Sustituir por respuesta correcta?
                        onCorrectionUpdate={saveCorrectionUpdate}
                        isTeacher={currentUser.userType === "PROFESSOR"}
                    />
                );

            case "TRUE_FALSE":
                return (
                    <TrueOrFalse
                        question={question}
                        index={index}
                        responsesParent={responses[index]}
                        correctionsParent={corrections[index]}  //Sustituir por respuesta correcta?
                        onCorrectionUpdate={saveCorrectionUpdate}
                        isTeacher={currentUser.userType === "PROFESSOR"}
                    />
                );
            case "OPEN_ANSWER":
                return (
                    <OpenAnswer
                        question={question}
                        index={index}
                        responsesParent={responses[index]}
                        correctionsParent={corrections[index]}
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
            {task && task.content.map((question, index) => (
                <div key={index}> {questionRender(question, index)} </div>
            ))}
        </div>
    );
};

export default TaskCorrector;