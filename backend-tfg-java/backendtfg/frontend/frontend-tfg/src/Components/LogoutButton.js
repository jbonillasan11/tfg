import { useLocalState } from "../utils/useLocalState";
import { useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";

const LogoutButton = () => {

    const[setAuthValue] = useLocalState("", "authValue");
    const [setCurrentUser] = useLocalState("", "currentUser");
    const navigate = useNavigate();

    return (
            <IoLogOutOutline onClick={() => {
                    navigate("/login");
                    setAuthValue("");
                    setCurrentUser("");
                }} 
                className="topbar-icon"/>
    );
};

export default LogoutButton;