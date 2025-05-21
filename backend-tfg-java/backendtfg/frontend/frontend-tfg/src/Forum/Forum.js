import React from 'react';
import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useRef } from 'react';

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import fetchService from '../services/fetchService';


const Forum = ({forumId, senderId, authValue, currentUser, groupName}) => {


    const [messageToSend, setMessageToSend] = useState("");

    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const messagesEndRef = useRef(null); //Para mantener el scroll al final del chat

    useEffect(() => {
        if (forumId) {
            fetchService(`messages/getMessagesByChatId/${forumId}`, "POST", authValue, null)
                .then(messages => {
                    setMessages(messages);
                })
            }
    }, [forumId]);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws-chat");
        const client = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
            setIsConnected(true);
            client.subscribe(`/topic/messages/${forumId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages((prev) => [...prev, newMessage]);
            });
        },
        });

        client.activate();
        setStompClient(client);

        return () => client.deactivate();
    }, [forumId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = () => {
        if (!isConnected) {
            alert("Error enviando el mensaje. Espera unos instantes y prueba de nuevo");
            return;
        }
        if (stompClient && messageToSend.trim()) {
            stompClient.publish({
                destination: "/app/chat/send",
                body: JSON.stringify({
                    sender: senderId,
                    content: messageToSend,
                    chatId: forumId,
                }),
            });
            setMessageToSend("");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
            <h3>Foro del grupo {groupName}</h3>
            <div style={{ flex: 1, overflowY: "auto" }}>
            <div className="chat">
                {messages.map((m) => { //El mensaje se mostarrá de forma uniforme para todos los usuarios
                        return (
                            <div key={m.id}>
                                <div style={{ maxWidth: '60%' }}>
                                    {m.content}  
                                    <div style={{ fontSize: "0.75rem", marginTop: "4px" }} className="text-muted">
                                        {m.timestamp}
                                    </div>
                                </div>
                            </div>
                        );
                })}
                <div ref={messagesEndRef} />
            </div>
        </div>
        {currentUser.userType === "PROFESSOR" && ( //SOLO LOS PROFESORES PODRÁN ESCRIBIR EN LOS FOROS
            <div style={{ display: "flex", width: "100%", padding: "1rem", backgroundColor: "#f8f8f8" }}>
                <Form.Control
                    type="text"
                    value={messageToSend}
                    onChange={(e) => setMessageToSend(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    style={{ width: "90%", marginRight: "1rem" }}
                />
            
                <Button onClick={sendMessage} style={{ width: "10%" }}>
                    Enviar
                </Button>
            </div>
        )}
        </div>
    );
};

export default Forum;