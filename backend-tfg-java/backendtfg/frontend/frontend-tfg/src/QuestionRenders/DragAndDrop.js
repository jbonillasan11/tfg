import React from 'react';
import { Card, Form } from 'react-bootstrap';

const DragAndDrop = ({question, index, responsesParent = [], correctionsParent = [], onResponseUpdate, onCorrectionUpdate, isTeacher = false}) => {


    function saveResponseUpdate(i, value) {
        if (isTeacher) return;
        const copy = [...responsesParent];
        copy[i] = value;
        onResponseUpdate(index, copy);
    }

    function saveCorrectionUpdate(i, value) {
        if (!isTeacher) return;
        const copy = [...correctionsParent];
        copy[i] = value;
    }

    function saveScoreUpdate(value) {
        const copy = [...correctionsParent.corrections];
        const toReturn = {
            calification: value,
            corrections: copy
        }
        onCorrectionUpdate(index, toReturn);
    }

    const onDragStart = (e, text) => {
        e.dataTransfer.setData('text/plain', text);
    }
    
    const segmentos = question.question.split("_");
            return (
                <Card key={index}>
                    <Card.Title>Arrastrar y soltar</Card.Title>
                    <Card.Body>  
                        {segmentos.map((segmento, i) => (
                            <span key={i}>
                                {segmento}
                                {i < segmentos.length - 1 && (
                                <Form.Control
                                    type="text"
                                    value={responsesParent?.[i] || ""}
                                    readOnly
                                    onChange={(e) => {
                                        const current = [...(responsesParent[i] || [])];
                                        current[i] = e.target.value;
                                        saveResponseUpdate(index, current);
                                    }}
                                    style={{ display: "inline-block", width: "auto", margin: "0 5px" }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const text = e.dataTransfer.getData('text/plain');
                                        saveResponseUpdate(i, text);
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                    
                                />
                                )}
                                {isTeacher && (
                                    <Form.Control
                                        type="text"
                                        placeholder="Corrección"
                                        value={correctionsParent?.[i] || ""}
                                        onChange={(e) => saveCorrectionUpdate(i, e.target.value)}
                                        style={{
                                            display: "inline-block",
                                            width: "auto",
                                            margin: "0 5px",
                                            marginTop: "5px",
                                            backgroundColor: "#fff3cd" // color suave para correcciones
                                        }}
                                    />
                                )}
                            </span>
                            
                        ))}
                        
                        {!isTeacher && question.options && question.options.map((option, i) => (
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
                            
                        ))}
                        {isTeacher && (
                            <Form.Control
                                type="double"
                                placeholder="score"
                                value={correctionsParent.calification|| 0}
                                onChange={(e) => saveScoreUpdate(e.target.value)}
                                style={{
                                    display: "inline-block",
                                    width: "auto",
                                    margin: "0 5px",
                                    marginTop: "5px",
                                }}
                            />
                        )}
                        
                        </Card.Body>
                <Card.Footer>
                    <p>Puntuación máxima: {question.maxPoints}</p>
                </Card.Footer>
                </Card>
            );
};

export default DragAndDrop;