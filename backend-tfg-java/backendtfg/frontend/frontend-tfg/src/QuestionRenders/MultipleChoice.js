import React, { useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { useState } from 'react';

const MultipleChoice = ({question, index, responseParent = [], correctionsParent = [], onResponseUpdate, onCorrectionUpdate, isTeacher = false}) => {
    
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
            <Card.Title>Opción múltiple</Card.Title>
            <Card.Body>  
                <p>{question.question}</p>
                <Form.Select
                    aria-label="Selecciona la respuesta"
                    value={responseParent ||""}
                    onChange={(e) => onResponseUpdate(index, e.target.value)}
                    multiple={false}
                >
                    <option disabled value="">Respuesta</option>
                    {question.options.map((answer, idx) => (
                        <option key={idx} value={answer}>{answer}</option>
                    ))}
                </Form.Select>
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

export default MultipleChoice;