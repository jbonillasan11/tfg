import React from 'react';
import { Card, Form } from 'react-bootstrap';

const MultipleChoice = ({question, index, responseParent = [], onResponseUpdate}) => {

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
            </Card.Body>
            <Card.Footer>
                <p>Puntuación máxima: {question.maxPoints}</p>
            </Card.Footer>    
        </Card>
    );
};

export default MultipleChoice;