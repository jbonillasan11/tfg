import { useState, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import { IoSend } from "react-icons/io5";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import fetchService from '../services/fetchService';
import AlertModal from '../ModalWindows/AlertModal';

const Chat = ({parentChat, senderId, authValue, participantsData = [], currentUser}) => {

    const [messageToSend, setMessageToSend] = useState("");

    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const [pairIdName, setPairIdName] = useState({}); //Pares id-nombre

    const messagesEndRef = useRef(null); //Para mantener el scroll al final del chat

    useEffect(() => {
        if (parentChat.id) {
            fetchService(`messages/getMessagesByChatId/${parentChat.id}`, "POST", authValue)
                .then(messages => {
                    setMessages(messages);
                })
            }
    }, [parentChat, authValue]);

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
        <h3>
            Chat de{" "}
            {participantsData &&
            participantsData
                .map(user => user ? user.name + " " + user.surname : "Usuario no encontrado")
                .join(", ")}
        </h3>

        <div className="chat-messages">
            {messages.map((m) => {
            const isCurrentUser = m.sender === currentUser.id;
            return (
                <div key={m.id} className={`message ${isCurrentUser ? "sent" : "received"}`}>
                    {!isCurrentUser && <strong>{pairIdName[m.sender]}</strong>}
                    <div>
                        {m.content}
                    </div>
                    <div className="message-timestamp">
                        {m.timestamp}
                    </div>
                </div>
            );
            })}
            <div ref={messagesEndRef} />
        </div>

        <div style={{ display: "flex", width: "100%", paddingTop: "1rem" }}>
            <Form.Control
                type="text"
                value={messageToSend}
                onChange={(e) => setMessageToSend(e.target.value)}
                style={{ width: "90%", marginRight: "1rem" }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                    }
                }}
            />
            <button className="chat-send-button" onClick={sendMessage}>
                <IoSend size={24} />
            </button>
        </div>
        </div>

    );
};

export default Chat;