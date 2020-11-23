import React, { useState } from 'react'
// import Container from './components/Container'
// import Button from './components/Button'
import Column from './components/Column'
import { Row, Container, Col, Button, Modal, Form } from 'react-bootstrap'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const initialColumns = [
  {
    id: "todo",
    label: "Todo"
  },
  {
    id: "in-progress",
    label: "In Progress"
  },
  {
    id: "completed",
    label: "Completed"
  }
]

const initialTasks = [
  {
    id: "buy-egss",
    label:  "Buy eggs",
    column: "todo",
    order: 0
  },
   {
    id: "cook-dinner",
    label:  "Cook dinner",
    column: "todo",
    order: 1
  },
  {
    id: "creating-mockup",
    label:  "Creating mockup",
    column: "in-progress",
    order: 2
  },

]

function App() {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");
  const [columnId, setColumnId] = useState(null);
  const [columns, setColumns] = useState(null)
  const [tasks, setTasks] = useState(null)

  React.useEffect(() => {
    fetch((process.env.API_URL || 'http://localhost:1337') + "/columns")
      .then((res) => res.json())
      .then((result) => setColumns(result))

    fetch((process.env.API_URL || 'http://localhost:1337') + "/tasks")
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
      fetch((process.env.API_URL || 'http://localhost:1337') + "/columns", {
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
      fetch((process.env.API_URL || 'http://localhost:1337') + "/tasks", {
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
    fetch((process.env.API_URL || 'http://localhost:1337') + `/tasks/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': "application/json"
      }
    })
    .then((res) => res.json())
    .then((result) => {
        fetch((process.env.API_URL || 'http://localhost:1337') + "/tasks")
        .then((res) => res.json())
        .then((result) => setTasks(result))
    })
  }
  const handleClickDeleteColumn = (id) => {
    // setColumns(columns.filter(column => column.id !== id))
    fetch((process.env.API_URL || 'http://localhost:1337') + `/columns/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': "application/json"
      }
    })
    .then((res) => res.json())
    .then((result) => {
        fetch((process.env.API_URL || 'http://localhost:1337') + "/columns")
        .then((res) => res.json())
        .then((result) => setColumns(result))
    })
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
    let data = e.dataTransfer.getData("label")
    let taskId = e.dataTransfer.getData("id")
    // console.log("data", data);
    // console.log("taskId", taskId);
    fetch((process.env.API_URL || 'http://localhost:1337') + `/tasks/${taskId}`,{
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
        fetch((process.env.API_URL || 'http://localhost:1337') + "/tasks")
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


  console.log(tasks)
  return (
    <div className="App">
      <div style={{padding: 20}}>
        <Container fluid>
          <h1 className="mb-4">Simple Kanban</h1>
          <Row>
            <Column
              data={{columns, tasks}}
              actions={{handleOpen, handleClickDeleteColumn, handleClickDeleteTask, onDragStart, onDrop, onDragOver}}
              getTasksByColumnId={getTasksByColumnId}
            />
            <Col xs="auto">
              <Button variant="outline-secondary" onClick={handleClickAddColumn}>Add new column</Button>  
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

export default App;
