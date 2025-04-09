import React from 'react';
import { useState } from 'react';
import fetchService from '../services/fetchService';
import { useLocalState } from '../utils/useLocalState';

const NewChatModal = ({ isOpen, onClose, onCreateChat }) => {

    const [authValue, setAuthValue] = useLocalState("", "authValue");

    const [busquedaNombres, setBusquedaNombres] = useState(""); //String de nombre que queremos buscar
    const [users, setUsers] = useState([]); //Array de usuarios que se encuentran en la base de datos
    const [selectedUsers, setSelectedUsers] = useState([]); //Array de los usuarios seleccionados

    function userSearch() {
        if (busquedaNombres.trim() === "") return; //Si el campo está vacío, ignoramos la búsqueda
        fetchService(`users/getUsersNameSearch?nameFragment=${encodeURIComponent(busquedaNombres)}`, "GET", authValue, null) //Buscamos los usuarios qeu contengan en su nombre el fragmento introducido
        .then(response => {
            setUsers(response);
        })
    }

    function toggleUserSelection(newUser) { //Gestionamos los usuarios a añadir al grupo
        setSelectedUsers((prevSelected) => {
            if (prevSelected.includes(newUser)) { //Si se selecciona uno que ya está en el grupo, se elimina
                return prevSelected.filter(id => id !== newUser);
            } else {
                return [...prevSelected, newUser]; //Si seleccionamos uno que no está en el grupo, se añade
            }
        });
    }

    function chatCreation(){
        if (selectedUsers.length === 0) return; //Si no se han seleccionado usuarios, no creamos el chat

        if (selectedUsers.length === 1){ //Si es un chat privado de dos usuarios, pasamos el id individualmente
            fetchService("chats/newChat", "POST", authValue, selectedUsers[0].toString())
            .then (response => {
                    onCreateChat(response.id);
                    onClose();
            })
        } else { //Si tiene más de un usuario (chat grupal), pasamos la lista de ids
            fetchService("chats/newGroupChat", "POST", authValue, selectedUsers)
            .then (response => {
                    onCreateChat(response.id);
                    onClose();
            }) 
        } 
    }

    if (!isOpen) return null; //Si no se ha abierto la opción del modal, no hace nada

    return (
        <div>
            <div>
                <h2>Nuevo chat</h2>
                <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={busquedaNombres}
                    onChange={(e) => setBusquedaNombres(e.target.value)}
                />
                <button onClick={userSearch}> Buscar </button>
                <ul>
                    {users.map((user) => (
                        <li key={user.id} onClick={() => toggleUserSelection(user.id)}
                            className={`p-2 cursor-pointer flex items-center ${
                                selectedUsers.includes(user.id) ? "bg-blue-300" : "hover:bg-gray-200"
                            }`}>
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                readOnly/>
                            {user.name} {user.surname}
                        </li>
                    ))}
                </ul>
                <div>
                    <button onClick={onClose}> Volver </button>
                    <button onClick={chatCreation}
                        className={`px-3 py-1 rounded ${
                            selectedUsers.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 text-white"
                        }`}
                        disabled={selectedUsers.length === 0}
                    > Crear </button>
                </div>
            </div>
        </div>
    );
};

export default NewChatModal;