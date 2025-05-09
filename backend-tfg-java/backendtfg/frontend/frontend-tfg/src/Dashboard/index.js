import { useLocalState } from '../utils/useLocalState';
import { useEffect, useState } from 'react';
import fetchService from '../services/fetchService';
import { Container, Row, Col } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TopBar from '../Components/TopBar';

const Dashboard = () => {

  const navigate = useNavigate();

  const [authValue, setAuthValue] = useLocalState("", "authValue");
  const [currentUser, setCurrentUser] = useLocalState("", "currentUser");
  
  const [taskIds, setTaskIds] = useState([]);
  const [groupIds, setGroupIds] = useState([]);

  const [tasks, setTasks] = useState("");
  const [groups, setGroups] = useState("");

  
  
  useEffect(() => {
    fetchService("users/getCurrentUser", "GET", authValue, null) //Petición asíncrona a nuestra APIRest
      .then(user => {
        setCurrentUser(user);
      })
  }, [authValue])

  useEffect(() => {
    fetchService("users/getUserTasks", "GET", authValue, null) //Petición asíncrona a nuestra APIRest
      .then(tasksListIds => {
          setTaskIds(tasksListIds); //Tenemos la lista de Ids de tareas
      }) ;
     
  }, [authValue])

  useEffect(() => {
    if (taskIds.length === 0 || taskIds === null) return; //Si no hay tareas, no hacemos nada

    fetchService("tasks/getTasksFromIds", "POST", authValue, taskIds)
      .then(taskList => {
        setTasks(taskList);
      })
  }, [taskIds])

    useEffect(() => {
      fetchService("users/getUserGroups", "GET", authValue, null) //Petición asíncrona a nuestra APIRest
        .then(groupList => {
          setGroupIds(groupList); //Tenemos la lista de Ids de grupos
        })
    }, [authValue])

    useEffect (() => {
      if (groupIds.length === 0 || groupIds === null) return; //Si no hay grupos, no hacemos nada

      fetchService("groups/getGroupsFromIds", "POST", authValue, groupIds) //Petición asíncrona a nuestra APIRest
        .then(groupList => {
          setGroups(groupList);
        })
    }, [groupIds])

    function createAssignment() {
      fetchService("tasks/newEmptyTask", "POST", authValue, null) //Peticion asíncrona a nuestra APIRest
          .then(task => {
            navigate(`/tasks/${task.id}`);
          })
    }

    function createGroup() {
      fetchService("groups/newGroup", "POST", authValue, null) //Peticion asíncrona a nuestra APIRest
        .then(group => {
          navigate(`/groups/${group.id}`);
        })
    }

    if (!currentUser) return <div>Cargando dashboard...</div>;
    
    return (
        <>  
          {/*<TopBar currentUser={currentUser} /> */}
          <TopBar currentUser={currentUser} />
          <Container fluid>
            
            <div>
              <h1>Bienvenido, {currentUser.name}</h1>
            </div>
            <Row>
              <Col md={6}>
                <div>
                  <h2 className = "one">Tareas</h2>
                  <ListGroup className = "two">
                    {tasks && tasks.map(task => (
                      <ListGroup.Item key= {task.id}
                          action
                          onClick={ () => navigate(`/tasks/${task.id}`) }>
                          {task.name === "" ? "Tarea sin nombre" : task.name}
                      </ListGroup.Item>
                      ))}
                  </ListGroup>
                </div>
                {currentUser.userType === "PROFESSOR" ? (
                  <div style ={{margin: "20px"}}>
                      <button onClick={() => createAssignment()}>Nueva tarea</button>
                  </div>
                ) : (
                  <></>
                )}
              </Col> 

              <Col md={6}>
                <div>
                  <h2 className = "three">Grupos</h2>
                  <ListGroup className = "four">
                    {groups && groups.map(group => (
                      <ListGroup.Item key= {group.id}
                          action
                          onClick={ () => navigate(`/groups/${group.id}`) }>
                          {group.name === "" ? "Grupo sin nombre" : group.name}
                      </ListGroup.Item>
                      ))}
                  </ListGroup>
                </div>
                  {currentUser.userType === "PROFESSOR" ? ( 
                    <div style ={{margin: "20px"}}>
                      <button onClick={() => createGroup()}>Nuevo grupo</button>
                    </div>  
                  ) : (
                    <></>
                  )}
              </Col>
            </Row>
          </Container>
          
        </>
    );
}; 

export default Dashboard;