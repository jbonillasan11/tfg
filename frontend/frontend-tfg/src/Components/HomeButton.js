import { useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";

const HomeButton = () => {

    const navigate = useNavigate();

    return (
        <FaHome onClick={() => navigate("/dashboard")} className="topbar-icon"/>
    );
            
};

export default HomeButton;