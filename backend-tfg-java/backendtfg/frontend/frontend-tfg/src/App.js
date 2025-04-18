import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Homepage from './Homepage';
import Login from './login';
import PrivateRoute from './PrivateRoute';
import TaskViewer from './TaskViewer';
import Register from './Register';
import GroupViewer from './GroupViewer';
import UserViewer from './UserViewer';
import Chats from './Chats';
import Chat from './Chat';
import AddUserToTask from './ModalWindows/AddUserToTask';


function App() { 

return (
  <> 
    <Routes>   
      <Route path="/dashboard" element={
        <PrivateRoute> <Dashboard /> </PrivateRoute> //Protegemos las rutas quye requieren login
      } />
      <Route path="/tasks/:id" element={
        <PrivateRoute> <TaskViewer /> </PrivateRoute>
      } />
      <Route path="/groups/:id" element={
        <PrivateRoute> <GroupViewer /> </PrivateRoute>
      } />
      <Route path="/user/:id" element={
        <PrivateRoute> <UserViewer /> </PrivateRoute>
      } />
      <Route path="/chats" element={
        <PrivateRoute> <Chats /> </PrivateRoute>
      } />
      <Route path="/chats/:id" element={
        <PrivateRoute> <Chat /> </PrivateRoute>
      } />
      <Route path="/modal" element={<AddUserToTask />} />
      <Route path="/" element={<Homepage />}/> 
      <Route path="/login" element={<Login />}/> 
      <Route path="/register" element={<Register />}/>
    </Routes>
  </>
  );
}

export default App;
