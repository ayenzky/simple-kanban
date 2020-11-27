import React, { useState } from 'react'
// import Container from './components/Container'
// import Button from './components/Button'
import Column from 'components/Column'
import { Row, Container, Col, Button, Modal, Form, Card } from 'react-bootstrap'
import { useHistory } from "react-router-dom";


function IndexPage() {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");
  const [columnId, setColumnId] = useState(null);
  const [columns, setColumns] = useState(null)
  const [tasks, setTasks] = useState(null)
  const history = useHistory();
  const username = JSON.parse(localStorage.getItem("kanbanToken"));

  React.useEffect(() => {
    if (localStorage.getItem("kanbanToken") === null) {
      history.push("/login");
    }
  }, [history]);
  React.useEffect(() => {
    fetch((process.env.REACT_APP_API_URL || "http://localhost:1337") + "/columns")
      .then((res) => res.json())
      .then((result) => setColumns(result))

    fetch((process.env.REACT_APP_API_URL || "http://localhost:1337") + "/tasks")
      .then((res) => res.json())
      .then((result) => setTasks(result))
  }, [])

  if(!columns) {
    return null
  }
  
  const handleClickAddColumn =(e)=> {
    const label = prompt("Column name");
    // label && setColumns([...columns, { id: label.toLowerCase(), label: label}])
    if(label) {
      fetch((process.env.REACT_APP_API_URL || "http://localhost:1337") + "/columns", {
        method: "POST",
        body: JSON.stringify({
          label
        }),
        headers: {
          'Content-Type': "application/json"
        }
      })
      .then((res) => res.json())
      .then((result) => {
        setColumns(prevColumns => [...prevColumns, result]) 
      })  
    }
  }

  // const handleClickAddTask = (id) => {
  //   // const label = prompt("Task name")
  //   setShow(true)
  //   const label = value;
  //   alert(id)
  //   label && setTasks([...tasks, {id: label.toLowerCase(), label: label, column: id}])
  // }

  const handleClickAddTask = (id) => {
    // const label = prompt("Task name")
    // setShow(true)
    const label = value;
    // label && setTasks([...tasks, {id: label.toLowerCase(), label: label, column: id}])
    if(label) {
      fetch((process.env.REACT_APP_API_URL || "http://localhost:1337") + "/tasks", {
        method: "POST",
        body: JSON.stringify({
          label,
          column: id
        }),
        headers: {
          'Content-Type': "application/json"
        }
      })
      .then((res) => res.json())
      .then((result) => {
        setTasks(prevTasks => [...prevTasks, result]) 
      })  
  }

    setShow(false)
  }


  const handleClickDeleteTask = (id) => {
    // setTasks(tasks.filter(task => task.id !== id))
    fetch((process.env.REACT_APP_API_URL || "http://localhost:1337") + `/tasks/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': "application/json"
      }
    })
    .then((res) => res.json())
    .then((result) => {
        fetch((process.env.REACT_APP_API_URL || "http://localhost:1337") + "/tasks")
        .then((res) => res.json())
        .then((result) => setTasks(result))
    })
  }
  const handleClickDeleteColumn = (id) => {
    // setColumns(columns.filter(column => column.id !== id))
    fetch((process.env.REACT_APP_API_URL || "http://localhost:1337") + `/columns/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': "application/json"
      }
    })
    .then((res) => res.json())
    .then((result) => {
        fetch((process.env.REACT_APP_API_URL || "http://localhost:1337") + "/columns")
        .then((res) => res.json())
        .then((result) => setColumns(result))
    })
  }
  const handleLogout=()=> {
    localStorage.removeItem("kanbanToken")
    history.push("/login");
  }
  const handleOpen = (id) => {
    setShow(true)
    setColumnId(id)
  };
  const handleClose = () => setShow(false);

  const getTasksByColumnId = (tasks, columnId) => {
    return tasks.filter((task) => task.column.id === columnId);
  };

  const onDragStart=(e, name, id)=> {
    e.dataTransfer.setData("label", name)
    e.dataTransfer.setData("id", id)
    console.log("start dragging", id, name)
  }

  const onDrop=(e, id)=> {
    // let data = e.dataTransfer.getData("label")
    let taskId = e.dataTransfer.getData("id")
    // console.log("data", data);
    // console.log("taskId", taskId);
    fetch((process.env.REACT_APP_API_URL || "http://localhost:1337") + `/tasks/${taskId}`,{
      method: "PUT",
      body: JSON.stringify({
        column: id
      }),
      headers: {
        'Content-Type': "application/json"
      }
    })
    .then((res) => res.json())
    .then((result) => {
        fetch((process.env.REACT_APP_API_URL || "http://localhost:1337") + "/tasks")
        .then((res) => res.json())
        .then((result) => setTasks(result))
    })
    
    // setTasks(tasks.filter(task => {
    //   if(task.label === data) {
    //     return task.column.id = id
    //   }
    //   return [...tasks, task]
    // }))

  }

  const onDragOver=(e)=> {
    e.preventDefault();
  }

  const titleCase =(str)=> {
    return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
  }


  console.log(tasks)
  return (
    <div className="App">
      <div style={{padding: 20}}>
        <Container fluid>
          <Row>
            <Col md={6}>
              <h1 className="mb-4">Simple Kanban</h1>
            </Col>
            <Col md={6}>
              <p className="d-flex align-items-center justify-content-end">Welcome <span className="text-info mx-2">{titleCase(username.user)}</span> | <Button onClick={handleLogout} id="logout" variant="link">Logout</Button></p>
            </Col>
          </Row>
          
          
          <Row>
            <Column
              data={{columns, tasks}}
              actions={{handleOpen, handleClickDeleteColumn, handleClickDeleteTask, onDragStart, onDrop, onDragOver}}
              getTasksByColumnId={getTasksByColumnId}
            />
            <Col xs="mb-4" md={3}>
            <Card 
              bg="white"
              className="rounded">
              <Button id="btn-add-column" variant="outline-light" onClick={handleClickAddColumn}>
                <div className="add-column">+</div>
                <div className="add-column-text">Add column</div>
              </Button>
            </Card>
             
            </Col>
          </Row>
          <div>
            
          </div>
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Add New Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Enter task name"
                  onChange={(e) => setValue(e.target.value)}
                />
              </Form.Group> 
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={() => handleClickAddTask(columnId)} variant="primary">Add</Button>
            </Modal.Footer>
          </Modal>
        </Container>  
      </div>
    </div>
  );
}

export default IndexPage;
