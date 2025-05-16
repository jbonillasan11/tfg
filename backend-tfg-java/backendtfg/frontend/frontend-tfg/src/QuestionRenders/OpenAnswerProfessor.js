import React, { useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { useState } from 'react';

const OpenAnswer = ({question, index, responseParent = [], responsesObject = {}, onResponseUpdate, onCorrectionUpdate, isTeacher = false}) => {
    
    const [calculatedScore, setCalculatedScore] = useState(() => {
        const correction = responsesObject.corrections?.[index];
        if (correction && correction.calification !== undefined) {
            return correction.calification;
        }
        return responseParent === question.correctAnswer ? question.maxPoints : 0;
    });
    const [correctionsParent, setCorrectionsParent] = useState(responsesObject.corrections);


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

    function responseUpdateHandler(index, value) {
        if (isTeacher) return;
        onResponseUpdate(index, value)
    }

    function saveCorrectionUpdate(value) {
        const newCorrection = {
            calification: calculatedScore,
            corrections: [value]
        };
        onCorrectionUpdate(index, newCorrection);
    }


    return (
        <Card key={index}>
            <Card.Title>Respuesta abierta</Card.Title>
            <Card.Body>
                <p>{question.question}</p>
                <Form.Control
                    as="textarea"
                    value={responseParent || ""}
                    rows={5} 
                />
                <>
                    <Form.Control
                        type="text"
                        placeholder="Corrección"
                        value={""}
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

export default OpenAnswer;