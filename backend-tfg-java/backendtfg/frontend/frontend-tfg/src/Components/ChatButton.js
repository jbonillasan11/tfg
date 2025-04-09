import React from 'react';


const ChatButton = () => {
    return (
        <button onClick={() => window.location.href = "/chats"}
                className="fixed bottom-4 right-4 p-3"> {"Chats"} </button>
    );
};

export default ChatButton;