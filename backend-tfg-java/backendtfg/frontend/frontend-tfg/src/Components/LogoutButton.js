import { useLocalState } from "../utils/useLocalState";

const LogoutButton = () => {
    const[authValue, setAuthValue] = useLocalState("", "authValue");
    const [currentUser, setCurrentUser] = useLocalState("", "currentUser");

    return (
        <button onClick={() => {
            window.location.href = "/login"
            setAuthValue("");
            setCurrentUser("");
        }}
        className="fixed bottom-4 right-4 p-3"> {"Cerrar sesión"} </button>
    );
};

export default LogoutButton;