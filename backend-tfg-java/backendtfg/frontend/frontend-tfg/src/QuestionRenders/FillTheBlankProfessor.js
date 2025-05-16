import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const FillTheBlank = ({question, index, responseParent = [], responsesObject = {},  onCorrectionUpdate}) => {

    const [correctionsParent, setCorrectionsParent] = useState(responsesObject.corrections);

    //Corrections tiene una estructura de lista de comentarios + puntuación
    function saveCorrectionUpdate(value) {
        setCorrectionsParent(value);
    }

    function saveScoreUpdate(value) {
        const newCorrections = [...correctionsParent];
        newCorrections[index] = {
            ...newCorrections[index],
            calification: Number(value),
            corrections: newCorrections[index]?.corrections || []
        };
        setCorrectionsParent(newCorrections);
        onCorrectionUpdate(index, newCorrections[index]);
    }
    
    const segmentos = question.question.split("_");

    return (
        <Card key={index}>
            <Card.Title>Rellenar los huecos</Card.Title>
            <Card.Body>  
                {segmentos.map((segmento, i) => (
                    <span key={i}>
                        {segmento}
                        {i < segmentos.length - 1 && (
                        <Form.Control
                            type="text"
                            value={responseParent?.[i] || ""}
                        />
                        )}
                    </span>
                ))}
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
                            value={correctionsParent?.[index]?.calification || 0}
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

export default FillTheBlank;