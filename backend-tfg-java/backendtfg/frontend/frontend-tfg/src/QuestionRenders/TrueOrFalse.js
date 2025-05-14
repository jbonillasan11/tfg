import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const TrueOrFalse = ({question, index, responseParent = [], correctionsParent = [], onResponseUpdate, onCorrectionUpdate, isTeacher = false}) => {

    const [calculatedScore, setCalculatedScore] = useState(0);

    useEffect(() => {
            if (responseParent === question.correctAnswer) {
                setCalculatedScore(question.maxPoints);
            }
        }, [])

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
            <Card.Title>Verdadero o falso</Card.Title>
            <Card.Body>
                <p>{question.question}</p>
                <Form.Group className="mb-3">
                    <Form.Select
                        aria-label="Selecciona la respuesta"
                        value={responseParent || ""}
                        onChange={(e) => onResponseUpdate(index, e.target.value)}
                    >
                        <option disabled value="">Respuesta</option>
                        <option value="true">Verdadero</option>
                        <option value="false">Falso</option>
                    </Form.Select>
                </Form.Group>
                <Form.Control
                    type="double"
                    placeholder="score"
                    value={calculatedScore}
                    onChange={(e) => saveScoreUpdate(e.target.value)}
                    style={{
                        display: "inline-block",
                        width: "auto",
                        margin: "0 5px",
                        marginTop: "5px",
                    }}
                />
            </Card.Body>
            <Card.Footer>
                <p>Puntuación máxima: {question.maxPoints}</p>
            </Card.Footer>
        </Card>
    );
};

export default TrueOrFalse;