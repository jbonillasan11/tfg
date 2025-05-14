import React from 'react';
import { Card, Form } from 'react-bootstrap';

const FillTheBlank = ({question, index, responsesParent = [], correctionsParent = [],  onResponseUpdate, onCorrectionUpdate, isTeacher = false}) => {

    function saveResponseUpdate(i, value) {
        if (isTeacher) return;
        const copy = [...responsesParent];
        copy[i] = value;
        onResponseUpdate(index, copy);
    }

    //Corrections tiene una estructura de lista de comentarios + puntuación
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
                            value={responsesParent?.[i] || ""}
                            onChange={(e) => saveResponseUpdate(i, e.target.value)}
                            style={{ display: "inline-block", width: "auto", margin: "0 5px" }}
                        />
                        )}
                        {isTeacher && (
                            <Form.Control
                                type="text"
                                placeholder="Corrección"
                                value={correctionsParent.corrections?.[i] || ""}
                                onChange={(e) => saveCorrectionUpdate(i, e.target.value)}
                                style={{
                                    display: "inline-block",
                                    width: "auto",
                                    margin: "0 5px",
                                    marginTop: "5px",
                                    backgroundColor: "#fff3cd"
                                }}
                            />
                        )}
                    </span>
                ))}
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
            </Card.Body>
            <Card.Footer>
                <p>Puntuación máxima: {question.maxPoints}</p>
            </Card.Footer>
        </Card>
    );
};

export default FillTheBlank;