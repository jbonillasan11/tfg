import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ConfirmDeletionWindow = ({ showModal, onHide, onConfirm, message, redirectTo = null }) => {

    const navigate = useNavigate();

    function handleConfirm() {
        onConfirm();
        if (redirectTo) {
            navigate(redirectTo);
        }
        onHide();
    }

    if (!showModal) return null;

    return (
    <Modal show={showModal} onHide={onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title className="w-100 text-center">Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
            <h4>{message}</h4>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
            <button className="secondary-button" onClick={onHide}>Cancelar</button>
            <button className="main-button" onClick={handleConfirm}>Confirmar</button>
        </Modal.Footer>
    </Modal>
    );
};

export default ConfirmDeletionWindow;