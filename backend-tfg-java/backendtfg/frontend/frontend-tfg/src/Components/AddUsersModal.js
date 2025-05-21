import React, { useEffect, useState } from 'react';
import fetchService from '../services/fetchService';
import { useLocalState } from '../utils/useLocalState';

const UserSearchModal = ({ isOpen, onClose, onSubmit, initialUsers }) => {

  const [authValue] = useLocalState("", "authValue");

  const [busquedaNombres, setBusquedaNombres] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserIds, setShowUserIds] = useState(initialUsers || []);
  const [showUsers, setShowUsers] = useState([]);

  function userSearch() {
    if (busquedaNombres.trim() === "") return; // Si el campo está vacío, ignoramos la búsqueda

    fetchService(`users/getUsersNameSearch?nameFragment=${encodeURIComponent(busquedaNombres)}`, "GET", authValue, null) // Buscamos los usuarios que contengan en su nombre el fragmento introducido
    .then(response => {
      setUsers(response);
    });
  }

  const toggleUserSelection = (userId) => { 
    setSelectedUsers((prevSelected) => { 
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId); 
      } else {
        const updated = [...prevSelected, userId];
        setShowUserIds(updated);
        return updated;
      }
    });
  };
        
  const handleSubmit = () => {
    onSubmit(selectedUsers);
    onClose();
  };

  useEffect(() => {
    fetchService("users/getUsers", "POST", authValue, showUserIds) // Obtenemos todos los usuarios de la base de datos
    .then(response => {
      setShowUsers(response);
    });
  }, [showUserIds]);

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
          zIndex: 1040,
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
          zIndex: 1050,
        }}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              borderRadius: "6px",
              padding: "1rem",
            }}
          >
            <div
              className="modal-header"
              style={{ display: "flex", alignItems: "center" }}
            >
              <h5 className="modal-title">Buscar y seleccionar usuarios</h5>
              <button
                type="button"
                onClick={onClose}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  marginLeft: "auto",
                  marginRight: "0.5rem",
                }}
              >
                ×
              </button>
            </div>   

            <div className="modal-body">
              <div className="mb-3">
                <label>Buscar por nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={busquedaNombres}
                  onChange={(e) => setBusquedaNombres(e.target.value)}
                />
                <button
                  onClick={userSearch}
                  className="btn btn-sm btn-outline-primary mt-2"
                >
                  Buscar
                </button>
              </div>

              <div className="d-flex justify-content-between">
                <div className="w-50 pe-2">
                  <h6>Usuarios encontrados</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => toggleUserSelection(user.id)}
                        className={`card p-2 cursor-pointer ${
                          selectedUsers.includes(user.id)
                            ? "border-primary"
                            : "border-secondary"
                        }`}
                        style={{ width: "200px", borderWidth: "2px" }}
                      >
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input me-2"
                            checked={selectedUsers.includes(user.id)}
                            readOnly
                          />
                          <label className="form-check-label">
                            {user.name} {user.surname}
                          </label>
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#555" }}>
                          {user.email}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-50 ps-2">
                  <h6>Miembros actuales</h6>
                  {showUsers.map((user) => (
                    <div key={user.id} className="form-check mb-2">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                      />
                      <label className="form-check-label">
                        {user.name} {user.surname}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSearchModal;
