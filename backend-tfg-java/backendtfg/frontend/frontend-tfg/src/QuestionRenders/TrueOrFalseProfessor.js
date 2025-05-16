import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const TrueOrFalse = ({question, index, responseParent = [], responsesObject = {}, onCorrectionUpdate}) => {

    const [calculatedScore, setCalculatedScore] = useState(() => {
        const correction = responsesObject.corrections?.[index];
        if (correction && correction.calification !== undefined) {
            return correction.calification;
        }
        return responseParent === question.correctAnswers ? question.maxPoints : 0;
    });
    const [correctionsParent, setCorrectionsParent] = useState(responsesObject.corrections);

    useEffect(() => {
        if (responseParent === question.correctAnswers) {
            setCalculatedScore(question.maxPoints);
        }
    }, [])

    function saveScoreUpdate(value) {
        const newCorrections = [...correctionsParent];
        newCorrections[index] = {
            ...newCorrections[index],
            calification: Number(value),
            corrections: newCorrections[index]?.corrections || []
        };
        setCorrectionsParent(newCorrections);
        setCalculatedScore(Number(value));
        onCorrectionUpdate(index, newCorrections[index]);
    }

    
    return (
        <Card key={index}>
            <Card.Title>Verdadero o falso</Card.Title>
            <Card.Body>
                <p>{question.question}</p>
                <Form.Group className="mb-3">
                    <Form.Select
                        value={responseParent || ""}
                    >
                    </Form.Select>
                </Form.Group>
                    <>
                        <Form.Control
                            type="text"
                            placeholder="Corrección"
                            value={"Respuesta correcta: " + question.correctAnswers}
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
                            value={calculatedScore}
                            onChange={(e) => saveScoreUpdate(e.target.value)}
                            style={{
                                display: "inline-block",
                                width: "auto",
                                margin: "0 5px",
                                marginTop: "5px",
                            }}
                        />
                    </>
            </Card.Body>
            <Card.Footer>
                <p>Puntuación máxima: {question.maxPoints}</p>
            </Card.Footer>
        </Card>
    );
};

export default TrueOrFalse;