import { useLocalState } from '../utils/useLocalState';
import { useEffect, useState } from 'react';
import fetchService from '../services/fetchService';
import { ListGroup } from 'react-bootstrap';
import ChangePasswordModal from '../ModalWindows/ChangePasswordModal';
import { useNavigate } from 'react-router-dom';
import TopBar from '../Components/TopBar';
import { FaUserTie, FaUserGraduate } from "react-icons/fa6";

const UserViewer = () => {

    const navigate = useNavigate();
   
    const [authValue] = useLocalState("", "authValue");
    const [currentUser] = useLocalState("", "currentUser");

    const userId = window.location.href.split("/user/")[1];

    const [userData, setUserData] = useState("");
    const [ownGroupIds, setOwnGroupIds] = useState([]);
    const [otherGroupIds, setOtherGroupIds] = useState([]);
    const [groups, setGroups] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    
    useEffect (() => {
      if (userId === currentUser.id) {
        setUserData(currentUser);
      } else {
        fetchService(`users/getUserId/${userId}`, "GET", authValue, null)
        .then(responseData => {
            setUserData(responseData);
        })  
    }
  }, [authValue, userId, currentUser])

    useEffect(() => {
        fetchService("users/getUserGroups", "GET", authValue, null)
          .then(groupList => {
            setOwnGroupIds(groupList);
          })
      }, [authValue])
  
    useEffect (() => {
      fetchService(`users/getOtherUserGroups/${userId}`, "GET", authValue, null)
        .then(groupList => {
          setOtherGroupIds(groupList);
        })
    }, [authValue, userId])
    
    useEffect (() => {
      const otherGroupSet = new Set(otherGroupIds); //La búsqueda de .has en Set tiene complejidad de O(1), mientras qeu la del Array es O(n)
      const groupIds = ownGroupIds.filter(id => otherGroupSet.has(id));
      fetchService("groups/getGroupsFromIds", "POST", authValue, groupIds) 
        .then(groupList => {
          setGroups(groupList);
        })
    }, [authValue, ownGroupIds, otherGroupIds])

    function chatWithUser(){
      navigate("/chats", {
        state: {otherUserId: userId} //Transferimos el id del usuario a la ventana de chats
      });
    }

  const handlePasswordChange = ({oldPasswordInput, newPasswordInput}) => {
    const reqBody = {
      oldPassword: oldPasswordInput,
      newPassword: newPasswordInput
    }

    fetch("http://localhost:8080/users/changePassword", {
      method: "POST",
        headers: {
          "content-type": "application/json",
          "authorization": `Bearer ${authValue}`
        },
        body: JSON.stringify(reqBody)
      })   
      .then(response => {
        alert("Contraseña cambiada correctamente");
      })
      .catch (error => {
        alert("Error al cambiar la contraseña" );
      })
  }

    
    return (
      <>
        <TopBar currentUser={currentUser} />
        <div style={{ margin: '2rem' }}>
          <h1 style={{ marginBottom: '2rem' }}>Tu perfil</h1>

          {userData !== "" ? null : (
            <h2>Usuario no encontrado</h2>
          )}

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.5rem', 
            padding: '1.5rem', 
            borderRadius: '1rem',
            backgroundColor: '#f5f5f5',
            marginTop: '1rem'
          }}>
            {userData.userType === "PROFESSOR" ? (
              <FaUserTie style={{ fontSize: '8rem' }} />
            ) : (
              <FaUserGraduate style={{ fontSize: '8rem' }} />
            )}

            <div>
              <h2>{userData.name} {userData.surname}</h2>
              <h2>{userData.userType === "PROFESSOR" ? "Docente en" : "Estudiante en"} {userData.organization}</h2>
              <h4>{userData.email}</h4>
            </div>
          </div>
            
            {userId !== currentUser.id ? (
                <div style={{ marginTop: '2rem' }}> 
                  <button padding="1rem" className="main-button" onClick={() => chatWithUser()}>Iniciar chat</button>
                  <h3 style={{ marginTop: '2rem' , marginBottom: '1rem' }}>Grupos en común: </h3>
                  <ListGroup>
                  {groups && groups.map(group => (
                      <ListGroup.Item key= {group.id}
                          action
                          onClick={() => navigate(`/groups/${group.id}`)}>
                          <div>
                            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                              {group.name === "" ? "Grupo sin nombre" : group.name}
                            </div>
                            <div style={{ fontSize: "0.8rem", fontStyle: "italic" }} align="right">
                              Miembros: {group.usersIds.length}
                            </div>
                          </div>
                      </ListGroup.Item>
                      ))}
                  </ListGroup>
                </div>
            ) : (
                <>
                  <button className="main-button" style={{ margin: '2rem' }} onClick={() => setModalOpen(true)}>Cambiar contraseña</button>
                  <ChangePasswordModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handlePasswordChange}
                  />
                </>
            )}
        </div>
      </>
    );
};

export default UserViewer;