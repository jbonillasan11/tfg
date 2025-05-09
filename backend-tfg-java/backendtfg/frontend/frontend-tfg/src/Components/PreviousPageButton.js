import React from 'react';
import { useNavigate } from 'react-router-dom';

const PreviousPageButton = () => {

    const navigate = useNavigate();

    return (
        <div>
            <button className="btn btn-primary" onClick={() => navigate(-1)}>Atrás</button>
        </div>
    );
};

export default PreviousPageButton;