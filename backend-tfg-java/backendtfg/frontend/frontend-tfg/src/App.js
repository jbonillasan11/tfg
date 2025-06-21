import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './login';
import PrivateRoute from './PrivateRoute';
import TaskViewer from './TaskViewer';
import Register from './Register';
import GroupViewer from './GroupViewer';
import UserViewer from './UserViewer';
import Chats from './Chats';
import TaskEditor from './TaskEditor';
import TaskResolver from './TaskResolver';
import TaskCorrector from './TaskCorrector';
import TaskCorrection from './TaskCorrection';
import fetchService from './services/fetchService';

function App() { 

const [loadingBackend, setLoadingBackend] = useState(true);

  useEffect(() => { //Servicio de ping al acceder a la app para verificar que el backend esta activo
    fetchService("api/ping", "GET")
      .then((res) => res.text())
      .then(() => {
        console.log("Backend activado");
        setLoadingBackend(false);
      })
      .catch((err) => {
        console.error("Error al despertar el backend", err);
      });
  }, []);

  if (loadingBackend) {
    return <div>Cargando el backend... por favor espera unos segundos.</div>;
  }


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
      <Route path="/tasks/:id/edit" element={
        <PrivateRoute> <TaskEditor /> </PrivateRoute>
      } />
      <Route path="/tasks/:id/responses/:userId" element={
        <PrivateRoute> <TaskResolver /> </PrivateRoute>
      } />
      <Route path="/tasks/:id/corrector/:userId" element={
        <PrivateRoute> <TaskCorrector /> </PrivateRoute>
      } />
      <Route path="/tasks/:id/correction/:userId" element={
        <PrivateRoute> <TaskCorrection /> </PrivateRoute>
      } />
      <Route path="/" element={<Login />}/> 
      <Route path="/login" element={<Login />}/> 
      <Route path="/register" element={<Register />}/>
    </Routes>
  </>
  );
}

export default App;
