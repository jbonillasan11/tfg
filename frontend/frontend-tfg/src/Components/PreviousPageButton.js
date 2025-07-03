import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

const PreviousPageButton = () => {

    const navigate = useNavigate();

    return (
        <IoIosArrowBack onClick={() => navigate(-1)} className="topbar-icon"/>
    );
};

export default PreviousPageButton;