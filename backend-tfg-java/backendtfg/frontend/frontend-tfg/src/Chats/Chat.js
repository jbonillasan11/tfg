import { useState, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import { IoSend } from "react-icons/io5";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import fetchService from '../services/fetchService';


const Chat = ({parentChat, senderId, authValue, participantsData = [], currentUser}) => {


    const [messageToSend, setMessageToSend] = useState("");

    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const [pairIdName, setPairIdName] = useState({}); //Pares id-nombre

    const messagesEndRef = useRef(null); //Para mantener el scroll al final del chat

    useEffect(() => {
        if (parentChat.id) {
            fetchService(`messages/getMessagesByChatId/${parentChat.id}`, "POST", authValue)
                .then(messages => {
                    setMessages(messages);
                })
            }
    }, [parentChat]);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws-chat");
        const client = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
            setIsConnected(true);
            client.subscribe(`/topic/messages/${parentChat.id}`, (message) => {
            const newMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, newMessage]);
            });
        },
        });

        client.activate();
        setStompClient(client);

        return () => client.deactivate();
    }, [parentChat]);

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
                    chatId: parentChat.id,
                }),
            });
            setMessageToSend("");
        }
    };

    useEffect(() => {
        console.log(participantsData);
        if (participantsData) {
            const mapIdName = {};
            participantsData.forEach(user => {
                mapIdName[user.id] = user.name;
            });
            setPairIdName(mapIdName);
        }
    }, [participantsData]);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
            <h3>
                Chat de {" "}
                {participantsData &&
                    participantsData.map(user =>
                    user ? user.name + " " + user.surname : "Usuario no encontrado"
                    ).join(", ")}
                </h3>
            <div style={{ flex: 1, overflowY: "auto" }}>
            <div className="chat">
                {messages.map((m) => {
                    const senderName = pairIdName[m.sender] || "Usuario no encontrado"; // Mapeamos los ids a nombres
                    if (m.sender === currentUser.id) {
                        return (
                            <div key={m.id} className="msg sent">
                                <div style={{ maxWidth: '60%' }}>
                                    {m.content}  
                                    <div style={{ fontSize: "0.75rem", marginTop: "4px" }} className="text-muted">
                                        {m.timestamp}
                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div key={m.id} className="msg rcvd">
                                <div style={{ maxWidth: '60%' }}>
                                    <strong>{senderName}</strong> 
                                    <br />
                                    {m.content} 
                                    <div style={{ fontSize: "0.75rem", marginTop: "4px" }} className="text-muted">
                                        {m.timestamp}
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })}
                <div ref={messagesEndRef} />
            </div>
            </div>
    
            <div style={{ display: "flex", width: "100%", padding: "1rem", backgroundColor: "#f8f8f8" }}>
                <Form.Control
                    type="text"
                    value={messageToSend}
                    onChange={(e) => setMessageToSend(e.target.value)}
                    style={{ width: "90%", marginRight: "1rem" }}
                />
                <button 
                    className="main-button"
                    onClick={sendMessage}
                    style = {{ alignContent: 'center', justifyContent: 'center', display: 'flex'}}
                >
                    <IoSend size={24} />
                </button>

            </div>
        </div>
    );
};

export default Chat;