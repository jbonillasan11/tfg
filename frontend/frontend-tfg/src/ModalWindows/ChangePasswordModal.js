import React, { useState } from 'react';
import passwordVerifier from '../utils/passwordVerifier';

const ChangePasswordModal = ({ isOpen, onClose, onSubmit }) => {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [validPassword, setValidPassword] = useState(true);
    const [equalPasswords, setEqualPasswords] = useState(true);

    const newPasswordHandler = ()=> {
      setValidPassword(true);
      setEqualPasswords(true);
      
      if (!passwordVerifier(newPassword)){
        setValidPassword(false);
        return;
      }

      if (newPassword !== confirmNewPassword){
          setEqualPasswords(false);
          return;
      }
      onSubmit( {
          oldPasswordInput: currentPassword,
          newPasswordInput: newPassword
        });
      onCloseHandler();
    }

    function onCloseHandler() {
        resetFields();
        onClose();
    }

    function resetFields() {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setValidPassword(true);
        setEqualPasswords(true);
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
                    <h4 className="modal-title">Cambiar contraseña</h4>
                    <button
                        type="button"
                        onClick={onCloseHandler}
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
                    <h5>Contraseña actual</h5>
                    <input
                      type="password"
                      className="form-control"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <h5>Nueva contraseña</h5>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <p style={{fontStyle:"italic", color:"#6c757d", marginTop:"0.5rem", fontSize:"0.9rem"}}>Debe contener al menos 8 caracteres, mayúscula, minúscula, un dígito y un carácter especial</p>
                    {!validPassword && (
                      <p style={{color:"red", fontSize:"0.9rem", marginTop:"0.25rem"}}>La contraseña no es válida</p>
                    )}
                    {!equalPasswords && (
                      <p style={{color:"red", fontSize:"0.9rem", marginTop:"0.25rem"}}>Las contraseñas no coinciden</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <h5>Confirmar nueva contraseña</h5>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    {!equalPasswords && (
                      <p style={{color:"red", fontSize:"0.9rem", marginTop:"0.25rem"}}>Las contraseñas no coinciden</p>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="main-button" onClick={newPasswordHandler}>
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
      
}

export default ChangePasswordModal;

