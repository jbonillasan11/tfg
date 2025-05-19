import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const OpenAnswerRender = ({question, index, responseParent = [], responsesObject = {}, onResponseUpdate, onCorrectionUpdate, isTeacher = false, isReview = false}) => {

    const [calculatedScore, setCalculatedScore] = useState(responsesObject.corrections[index].calification || 0);
    const [comment, setComment] = useState(responsesObject.corrections[index].comment || "");

    function saveCorrectionUpdate(value) {
        setComment(value);
        const newCorrection = {
            calification: calculatedScore,
            comment: value
        };
        onCorrectionUpdate(index, newCorrection);
    }

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
            onCorrectionUpdate(index, {
                calification: 0,
                comment: comment
            });
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
            comment: comment
        });
    };

    return (
        <Card key={index}>
            <Card.Title>Respuesta abierta</Card.Title>
            <Card.Body>
                <p>{question.question}</p>

                {/* RENDERIZADOS CONDICIONALES */}

                {isReview ? ( //RENDERIZADO ESTUDIANTE REVISANDO
                    <>
                        <Form.Control
                            as="textarea"
                            value={responseParent || ""}
                            rows={5} 
                        />
                        <Form.Control
                            type="text"
                            placeholder="Corrección"
                            value={comment || ""}
                            readOnly
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
                            readOnly
                            placeholder={"Puntuación"}
                        />
                    </>
                ) : ( 
                    <>
                        {!isTeacher ? ( //RENDERIZADO ESTUDIANTE RESOLVIENDO
                            <Form.Control
                                as="textarea"
                                value={responseParent || ""}
                                onChange={(e) => onResponseUpdate(index, e.target.value)}
                                rows={5} 
                            />
                        ) : ( //RENDERIZADO DOCENTE CORRIGIENDO
                            <>
                                <Form.Control
                                    as="textarea"
                                    value={responseParent || ""}
                                    rows={5} 
                                />
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
                    </>
                )}

                
            </Card.Body>
            <Card.Footer>
                <p>Puntuación máxima: {question.maxPoints}</p>   
            </Card.Footer>
        </Card>
    );
};

export default OpenAnswerRender;