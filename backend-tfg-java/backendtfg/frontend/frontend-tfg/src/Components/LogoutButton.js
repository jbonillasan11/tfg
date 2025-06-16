import { useLocalState } from "../utils/useLocalState";
import { useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";

const LogoutButton = () => {

    const[authValue, setAuthValue] = useLocalState("", "authValue");
    const [currentUser, setCurrentUser] = useLocalState("", "currentUser");
    const navigate = useNavigate();

    return (
            <IoLogOutOutline onClick={() => {
                    navigate("/login");
                    setAuthValue("");
                    setCurrentUser("");
                }} 
                className="topbarlogout-icon"/>
    );
};

export default LogoutButton;