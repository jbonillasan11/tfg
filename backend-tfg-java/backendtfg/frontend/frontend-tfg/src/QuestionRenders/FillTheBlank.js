import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { useState} from 'react';

const FillTheBlank = ({question, index, responseParent = [], onResponseUpdate}) => {

    const [response, setResponse] = useState(responseParent); //Array de respuestas de la pregunta

    function saveResponseUpdate(i, value) {
        const copy = [...response];
        copy[i] = value;
        setResponse(copy);
        onResponseUpdate(index, copy);
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
                            value={response?.[i] || ""}
                            onChange={(e) => saveResponseUpdate(i, e.target.value)}
                            style={{ display: "inline-block", width: "auto", margin: "0 5px" }}
                        />
                        )}
                    </span>
                ))}
            </Card.Body>
            <Card.Footer>
                <p>Puntuación máxima: {question.maxPoints}</p>
            </Card.Footer>
        </Card>
    );
};

export default FillTheBlank;