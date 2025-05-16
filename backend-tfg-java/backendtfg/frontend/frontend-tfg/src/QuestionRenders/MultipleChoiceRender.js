import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const MultipleChoiceRender = ({question, index, responseParent = [], responsesObject = {}, onResponseUpdate, onCorrectionUpdate, isTeacher = false}) => {

    const [calculatedScore, setCalculatedScore] = useState(responsesObject.corrections?.[index]?.calification || 0);
    const [inputValue, setInputValue] = useState(responsesObject.corrections.calification || 0);

    function saveScoreUpdate(value) {
        setInputValue(value);
        let score;
        if (typeof value === "string") {
            const cleaned = value.replace(',', '.');
            score = parseFloat(cleaned);
        } else if (typeof value === "number") {
            score = value;
        } else {
            score = NaN;
        }
        score = Math.min(Math.max(0, score), question.maxPoints);
        setCalculatedScore(score);
        onCorrectionUpdate(index, {
            calification: score,
            corrections: ""
        });
    }

    useEffect(() => {
        if (responseParent[0] === question.correctAnswers[0]) {
            saveScoreUpdate(question.maxPoints);
        }
    }, [])

    const handleChange = (e) => {
        const input = e.target.value.replace(",", ".");
        if (/^-?\d*\.?\d*$/.test(input)) {
            setCalculatedScore(input);
        }
    };

    const handleBlur = () => {
        if (calculatedScore === "") return;
        let sanitized = calculatedScore.replace(",", ".");
        let num = parseFloat(sanitized);
        if (isNaN(num)) {
            setCalculatedScore(0);
            return;
        }
        if (num < 0) {
            num = 0;
        } else if (num > question.maxPoints) {
            num = question.maxPoints;
        }
        setCalculatedScore(num.toString());
        onCorrectionUpdate(index, {
            calification: num,
            corrections: ""
        });
    };

    return (
        <Card key={index}>
            <Card.Title>Opción múltiple</Card.Title>
            <Card.Body>  
                <p>{question.question}</p>
                {!isTeacher ? (
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
                ) : (
                    <>
                        <Form.Select value={responseParent} disabled>
                            <option value={responseParent}>{responseParent}</option>
                        </Form.Select>
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
                        <input
                            type="text"
                            inputMode="decimal"
                            value={calculatedScore}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder={"Puntuación"}
                        />
                    </>
                )}
            </Card.Body>
            <Card.Footer>
                <p>Puntuación máxima: {question.maxPoints}</p>
            </Card.Footer>    
        </Card>
    );
};

export default MultipleChoiceRender;