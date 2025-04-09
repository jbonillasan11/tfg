import { useLocalState } from '../utils/useLocalState';
import { useEffect, useState } from 'react';
import fetchService from '../services/fetchService';
import { Link } from 'react-router-dom';

const UserViewer = () => {
   
    const [authValue, setAuthValue] = useLocalState("", "authValue");
    const [currentUser, setCurrentUser] = useLocalState("", "currentUser");
    const userId = window.location.href.split("/user/")[1];
    const [userData, setUserData] = useState("");
    const [ownGroupIds, setOwnGroupIds] = useState([]);
    const [otherGroupIds, setOtherGroupIds] = useState([]);
    const [groups, setGroups] = useState([]);
    
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

    function passwordChange(){
      const reqBody = {
        oldPassword: prompt("Ingrese su contraseña actual"), //Habrá que cambiar prompts por ventana emergente que recoja campos de texto
        newPassword: prompt("Ingrese su nueva contraseña")
      }

      if (reqBody.newPassword === prompt("Repita su nueva contraseña")){
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
            alert(error.message);
          })
    }
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
                  <button onClick={() => passwordChange()}>Cambiar contraseña</button>
                </>
            )}
           
        </div>
    );
};

export default UserViewer;