import { Card, Form } from 'react-bootstrap';
import { useState } from 'react';

const OpenAnswerRender = ({question, index, responseParent = [], responsesObject = {}, onResponseUpdate, onCorrectionUpdate, isTeacher = false, isReview = false}) => {

    const [calculatedScore, setCalculatedScore] = useState(responsesObject?.corrections?.[index]?.calification || "0");
    const [comment, setComment] = useState(responsesObject?.corrections?.[index]?.comment || "");

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
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "1rem",
                    marginLeft: "1rem",
                    marginRight: "1rem"
                    
                }}
            >
                <div>
                    <Card.Title style={{ marginBottom: "0.5rem" }}>Pregunta {index + 1}</Card.Title>
                    <Card.Title>Responde a la pregunta!</Card.Title>
                </div>
                {question.mediaURL && (
                    <div style={{ width: "100%", maxWidth: "150px", marginLeft: "auto" }}>
                        <img
                        src={question.mediaURL}
                        alt={`Decoración pregunta ${index}`}
                        style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "12px",
                            objectFit: "cover",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                        }}
                        />
                    </div>
                )}
            </div>
            <Card.Body style={{marginLeft: "1rem"}}> 
                <div key={index} className="card-body d-flex align-items-start">
                        <div
                        style={{
                            width: "80%",
                            padding: "0 1rem"
                        }}
                        >
                            <p style={{
                                fontSize: "1.1rem",
                                marginBottom: "0.75rem",
                                color: "#333"
                            }}>
                                {question.question}
                            </p>
                {/* RENDERIZADOS CONDICIONALES */}

                {isReview ? ( //RENDERIZADO ESTUDIANTE REVISANDO
                    <>
                        <Form.Control
                            as="textarea"
                            value={responseParent || ""}
                            rows={5} 
                        />
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "1rem",
                            marginTop: "1rem"
                        }}>
                            <Form.Control
                                type="text"
                                placeholder="Corrección"
                                value={comment || ""}
                                readOnly
                                style={{
                                    display: "inline-block",
                                    width: "80%",
                                    backgroundColor: "#fff3cd",
                                }}
                            />
                            Puntuación:
                            <input
                                type="text"
                                inputMode="decimal"
                                value={calculatedScore}
                                readOnly
                                textAlign="right"
                                style={{
                                    width: "7%",
                                    padding: "6px 10px",
                                    fontSize: "1rem",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                            />
                        </div>
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
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "1rem",
                                    marginTop: "1rem"
                                }}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Corrección"
                                        value={comment || ""}
                                        onChange={(e) => saveCorrectionUpdate(e.target.value)}
                                        style={{
                                            display: "inline-block",
                                            width: "80%",
                                            backgroundColor: "#fff3cd",
                                        }}
                                    />
                                    Puntuación:
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={calculatedScore}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        textAlign="right"
                                        style={{
                                            width: "7%",
                                            padding: "6px 10px",
                                            fontSize: "1rem",
                                            borderRadius: "8px",
                                            border: "1px solid #ccc",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </>
                )}
                </div>
            </div>
            </Card.Body>
            <Card.Footer style={{ 
                backgroundColor: "#f8f9fa",
                fontSize: "1rem",
                color: "#555",
                fontWeight: "500"
            }}>
                <p style={{ margin: 0 }}>
                    Puntuación máxima: {question.maxPoints}
                </p>
            </Card.Footer>
        </Card>
    );
};

export default OpenAnswerRender;