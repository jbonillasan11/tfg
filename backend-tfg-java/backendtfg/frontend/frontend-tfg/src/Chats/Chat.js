import React from 'react';
import fetchService from '../services/fetchService';
import { useLocalState } from '../utils/useLocalState';
import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';


const Chat = ({parentChat, chatNames}) => {

    const[authValue, setAuthValue] = useLocalState("", "authValue");

    const [messageToSend, setMessageToSend] = useState("");


    /*
    useEffect(() => {
        setChatId(window.location.href.split("/chats/")[1]);
    }, []);

    useEffect(() => {
        if (chatId === "") return; //Ejecutamos el fetch cuando tengamos el id del chat
        
        fetchService(`chats/getChatById/${chatId}`, "GET", authValue, null)
        .then(chat => {
            setChat(chat);
            setParticipants(chat.participants);
        })
    }, [authValue, chatId]);

    useEffect(() => {
        if (chat === "") return;
        
        fetchService("users/getUsers", "POST", authValue, chat.participants)
        .then(users => {
            setParticipants(users);
        })
    }, [authValue, chat]);*/

    function sendMessage(){

    }


    return (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
            <h3>Chat de: {chatNames}</h3>
    
            <div style={{ flex: 1, overflowY: "auto" }}>
                {/* Renderizo mensajes */}
            </div>
    
            {/* Input + botón anclados abajo */}
            <div style={{ display: "flex", width: "100%", padding: "1rem", backgroundColor: "#f8f8f8" }}>
                <Form.Control
                    type="text"
                    value={messageToSend}
                    onChange={(e) => setMessageToSend(e.target.value)}
                    style={{ width: "90%", marginRight: "1rem" }}
                />
                <Button onClick={sendMessage} style={{ width: "10%" }}>
                    Enviar
                </Button>
            </div>
        </div>
    );
};

export default Chat;