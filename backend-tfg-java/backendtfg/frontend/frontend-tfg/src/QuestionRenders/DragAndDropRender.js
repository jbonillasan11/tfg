import React, { useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { useState } from 'react';

const DragAndDropRender = ({question, index, responseParent = [], onResponseUpdate, responsesObject = {}, onCorrectionUpdate, isTeacher}) => {

    const [response, setResponse] = useState(responseParent); //Array de respuestas de la pregunta

    const [corrections, setCorrections] = useState(responsesObject.corrections || {});

    const [comment, setComment] = useState(corrections.comment || "");
    const [score, setScore] = useState(corrections.calification || 0);

    function saveCorrectionUpdate(value) {
        setComment(value);
        setCorrections(value);
        onCorrectionUpdate(index, {
            calification: score,
            comment: value
        });
    } 

    function saveScoreUpdate(value) {
        value = value.replace(',', '.');
        let score = parseFloat(value);
        score = Math.min(Math.max(0, score), question.maxPoints);
        setScore(score);
        onCorrectionUpdate(index, {
            calification: score,
            corrections: corrections
        });
    }
    
    function saveResponseUpdate(i, value) {
        const copy = [...response];
        copy[i] = value;
        setResponse(copy);
        onResponseUpdate(index, copy);
    }

    const onDragStart = (e, text) => {
        e.dataTransfer.setData('text/plain', text);
    }

    const handleChange = (e) => {
        const input = e.target.value.replace(",", ".");
        if (/^-?\d*\.?\d*$/.test(input)) {
            setScore(input);
        }
    };

    const handleBlur = () => {
        if (score === "") return;
        let sanitized = score.replace(",", ".");
        let num = parseFloat(sanitized);
        if (isNaN(num)) {
            setScore(0);
            return;
        }
        if (num < 0) {
            num = 0;
        } else if (num > question.maxPoints) {
            num = question.maxPoints;
        }
        setScore(num.toString());
        onCorrectionUpdate(index, {
            calification: num,
            corrections: corrections
        });
    };
    
    const segmentos = question.question.split("_");
    return (
        <>
            <Card key={index}>
                <Card.Title>Arrastrar y soltar</Card.Title>
                <Card.Body>  
                    {segmentos.map((segmento, i) => (
                        <span key={i}>
                            {segmento}
                            {i < segmentos.length - 1 && (!isTeacher ? ( //RENDER SOLO PARA ALUMNOS
                                <Form.Control
                                    type="text"
                                    value={response?.[i] || ""}
                                    readOnly
                                    onChange={(e) => {
                                        saveResponseUpdate(i, e.target.value);
                                    }}
                                    style={{ display: "inline-block", width: "auto", margin: "0 5px" }}
                                    onDrop={(e) => {
                                        if (isTeacher) return; // No permitir arrastrar y soltar en modo profesor
                                        e.preventDefault();
                                        const text = e.dataTransfer.getData('text/plain');
                                        saveResponseUpdate(i, text);
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                />
                            ) : (
                                <Form.Control
                                    type="text"
                                    value={responseParent?.[i] || ""}
                                    readOnly
                                />
                            )
                        )}
                        </span>
                    ))}
                    {!isTeacher && question.options ? (
                        question.options.map((option, i) => (
                            <div key={i}
                                draggable
                                onDragStart={(e) => onDragStart(e, option)}
                            >
                                <Form.Control
                                    type="text"
                                    value={option}
                                    disabled
                                />
                            </div>
                        ))
                    ) : (
                        <>
                            <Form.Control
                                type="text"
                                placeholder="Corrección"
                                value={comment || ""}
                                onChange={(e) => saveCorrectionUpdate(e.target.value)}
                                style={{
                                    display: "inline-block",
                                    width: "auto",
                                    margin: "0 5px",
                                    marginTop: "5px",
                                    backgroundColor: "#fff3cd" // color suave para correcciones
                                }}
                            />
                           <input
                                type="text"
                                inputMode="decimal"
                                value={score}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder={"Puntuación"}
                            />
                        </>
                        
                    )}
                </Card.Body>
            <Card.Footer>
                <p>Puntuación máxima: {question.maxPoints}</p>
            </Card.Footer>
            </Card>

        </>
    );
};

export default DragAndDropRender;