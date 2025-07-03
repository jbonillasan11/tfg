import {BsChatRightDotsFill} from "react-icons/bs";
import {useNavigate} from 'react-router-dom';

const ChatButton = () => {

    const navigate = useNavigate();

    return (
        <BsChatRightDotsFill onClick={() => navigate("/chats")} className="topbar-icon"/>
    );
};

export default ChatButton;