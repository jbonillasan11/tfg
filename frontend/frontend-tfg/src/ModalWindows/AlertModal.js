import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

const AlertModal = ({message, redirectTo = null, onHide, showModal = false, error = false}) => {

    const navigate = useNavigate();

    function continueHandler() {
        if (redirectTo) {
            navigate(redirectTo);
        }
        onHide();
        showModal = false;
    }

    if (!showModal) return null;

    return (
        <Modal show={showModal} onHide={onHide} centered>
        <Modal.Header closeButton>
            {error ? (
                <h4 style={{ color: "#8B0000", margin: 0, width: "100%", textAlign: "center", fontWeight: "bold" }}>Error!</h4>
            ) : (
                <h4 style={{ color: "green", margin: 0, width: "100%", textAlign: "center" }}>Éxito!</h4>
            )}
        </Modal.Header>

        <Modal.Body style={{ textAlign: "center" }}>
            {error ? (
                <h4 style={{ color: "red" }}>{message}</h4>
            ) : (
                <h4>{message}</h4>
            )}
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "center" }}>
            <button className="main-button" onClick={continueHandler}>Continuar</button>
        </Modal.Footer>
        </Modal>
    );
}

export default AlertModal;