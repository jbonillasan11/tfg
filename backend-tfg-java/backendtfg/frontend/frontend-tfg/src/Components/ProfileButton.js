const ProfileButton = ({id}) => {

    return (
        <button onClick={() => {
            window.location.href = `/user/${id}`;
        }}
        className="fixed bottom-4 right-4 p-3"> {"Mi perfil"} </button>
    );
};

export default ProfileButton;