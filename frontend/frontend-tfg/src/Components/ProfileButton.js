import {FaUserLarge} from 'react-icons/fa6';
import {useNavigate} from 'react-router-dom';

const ProfileButton = ({id}) => {

    const navigate = useNavigate();

    return (
        <FaUserLarge onClick={() => navigate(`/user/${id}`)} className="topbar-icon" />
    );
};

export default ProfileButton;