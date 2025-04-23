import React, { useState } from 'react';

const ChangePasswordModal = ({ isOpen, onClose, onSubmit }) => {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const newPasswordHandler = ()=> {
        console.log(newPassword, " ", confirmNewPassword);

        if (newPassword !== confirmNewPassword){
            alert("Las contraseñas no coinciden");
        }
        onSubmit( {
            oldPasswordInput: currentPassword,
            newPasswordInput: newPassword
          });
        onClose();
    }

    if (!isOpen) return null;

    return (
        <>
          <div
            className="modal-backdrop"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1040
            }}
          />
      
          <div
            className="modal show"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 1050
            }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
            <div
                className="modal-content"
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                    padding: "1rem"
                }}
            >
                <div
                    className="modal-header"
                    style={{ display: "flex", alignItems: "center" }}
                    >
                    <h5 className="modal-title">Cambiar contraseña</h5>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                        border: "none",
                        background: "transparent",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        marginLeft: "auto",
                        marginRight: "0.5rem"
                        }}
                    >
                        ×
                    </button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>Contraseña actual</label>
                    <input
                      type="password"
                      className="form-control"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Nueva contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Confirmar nueva contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button onClick={newPasswordHandler} className="btn btn-primary">
                    Confirmar
                  </button>
                  <button onClick={onClose} className="btn btn-secondary">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
      
}

export default ChangePasswordModal;

