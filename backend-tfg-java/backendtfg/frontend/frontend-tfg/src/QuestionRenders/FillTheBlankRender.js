import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { useState} from 'react';

const FillTheBlankRender = ({question, index, responseParent = [], onResponseUpdate, responsesObject = {}, onCorrectionUpdate, isTeacher}) => {

    const [response, setResponse] = useState(responseParent); //Array de respuestas de la pregunta
    
    const [corrections, setCorrections] = useState(responsesObject.corrections || {});

    const [comment, setComment] = useState(corrections.comment || "");
    const [score, setScore] = useState(corrections.calification || 0);
    const [inputValue, setInputValue] = useState(responsesObject.corrections.calification || 0);

    function saveCorrectionUpdate(value) {
        setComment(value);
        setCorrections(value);
        onCorrectionUpdate(index, {
            calification: score,
            comment: value
        });
    } 

    function saveResponseUpdate(i, value) {
        const copy = [...response];
        copy[i] = value;
        setResponse(copy);
        onResponseUpdate(index, copy);
    }

    /*function saveScoreUpdate(value) {
        setInputValue(value);
        value = value.replace(',', '.');
        let score = parseFloat(value);
        score = Math.min(Math.max(0, score), question.maxPoints);
        setScore(score);
        onCorrectionUpdate(index, {
            calification: score,
            corrections: corrections
        });
    }*/

    const handleChange = (e) => {
        const input = e.target.value.replace(",", ".");
        if (/^-?\d*\.?\d*$/.test(input)) {
            setScore(input);
        }
    };

    const handleBlur = () => {
        if (score === "") return;
        let sanitized = score.replace(",", ".");
        let num = parseFloat(sanitized);
        if (isNaN(num)) {
            setScore(0);
            return;
        }
        if (num < 0) {
            num = 0;
        } else if (num > question.maxPoints) {
            num = question.maxPoints;
        }
        setScore(num.toString());
        onCorrectionUpdate(index, {
            calification: num,
            corrections: corrections
        });
    };

    const segmentos = question.question.split("_");

    return (
        <Card key={index}>
            <Card.Title>Rellenar los huecos</Card.Title>
            <Card.Body>  
                {segmentos.map((segmento, i) => (
                    <span key={i}>
                        {segmento}
                        {i < segmentos.length - 1 && (!isTeacher ? (
                        <Form.Control
                            type="text"
                            value={response?.[i] || ""}
                            onChange={(e) => saveResponseUpdate(i, e.target.value)}
                            style={{ display: "inline-block", width: "auto", margin: "0 5px" }}
                        />
                        ) : (
                            <Form.Control
                                type="text"
                                value={responseParent?.[i] || ""}
                                readOnly
                            />
                        )
                        )}
                    </span>
                ))}
                {isTeacher && (
                    <>
                        <Form.Control
                            type="text"
                            placeholder="Corrección"
                            value={comment || ""}
                            onChange={(e) => saveCorrectionUpdate(e.target.value)}
                            style={{
                                display: "inline-block",
                                width: "auto",
                                margin: "0 5px",
                                marginTop: "5px",
                                backgroundColor: "#fff3cd" // color suave para correcciones
                            }}
                        />
                        <input
                            type="text"
                            inputMode="decimal"
                            value={score}
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

export default FillTheBlankRender;