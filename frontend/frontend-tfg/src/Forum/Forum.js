import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useRef } from 'react';
import { IoSend } from "react-icons/io5";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import fetchService from '../services/fetchService';
import AlertModal from '../ModalWindows/AlertModal';


const Forum = ({forumId, senderId, authValue, currentUser, groupName}) => {


    const [messageToSend, setMessageToSend] = useState("");

    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const messagesEndRef = useRef(null); //Para mantener el scroll al final del chat

    useEffect(() => {
        if (forumId) {
            fetchService(`messages/getMessagesByChatId/${forumId}`, "POST", authValue, null)
                .then(messages => {
                    setMessages(messages);
                })
            }
    }, [forumId, authValue]);

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
            setShowAlert(true);
            setAlertMessage("No estás conectado al chat. Por favor, intenta recargar la página o espera unos instantes y prueba de nuevo.");
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
        <div style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            borderRadius: "12px",
            backgroundColor: "#fff",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "1rem"
        }}>
            <AlertModal
                showModal={showAlert}
                onHide={() => setShowAlert(false)}
                message={alertMessage}
                error ={true}
            />
            <div style={{
                padding: "1rem",
                alignContent: "center",
                display: "flex"
            }}>
                <h3>Foro del grupo {groupName}</h3>
            </div>

            <div style={{
                height: "1px",
                backgroundColor: "#300",
                width: "100%",
                margin: "1.5rem 0",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
            }} />

            <div style={{
                flex: 1,
                overflowY: "auto",
                marginBottom: "1rem"
            }}>

                <div className="forum-messages">
                    {messages.map((m) => (
                    <div key={m.id} className="forum-message">
                        {m.content}
                        <div className="forum-timestamp">{m.timestamp}</div>
                    </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* SOLO DOCENTES, PARA ESCRIBIR MENSAJE */}
            {currentUser.userType === "PROFESSOR" && (
            <div style={{ display: "flex", width: "100%" }}>
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
                    style={{ flex: 1, marginRight: "1rem" }}
                />
                <button
                    className="main-button"
                    onClick={sendMessage}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <IoSend size={24} />
                </button>
            </div>
            )}
        </div>
        );
};

export default Forum;