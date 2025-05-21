import ChatButton from '../Components/ChatButton';
import LogoutButton from '../Components/LogoutButton';
import ProfileButton from '../Components/ProfileButton';
import HomeButton from '../Components/HomeButton';

const TopBar = ({currentUser}) => {

    return (
        <div>
            <div style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: "#1512a4" }}>
                <HomeButton />
                <div style = {{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                    <ChatButton />
                    <ProfileButton id={currentUser.id} />
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
};

export default TopBar;