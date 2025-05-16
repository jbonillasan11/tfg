import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { useState } from 'react';

const DragAndDrop = ({question, index, responseParent = [], responsesObject = {}, onCorrectionUpdate}) => {

    const [correctionsParent] = useState(responsesObject.corrections);
    const initialCorrection = responsesObject?.corrections?.[index] || {
        calification: 0,
        corrections: question.question.split("_").map(() => "")
    };
    const [corrections, setCorrections] = useState(initialCorrection.corrections);
    const [score, setScore] = useState(initialCorrection.calification);


    function saveCorrectionUpdate(i, value) {
        const copy = [...corrections];
        copy[i] = value;
        setCorrections(copy);
        onCorrectionUpdate(index, {
            calification: score,
            corrections: copy
        });
    }

    function saveScoreUpdate(value) {
        setScore(value);
        onCorrectionUpdate(index, {
            calification: value,
            corrections: corrections
        });
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
                                        value={responseParent?.[i] || ""}
                                    />
                                    )}
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
                            </span>
                            
                        ))}

                            <Form.Control
                                type="double"
                                placeholder="score"
                                value={score}
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

export default DragAndDrop;