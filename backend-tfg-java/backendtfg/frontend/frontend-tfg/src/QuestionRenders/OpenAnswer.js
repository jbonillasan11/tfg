import React from 'react';
import { Card, Form } from 'react-bootstrap';

const OpenAnswer = ({question, index, responseParent = [], correctionsParent = [], onResponseUpdate, onCorrectionUpdate, isTeacher = false}) => {
    
    function saveCorrectionUpdate(value) {
        correctionsParent.corrections = value;
    }

    function saveScoreUpdate(value) {
        const copy = [...correctionsParent.corrections];
        const toReturn = {
            calification: value,
            corrections: copy
        }
        onCorrectionUpdate(index, toReturn);
    }

    return (
        <Card key={index}>
            <Card.Title>Respuesta abierta</Card.Title>
            <Card.Body>
                <p>{question.question}</p>
                <Form.Control
                    as="textarea"
                    value={responseParent || ""}
                    onChange={(e) => onResponseUpdate(index, e.target.value)}
                    rows={5} 
                />
                {isTeacher && (
                    <>
                        <Form.Control
                            type="text"
                            placeholder="Corrección"
                            value={correctionsParent.corrections || ""}
                            onChange={(e) => saveCorrectionUpdate(e.target.value)}
                            style={{
                                display: "inline-block",
                                width: "auto",
                                margin: "0 5px",
                                marginTop: "5px",
                                backgroundColor: "#fff3cd"
                            }}
                        />
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
                    </>
                )}
            </Card.Body>
            <Card.Footer>
                <p>Puntuación máxima: {question.maxPoints}</p>   
            </Card.Footer>
        </Card>
    );
};

export default OpenAnswer;