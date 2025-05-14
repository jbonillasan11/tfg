import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Modal, Form, ListGroup } from 'react-bootstrap';

function AddQuestion ({onSaveQuestion}) {

    const [modalShow, setModalShow] = useState(false);
    const [questionText, setQuestionText] = useState("");
    const [questionType, setQuestionType] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [answerText, setAnswerText] = useState("");
    const [multipleAnswers, setMultipleAnswers] = useState([]);
    const [maxScore, setMaxScore] = useState(0);

    const [showSubmit, setShowSubmit] = useState(false);

    const [file, setFile] = useState(null);

    useEffect(() => {
        if (maxScore > 0) {
            switch (questionType) {
                case "FILL_THE_BLANK":
                    if (questionText.includes("_")) {
                        setShowSubmit(true);
                    } break;
                case "MULTIPLE_CHOICE":
                    if (multipleAnswers.length > 1 && correctAnswer) {
                        setShowSubmit(true);
                    } break;
                case "TRUE_FALSE":
                    if (correctAnswer) {
                        setShowSubmit(true);
                    } break;
                case "OPEN_ANSWER":
                    if (questionText) {
                        setShowSubmit(true);
                    } break;
                case "DRAG":
                    if (questionText.includes("_") && multipleAnswers.length > 1) {
                        setShowSubmit(true);
                    } break;
                default:
                    setShowSubmit(false);
            }
        } else {
            setShowSubmit(false);
        }
    }, [questionType, questionText, multipleAnswers, correctAnswer, answerText, maxScore]);

    function resetFields(){
        setQuestionText("");
        setQuestionType("");
        setCorrectAnswer("");
        setAnswerText("");
        setMultipleAnswers([]);
        setMaxScore(0);
        setFile(null);
    }

    function removeAnswer(answer) {
        const newAnswers = multipleAnswers.filter((item) => item !== answer);
        setMultipleAnswers(newAnswers);
    }


    function saveNewQuestion() {
        if (onSaveQuestion) { // Devolveremos la pregunta ya construida
            onSaveQuestion(
                {
                    type: questionType,
                    question: questionText,
                    correctAnswer: correctAnswer,
                    options: multipleAnswers,
                    media: file,
                    maxPoints: maxScore
                }
            );
        }
    }

    function handleCloseSave(){
        saveNewQuestion();
        handleClose();
    }

    function handleClose(){
        setModalShow(false);
        resetFields();
    }

    return (
        <>
            <Button onClick={() => setModalShow(true)}>Añadir pregunta</Button>
            <Modal
                size="lg"
                show={modalShow}
                onHide={() => {setModalShow(false); resetFields()} }
                aria-labelledby="example-modal-sizes-title-lg"
            >

            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    Añadir pregunta
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Select
                    aria-label="Selecciona el tipo de pregunta"
                    value={questionType}
                    onChange={(e) => {setQuestionType(e.target.value); setShowSubmit(false);}}
                >
                    <option disabled value="">Selecciona el tipo de pregunta</option>
                    <option value="FILL_THE_BLANK">Rellenar los espacios en blanco</option>
                    <option value="MULTIPLE_CHOICE">Opción múltiple</option>
                    <option value="TRUE_FALSE">Verdadero/Falso</option>
                    <option value="OPEN_ANSWER">Respuesta abierta</option>
                    <option value="DRAG">Arrastrar</option>
                </Form.Select>
                <Form.Group className="mb-3">
                    <Form.Label>Pregunta</Form.Label>
                    <Form.Control
                    type="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    />
                </Form.Group>
                {questionType && (
                    <>
                        {questionType === "TRUE_FALSE" && (
                            <Form.Group className="mb-3">
                                <Form.Label>Respuesta correcta</Form.Label>
                                <Form.Select
                                    aria-label="Selecciona la respuesta"
                                    value={correctAnswer}
                                    onChange={(e) => setCorrectAnswer(e.target.value)}
                                >
                                    <option disabled value="">Respuesta</option>
                                    <option value="true">Verdadero</option>
                                    <option value="false">Falso</option>
                                </Form.Select>
                            </Form.Group>
                        )}

                        {questionType === "MULTIPLE_CHOICE" && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Introduce respuesta</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={answerText}
                                        onChange={(e) => setAnswerText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                            e.preventDefault();
                                            setMultipleAnswers([...multipleAnswers, answerText]);
                                            setAnswerText("");
                                            }
                                        }}
                                    />
                                </Form.Group>
                                <ListGroup>
                                {multipleAnswers.map((answer, index) => (
                                    <ListGroup.Item key={index} action onClick={() => removeAnswer(answer)}>
                                        {answer}
                                    </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                <Form.Group className="mb-3">
                                    <Form.Label>Respuesta correcta</Form.Label>
                                    <Form.Select
                                        aria-label="Selecciona la respuesta"
                                        value={correctAnswer}
                                        onChange={(e) => setCorrectAnswer(e.target.value)}
                                    >
                                    <option disabled value="">Respuesta</option>
                                    {multipleAnswers.map((answer, index) => (
                                        <option key={index} value={answer}>{answer}</option>
                                    ))}
                                    </Form.Select>
                                </Form.Group>
                            </>
                        )}

                        {questionType === "FILL_THE_BLANK" && (
                            <> Coloca el símbolo "_" en el hueco a rellenar por el alumno. Puedes dejar varios huecos en blanco </>
                        )}

                        {questionType === "DRAG" && (
                            <>
                                <> Coloca el símbolo "_" en el hueco a rellenar por el alumno. Puedes dejar varios huecos en blanco </>
                                <Form.Group className="mb-3">
                                    <Form.Label>Introduce respuesta</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={answerText}
                                        onChange={(e) => setAnswerText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                            e.preventDefault();
                                            setMultipleAnswers([...multipleAnswers, answerText]);
                                            setAnswerText("");
                                            }
                                        }}
                                    />
                                </Form.Group>
                                <ListGroup>
                                {multipleAnswers.map((answer, index) => (
                                    <ListGroup.Item key={index} action onClick={() => removeAnswer(answer)}>
                                        {answer}
                                    </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </>
                        )}
                    </>  
                )}
                <input type="file" onChange={setFile} />
                <Form.Group className="mb-3">
                    <Form.Label>Puntuación de la pregunta</Form.Label>
                    <Form.Control
                        type="double"
                        value={maxScore}
                        onChange={(e) => setMaxScore(e.target.value)}
                    />
                </Form.Group>
                {showSubmit && (
                    <Button onClick={() => handleCloseSave()} className="me-2">Añadir</Button>
                )}
            </Modal.Body>

            </Modal>
        </>
    );
};

export default AddQuestion;