import ChatButton from '../Components/ChatButton';
import LogoutButton from '../Components/LogoutButton';
import ProfileButton from '../Components/ProfileButton';
import HomeButton from '../Components/HomeButton';
import PreviousPageButton from './PreviousPageButton';

const TopBar = ({currentUser, isDashboard = false}) => {

    return (
    <div>
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1.5rem', 
            backgroundColor: "#1512a4" 
        }}>
            <div style={{ display: 'flex', gap: '2rem' }}>
                {!isDashboard ? <PreviousPageButton title="Volver" /> : null}
                <HomeButton />
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <ChatButton title="Mis chats" />
                <ProfileButton id={currentUser.id} title="Mi perfil" />
                <LogoutButton title="Cerrar sesión" />
            </div>
        </div>
    </div>
);
};

export default TopBar;