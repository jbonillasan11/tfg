import { Card, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const TrueOrFalseRender = ({question, index, responseParent = [], responsesObject = {}, onResponseUpdate, onCorrectionUpdate, isTeacher = false, isReview = false}) => {
    
    const [calculatedScore, setCalculatedScore] = useState(responsesObject.corrections[index].calification || 0);

    useEffect(() => {
        if (responseParent[0] === question.correctAnswers[0]) {
            setCalculatedScore(String(question.maxPoints));
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
            onCorrectionUpdate(index, {
                calification: 0,
                comment: ""
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
            comment: ""
        });
    };

    return (
        <Card key={index}>
            <Card.Title>Verdadero o falso</Card.Title>
            <Card.Body>
                <p>{question.question}</p>

                {/* RENDERIZADOS CONDICIONALES */}

                {isReview ? (
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
                            readOnly
                            placeholder={"Puntuación"}
                        />
                    </>
                ) : (
                    <>
                        {!isTeacher ? (
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
                    </>
                )}

            </Card.Body>
            <Card.Footer>
                <p>Puntuación máxima: {question.maxPoints}</p>
            </Card.Footer>
        </Card>
    );
};

export default TrueOrFalseRender;