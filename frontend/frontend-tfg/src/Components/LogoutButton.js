import { useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";

const LogoutButton = () => {

    const navigate = useNavigate();

    return (
            <IoLogOutOutline
                onClick={() => {
                    localStorage.removeItem("authValue");
                    localStorage.removeItem("currentUser");
                    navigate("/login");
                }}
                className="topbarlogout-icon"
            />

    );
};

export default LogoutButton;