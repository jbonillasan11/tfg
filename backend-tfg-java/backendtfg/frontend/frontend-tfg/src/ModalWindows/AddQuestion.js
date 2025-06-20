import { useState, useEffect } from 'react';
import { Modal, Form, ListGroup } from 'react-bootstrap';
import AlertModal from '../ModalWindows/AlertModal';

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
    const [fileName, setFileName] = useState(null);
    
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

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
        setFileName(null);
        setAlertMessage("");
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
                    correctAnswers: [correctAnswer],
                    options: multipleAnswers,
                    media: file,
                    maxPoints: maxScore
                }
            );
        }
    }

    function handleFileChange(e){
        const changeToFile = e.target.files[0];
        const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

        if (changeToFile.size > 20 * 1024 * 1024){ //20MB
            setShowAlert(true);
            setAlertMessage("El archivo es demasiado grande");
            return;
        }

        if (allowedTypes.includes(changeToFile.type)){
            setFile(changeToFile);
            setFileName(changeToFile.name);
        } else {
            setShowAlert(true);
            setAlertMessage("El archivo debe ser formato imagen o GIF");
            return;
        }    
    }


    async function handleCloseSave(){
        console.log(file);
        saveNewQuestion();
        handleClose();
    }

    function handleClose(){
        setModalShow(false);
        resetFields();
    }

    return (
        <>
            <button className="main-button" onClick={() => setModalShow(true)}>Añadir pregunta</button>
            <Modal
                size="lg"
                show={modalShow}
                onHide={() => {setModalShow(false); resetFields()} }
                aria-labelledby="example-modal-sizes-title-lg"
                style={{alignContent: "center"}}
            >
                <AlertModal
                    showModal={showAlert}
                    onHide={() => setShowAlert(false)}
                    message={alertMessage}
                    error={true}
                />
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    Añadir pregunta
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <h5 style={{marginBottom:"0.75rem"}}>Selecciona el tipo de pregunta</h5>   
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
                    <h5 style={{marginTop:"1rem", marginBottom:"1rem"}}>Enunciado</h5> 
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
                                <h5 style={{marginTop:"1rem", marginBottom:"1rem"}}>Respuesta correcta</h5>
                                <Form.Select
                                    aria-label="Selecciona la respuesta correcta"
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
                                    <h5>Introduce las respuestas</h5>
                                    <p style={{ fontStyle: "italic", color: "#6c757d" }}>Escribe una respuesta y pulsa Intro para añadirla</p>
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
                                    <h5 style={{marginBottom:"1rem"}}>Selecciona la respuesta correcta</h5>
                                    <Form.Select
                                        aria-label="Selecciona la respuesta"
                                        value={correctAnswer}
                                        onChange={(e) => setCorrectAnswer(e.target.value)}
                                    >
                                    <option disabled value="">Respuestas</option>
                                    {multipleAnswers.map((answer, index) => (
                                        <option key={index} value={answer}>{answer}</option>
                                    ))}
                                    </Form.Select>
                                </Form.Group>
                            </>
                        )}

                        {questionType === "FILL_THE_BLANK" && (
                            <p style={{ fontStyle: "italic", color: "#6c757d" }}>Coloca el símbolo "_" en el hueco a rellenar por el alumno. Puedes dejar varios huecos en blanco.</p>
                        )}

                        {questionType === "DRAG" && (
                            <>
                                <p style={{ fontStyle: "italic", color: "#6c757d" }}>Coloca el símbolo "_" en el hueco a rellenar por el alumno. Puedes dejar varios huecos en blanco.</p>
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
                <label className="main-button" style={{ marginTop: "1rem", display: "inline-block", cursor: "pointer" }}>
                    Subir archivo
                    <input
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </label>
                {fileName && (
                    <span style={{ fontStyle: "italic", fontSize: "0.95rem", color: "#6c757d" }}>{fileName}</span>
                )}
                <p style={{ fontStyle: "italic", color: "#6c757d", marginTop:"0.5rem", marginLeft:"0.25rem" }}>Formato imagen o GIF</p>
                <Form.Group className="mb-3">
                    <h5 style={{marginTop:"1rem", marginBottom:"1rem"}}>Puntuación de la pregunta</h5>
                    <Form.Control
                        type="double"
                        value={maxScore}
                        onChange={(e) => setMaxScore(e.target.value)}
                        style={{width:"20%"}}
                    />
                </Form.Group>
                {showSubmit && (
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                        <button className="main-button" onClick={() => handleCloseSave()}>
                            Añadir pregunta
                        </button>
                    </div>
                )}
            </Modal.Body>

            </Modal>
        </>
    );
};

export default AddQuestion;