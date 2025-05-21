import { useNavigate } from 'react-router-dom';

const HomeButton = () => {

    const navigate = useNavigate();

    return (
        <button onClick={() => {
            navigate("/dashboard");
        }}>
            Dashboard </button>
    );
            
};

export default HomeButton;