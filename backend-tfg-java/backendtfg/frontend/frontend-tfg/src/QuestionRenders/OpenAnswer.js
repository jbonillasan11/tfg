import React from 'react';
import { Card, Form } from 'react-bootstrap';

const OpenAnswer = ({question, index, responseParent = [], onResponseUpdate}) => {

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
            </Card.Body>
            <Card.Footer>
                <p>Puntuación máxima: {question.maxPoints}</p>   
            </Card.Footer>
        </Card>
    );
};

export default OpenAnswer;