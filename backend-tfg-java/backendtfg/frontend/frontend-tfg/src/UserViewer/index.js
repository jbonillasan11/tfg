import { useLocalState } from '../utils/useLocalState';
import { useEffect, useState } from 'react';
import fetchService from '../services/fetchService';
import { Link } from 'react-router-dom';
import ChangePasswordModal from '../Components/ChangePasswordModal';

const UserViewer = () => {
   
    const [authValue, setAuthValue] = useLocalState("", "authValue");
    const [currentUser, setCurrentUser] = useLocalState("", "currentUser");
    const userId = window.location.href.split("/user/")[1];
    const [userData, setUserData] = useState("");
    const [ownGroupIds, setOwnGroupIds] = useState([]);
    const [otherGroupIds, setOtherGroupIds] = useState([]);
    const [groups, setGroups] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [passwordChange, setPasswordChange] = useState(false);
    
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
      fetchService("chats/newChat", "POST", authValue, userId)
        .then (response => {
          window.location.href = `/chats/${response.id}`;
        })
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
        if (response.status === 200) {
          alert("Contraseña cambiada correctamente");
        } else {
          return response.text().then(text => { throw new Error(text) });
        }
      })
      .catch (error => {
        alert("Error al cambiar la contraseña" );
      })
  }

    
    return (
        <div>
            <h1>Perfil</h1>
            {userData !== "" ? (
              <></> ) : (
                <h2>Usuario no encontrado</h2>
              )
            }
            {userData.userType === "PROFESSOR" ? (
                <h2>Docente {userData.name} {userData.surname}</h2>
              ): (
                <h2>Estudiante {userData.name} {userData.surname}</h2>)
            }
            <h4>{userData.email}</h4>
            <h5>{userData.organization}</h5>
            {userId !== currentUser.id ? (
                <> 
                  <h3>Grupos en común: </h3>
                    <ul>
                      {groups && groups.map(group => (
                        <li key={group.id}> 
                          <Link to={`/groups/${group.id}`}>ID: {group.id}, Nombre:{group.name}</Link>
                        </li>
                      ))}
                    </ul>
                  <button onClick={() => chatWithUser()}>Chat</button>
                </>
            ) : (
                <>
                  <button onClick={() => setModalOpen(true)}>Cambiar contraseña</button>
                  <ChangePasswordModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handlePasswordChange}
                  />
                 
                </>
            )}
           
        </div>
    );
};

export default UserViewer;