import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { useState } from 'react';

const DragAndDrop = ({question, index, responseParent = [], onResponseUpdate}) => {

    const [response, setResponse] = useState(responseParent); //Array de respuestas de la pregunta

    function saveResponseUpdate(i, value) {
        const copy = [...response];
        copy[i] = value;
        setResponse(copy);
        onResponseUpdate(index, copy);
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
                                    value={response?.[i] || ""}
                                    readOnly
                                    onChange={(e) => {
                                        saveResponseUpdate(i, e.target.value);
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
                            </span>
                        ))}
                        
                        {question.options && question.options.map((option, i) => (
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
                        </Card.Body>
                <Card.Footer>
                    <p>Puntuación máxima: {question.maxPoints}</p>
                </Card.Footer>
                </Card>
            );
};

export default DragAndDrop;