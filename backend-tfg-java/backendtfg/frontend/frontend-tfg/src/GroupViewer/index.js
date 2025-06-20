import { useEffect } from 'react';
import fetchService from '../services/fetchService';
import { useLocalState } from '../utils/useLocalState';
import { useState } from 'react';
import AddUserToGroup from '../ModalWindows/AddUserToGroup';
import { Form, ListGroup } from 'react-bootstrap';
import TopBar from '../Components/TopBar';
import Forum from '../Forum/Forum';
import AlertModal from '../ModalWindows/AlertModal';
import ConfirmDeletionWindow from '../ModalWindows/ConfirmDeletionWindow';

const GroupViewer = () => {

    const [authValue] = useLocalState("", "authValue");
    const [currentUser] = useLocalState("", "currentUser"); //Usuario logueado
    
    const groupId = window.location.href.split("/groups/")[1]; //Obtenemos el id de la tarea de la URL
    const [group, setGroup] = useState(""); //Grupo al que accedemos
    const [creator, setCreator] = useState(""); //Creador del grupo

    const [groupUsers, setGroupUsers] = useState([]); //Usuarios del grupo (tipo UserDTO)

    const [updatedUserIds, setUpdatedUserIds] = useState([]);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlertDeletion, setShowAlertDeletion] = useState(false);

    const [navigate, setNavigate] = useState("");

    useEffect(() => {
      fetchService(`groups/${groupId}`, "GET", authValue, null)
          .then(groupData => {
            setGroup(groupData);
          })
          .catch(error => {
            console.error(error.message);
            setGroup("");
          });
    }, [groupId, authValue]);
    
    useEffect(() => {
      if (group !== ""){
        fetchService(`users/getUserId/${group.creatorId}`, "GET", authValue)
        .then(creatorData => {
          setCreator(creatorData);
        });
      }
    }, [authValue, group])

    useEffect (() => {
      if (group.usersIds && group.usersIds.length >= 1){
        fetchService("users/getUsers", "POST", authValue, group.usersIds)
        .then(usersData => {
          setGroupUsers(usersData);
        })
      } else {
        setGroupUsers([creator]);
      }
    }, [group, authValue, creator]);

    function saveGroupDB(){
      addUsersGroup(); //Actualizamos los usuarios por fuera del PUT, ya que es un método algo más complejo
      fetchService(`groups/${groupId}`, "PUT", authValue, group)
      .then(groupData => {
        setGroup(groupData);
        setShowAlert(true);
        setAlertMessage("Grupo guardado con éxito. Recarga la página para ver los cambios.");
      })
    }

    function saveFieldUpdate(field, value) { //Función que guarda los datos del grupo y nos permite modificarlo las veces que queramos
      const groupCopy = {...group};
      groupCopy[field] = value;
      setGroup(groupCopy);
    }

    function confirmGroupDeletion(){
      setShowAlertDeletion(true);
      setAlertMessage("¿Estás seguro de que quieres eliminar este grupo? Esta acción no se puede deshacer.");
      setNavigate("/dashboard");  
    }

    function deleteGroupDB(){
      fetchService(`groups/deleteGroupId/${groupId}`, "DELETE", authValue, null)
      .then(() => {
        setShowAlert(true);
        setAlertMessage("Grupo eliminado con éxito");
        setNavigate("/dashboard") ; //Redirigimos al dashboard
      })
    }

    function addUsersGroup(){
      if (updatedUserIds.length === 0) fetchService(`groups/setUsers/${groupId}`, "PUT", authValue, [currentUser.id]) //Si no hay usuarios, eliminamos a todos menos al actual
      else fetchService(`groups/setUsers/${groupId}`, "PUT", authValue, updatedUserIds) //Si hay 
    }

    return (
      <>
       <TopBar currentUser={currentUser} />
        <div style={{ display: 'flex', height: "calc(100vh - 90px)" }}>
          <AlertModal
            showModal={showAlert}
            onHide={() => setShowAlert(false)}
            message={alertMessage}
            redirectTo={navigate}
          />
          <ConfirmDeletionWindow
            showModal={showAlertDeletion}
            onHide={() => setShowAlertDeletion(false)}
            onConfirm={deleteGroupDB}
            message={alertMessage}
            redirectTo={navigate}
          />
          {/* Columna izquierda: info y miembros */}
          <div style={{ flex: 1, padding: '2rem'}}>
            {group ? (
              <>
                <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                  {currentUser.userType === "PROFESSOR" ? (
                    <Form.Control
                      type="text"
                      value={group.name || "Grupo sin nombre"}
                      onChange={(e) => saveFieldUpdate('name', e.target.value)}
                      style={{
                        fontSize: "inherit",
                        fontWeight: "inherit",
                        background: "transparent",
                        width: "100%",
                      }}
                    />
                  ) : (
                    group.name || "Grupo sin nombre"
                  )}
                </h1>
                <h4 style={{ fontStyle: "italic", color: "#555", marginLeft: "0.5rem" }}>
                  Creado por {creator.name} {creator.surname} ({creator.organization})
                </h4>
                {currentUser.id === group.creatorId && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "3rem" }}>
                    <h3 style={{ margin: 0 }}>Miembros</h3>
                    <AddUserToGroup
                      parentGroup={group}
                      onSaveUsers={(updatedUsers) => setUpdatedUserIds(updatedUsers)}
                    />
                  </div>
                )}

              <ListGroup style={{ marginTop: "1rem" }}>
                {groupUsers && groupUsers.map(member => (
                  <ListGroup.Item
                    key={member.id}
                    action
                    onClick={() => navigate(`/user/${member.id}`)}
                  >
                    {member.name} {member.surname}
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {currentUser.id === group.creatorId && (
                <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                  <button id="saveGroupButton" className="main-button" onClick={saveGroupDB}>
                    Guardar cambios
                  </button>
                  <button id="deleteGroupButton" className="delete-button" onClick={confirmGroupDeletion}>
                    Eliminar grupo
                  </button>
                </div>
              )}
              </>
            ) : (
              <h2>Grupo no encontrado</h2>
            )}
          </div>

          {/* Columna derecha: foro */}
          <div style={{ flex: 1, padding: '1rem',  overflowY: 'auto' }}>
            {group && (
              <Forum
                forumId={group.forumId}
                senderId={currentUser.id}
                authValue={authValue}
                currentUser={currentUser}
                groupName={group.name}
              />
            )}
          </div>
        </div>

      </>
    );
};

export default GroupViewer;