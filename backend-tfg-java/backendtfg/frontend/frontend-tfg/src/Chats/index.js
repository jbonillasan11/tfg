import { useLocalState } from '../utils/useLocalState';
import { useState, useEffect } from 'react';
import fetchService from '../services/fetchService';
import NewChat from '../ModalWindows/NewChat';
import { ListGroup } from 'react-bootstrap';
import TopBar from '../Components/TopBar';
import { useLocation } from "react-router-dom";
import Chat from '../Chats/Chat';

const Chats = () => {

    const [authValue] = useLocalState("", "authValue");
    const [currentUser] = useLocalState("", "currentUser");

    const location = useLocation(); //Obtenemos el id del usuario al que redirigimos desde el chat (si existe)

    const [pastChats, setPastChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null); //Chat al que accedemos, por defecto null

    const [chatNames, setChatNames] = useState({}); //Nombres de los chats, por defecto null
    const [participantsData, setParticipantsData] = useState([]); //Datos de los chats, por defecto null

    useEffect(() => {
        fetchService("users/getUserChats", "GET", authValue, null)
        .then((response) => {
            setPastChats(response);
        })
        if (location.state) { //Si venimos redirigidos del botón chat de un usuario, obtenemos su id y abrimos el chat privado con él automáticamente
            fetchService("chats/getSingleChatByParticipants", "POST", authValue, [currentUser.id, location.state.otherUserId]) //Si hay más de un chat en el que estén ambos usuarios (grupal), cuál devuelve??
            .then((response) => {
                setCurrentChat(response);
            })
        }
    }, []);

    useEffect(() => {
        if (!pastChats || pastChats.length === 0) return;

        pastChats.forEach(chat => {
            fetchService("users/getUsers", "POST", authValue, chat.participants)
                .then(users => {
                    setParticipantsData(prev => ({ ...prev, [chat.id]: users }));
                    const nameString = users.map(user => user.name).join(", ");
                    setChatNames(prev => ({ ...prev, [chat.id]: nameString }));
                });
            
        });
    }, [pastChats, authValue]);


    function newChatRedirecter(chat){ //Al crearse el chat, devolverá el id, que elevará a esta función y que redirigirá al usuario a al ventana del chat
        setCurrentChat(chat); //El chat actual es el recién creado
    }

    return (
        <>
            <TopBar currentUser={currentUser} />
            <div style={{ display: 'flex', height: '100vh' }}>
                
                <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f0f0f0', padding: '1rem' }}>
                    <h1>Chats</h1>
                    {currentUser.userType === "PROFESSOR" && (
                        <NewChat
                            currentUser={currentUser}
                            onCreateChat={(newChat) => {
                                setPastChats([...pastChats, newChat]);
                                setCurrentChat(newChat);
                                newChatRedirecter(newChat.id);
                            }}
                        />
                    )}
                    <ListGroup>
                        {pastChats && pastChats.length > 0 && pastChats.map(chat => (
                            <ListGroup.Item
                                key={chat.id}
                                action
                                onClick={() => setCurrentChat(chat)}
                            >
                                Chat de {chatNames[chat.id]}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>

                <div style={{ flex: 2, overflowY: 'auto', padding: '1rem', backgroundColor: '#ffffff' }}>
                    {/* AQUI RENDERIZO EL CHAT */}
                    {currentChat && authValue && (
                    <Chat
                        parentChat={currentChat}
                        participantsData={participantsData[currentChat.id]}
                        senderId={currentUser.id}
                        authValue={authValue}
                        currentUser={currentUser}
                    /> )}
                </div>    
            </div>
        </>
        
    );
    
    
};

export default Chats;