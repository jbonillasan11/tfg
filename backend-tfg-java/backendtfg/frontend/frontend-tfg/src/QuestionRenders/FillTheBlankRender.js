import React, { useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { useState} from 'react';

const FillTheBlankRender = ({question, index, responseParent = [], onResponseUpdate, responsesObject = {}, onCorrectionUpdate, isTeacher = false, isReview = false}) => {

    const [response, setResponse] = useState(responseParent); //Array de respuestas de la pregunta

    const [comment, setComment] = useState(responsesObject.corrections[index].comment || "");
    const [score, setScore] = useState(responsesObject.corrections[index].calification || 0);


    function saveCorrectionUpdate(value) {
        setComment(value);
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
            onCorrectionUpdate(index, {
                calification: 0,
                comment: comment
            });
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
            comment: comment
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
                        {i < segmentos.length - 1 && (!isTeacher && !isReview ? ( //RENDERIZADO ESTUDIANTE RESOLVIENDO
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

                {/* RENDERIZADOS CONDICIONALES */}
                {isReview ? ( //RENDERIZADO ESTUDIANTE REVISANDO
                    <>
                        <Form.Control
                            type="text"
                            placeholder="Corrección"
                            value={comment}
                            redOnly
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
                            readOnly
                            placeholder={"Puntuación"}
                        />
                    </>
                ) : (
                    <>
                        {isTeacher && ( //RENDERIZADO DOCENTE CORRIGIENDO
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