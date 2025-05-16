import React from 'react';
import { Card, Form } from 'react-bootstrap';

const TrueOrFalse = ({question, index, responseParent = [], onResponseUpdate}) => {
    
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
            </Card.Body>
            <Card.Footer>
                <p>Puntuación máxima: {question.maxPoints}</p>
            </Card.Footer>
        </Card>
    );
};

export default TrueOrFalse;