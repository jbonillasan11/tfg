import React from 'react';
import fetchService from '../services/fetchService';
import { useLocalState } from '../utils/useLocalState';
import { useState, useEffect } from 'react';


const Chat = () => {

    const[authValue, setAuthValue] = useLocalState("", "authValue");
    const[chatId, setChatId] = useState("");
    const[chat, setChat] = useState("");
    const[participants, setParticipants] = useState([]);

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
    }, [authValue, chat]);


    return (
        <div>
            <h3>
                Chat de: {participants.map(participant => `${participant.name} ${participant.surname}`).join(", ")}
            </h3>
        </div>
    );
};

export default Chat;