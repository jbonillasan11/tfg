import { Card, Form } from 'react-bootstrap';
import { useState} from 'react';

const FillTheBlankRender = ({question, index, responseParent = [], onResponseUpdate, responsesObject = {}, onCorrectionUpdate, isTeacher = false, isReview = false}) => {

    const [response, setResponse] = useState(responseParent); //Array de respuestas de la pregunta

    const [comment, setComment] = useState(responsesObject?.corrections?.[index]?.comment || "");
    const [score, setScore] = useState(responsesObject?.corrections?.[index]?.calification || "0");


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
                    <Card.Title>Rellena los huecos en blanco!</Card.Title>
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
                    </p>
                    {/* RENDERIZADOS CONDICIONALES */}
                    {isReview ? ( //RENDERIZADO ESTUDIANTE REVISANDO
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
                                value={score}
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
                    ) : (
                        <>
                            {isTeacher && ( //RENDERIZADO DOCENTE CORRIGIENDO
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
                                        value={score}
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

export default FillTheBlankRender;