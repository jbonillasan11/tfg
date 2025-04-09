import React from 'react';
import { useLocalState } from '../utils/useLocalState';
import { useState, useEffect } from 'react';
import fetchService from '../services/fetchService';
import { Link } from 'react-router-dom';
import NewChatModal from '../Components/NewChatModal';

const Chats = () => {

    const[authValue, setAuthValue] = useLocalState("", "authValue");
    const[pastChats, setPastChats] = useState([]);
    const[modalOpened, setModalOpened] = useState(false);

    useEffect(() => {
        fetchService("chats/getUserChats", "GET", authValue, null)
        .then(responseChats => {
            setPastChats(responseChats);
        })
    }, [authValue]);

    function newChatRedirecter(chatId){ //Al crearse el chat, devolverá el id, que elevará a esta función y que redirigirá al usuario a al ventana del chat
        console.log(chatId);
        window.location.href = `/chats/${chatId}`;
    }

    return (
        <div>
            <h1>Chats</h1>
            <ul>
                {pastChats && pastChats.length > 0 && pastChats.map(chat => ( //li modificable por div si prefiero que no aparezca con el formato lista
                    <div key={chat.id}> 
                        <Link to={`/chats/${chat.id}`} //Cambiar por onClick, quiero que sea un boton o un cuadro, no un link 
                        > 
                            ID: {chat.id}, {chat.participants.map(participant => participant.name).join(", ")}
                        </Link>
                    </div>
                ))}
            </ul>
            <button onClick={() => setModalOpened(true)}>Nuevo chat</button>
            <NewChatModal
                isOpen={modalOpened}
                onClose={() => setModalOpened(false)}
                onCreateChat={newChatRedirecter}
            />
        </div>
    );
};

export default Chats;