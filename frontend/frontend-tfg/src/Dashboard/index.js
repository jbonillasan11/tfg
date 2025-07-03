import { useLocalState } from '../utils/useLocalState';
import { useEffect, useState } from 'react';
import fetchService from '../services/fetchService';
import { Container, Row, Col } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TopBar from '../Components/TopBar';

const Dashboard = () => {

  const navigate = useNavigate();

  const [authValue] = useLocalState("", "authValue");
  const [currentUser, setCurrentUser] = useLocalState("", "currentUser");
  
  const [taskIds, setTaskIds] = useState([]);
  const [groupIds, setGroupIds] = useState([]);

  const [tasks, setTasks] = useState("");
  const [groups, setGroups] = useState("");

  useEffect(() => {
    fetchService("users/getCurrentUser", "GET", authValue, null)
      .then(user => {
        setCurrentUser(user);
      })
  }, [authValue])

  useEffect(() => {
    fetchService("users/getUserTasks", "GET", authValue, null)
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
  }, [taskIds, authValue])

    useEffect(() => {
      fetchService("users/getUserGroups", "GET", authValue, null)
        .then(groupList => {
          setGroupIds(groupList); //Tenemos la lista de Ids de grupos
        })
    }, [authValue])

    useEffect (() => {
      if (groupIds.length === 0 || groupIds === null) return; //Si no hay grupos, no hacemos nada

      fetchService("groups/getGroupsFromIds", "POST", authValue, groupIds)
        .then(groupList => {
          setGroups(groupList);
        })
    }, [groupIds, authValue])

    function createAssignment() {
      fetchService("tasks/newEmptyTask", "POST", authValue, null)
          .then(task => {
            navigate(`/tasks/${task.id}`);
          })
    }

    function createGroup() {
      fetchService("groups/newGroup", "POST", authValue, null)
        .then(group => {
          navigate(`/groups/${group.id}`);
        })
    }

    if (!currentUser) return <div>Cargando dashboard...</div>;
    
    return (
        <>  
          <TopBar currentUser={currentUser} isDashboard={true} />
          <Container fluid style={{ paddingInline: "clamp(1rem, 6vw, 4rem)", paddingTop: "2rem" }}>
            <div>
              <h1>Bienvenid@, {currentUser.name}</h1>
            </div>
            <br />
            <Row>
              <Col className="me-auto" md={5}>
                <div>
                  <div className="header-row" align="center">
                    <h1 className="one header-title">Tus tareas</h1>
                    {currentUser.userType === 'PROFESSOR' && (
                      <button className="main-button" onClick={() => createAssignment()}>
                        Nueva tarea
                      </button>
                    )}
                  </div>  
                  <ListGroup className = "two">
                    {tasks && tasks.map(task => (
                      <ListGroup.Item key= {task.id}
                          action
                          onClick={ () => navigate(`/tasks/${task.id}`) }>
                          <div>
                            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                              {task.name === "" ? "Tarea sin nombre" : task.name}
                            </div>
                            <div style={{ color: "#666", fontSize: "0.9rem" }}>
                              {task.description || "Sin descripción"}
                            </div>
                            <div style={{ color: "#666", fontSize: "0.9rem" }}>
                              Límite de entrega: {task.due}
                            </div>
                            <div style={{ fontSize: "0.8rem", fontStyle: "italic" }} align="right">
                              Miembros: {task.assigneesUserIds.length}
                            </div>
                          </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
                
              </Col> 

              <Col className="ms-auto" md={5}>
                <div>
                  <div className="header-row" align="center">
                    <h1 className="one header-title">Grupos</h1>
                    {currentUser.userType === 'PROFESSOR' && (
                      <button className="main-button" onClick={() => createGroup()}>
                        Nuevo grupo
                      </button>
                    )}
                  </div>
                  <ListGroup className = "four">
                    {groups && groups.map(group => (
                      <ListGroup.Item key= {group.id}
                          action
                          onClick={ () => navigate(`/groups/${group.id}`) }>
                          <div>
                            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                              {group.name === "" ? "Grupo sin nombre" : group.name}
                            </div>
                            <div style={{ fontSize: "0.8rem", fontStyle: "italic" }} align="right">
                              Miembros: {group.usersIds.length}
                            </div>
                          </div>
                      </ListGroup.Item>
                      ))}
                  </ListGroup>
                </div>
              </Col>
            </Row>
          </Container>
        </>
    );
}; 

export default Dashboard;