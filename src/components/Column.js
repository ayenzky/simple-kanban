import { Col, Card, Button } from 'react-bootstrap'
// import Button from './Button'
import Task from './Task'
const Columns =({
	data: {columns, tasks},
	actions: {handleOpen,
		handleClickDeleteColumn,
		handleClickDeleteTask,
		onDragStart,
		onDrop,
		onDragOver},
	getTasksByColumnId
})=> {
	return (
		columns && columns.map(column => (
      <Col md={3} key={column.id} 
           className="column mb-4"
           onDrop={e => onDrop(e, column.id)}
           onDragOver={e => onDragOver(e)}
      >
      	<Card 
      		bg="dark"
      		className="rounded border-dark">
      	  <Card.Header as="h3" className="text-white">{column.label}</Card.Header>
      	  <Card.Body>
      	  	<Task
	          	tasks={tasks}
	          	actions={{
	          		handleClickDeleteTask, onDragStart
	          	}}
	          	columnId={column.id}
							getTasksByColumnId={getTasksByColumnId}
							
	          />
	          <Button variant="primary" className="mr-3" onClick={() => handleOpen(column.id)}>Add Task</Button>

	          {tasks && getTasksByColumnId(tasks, column.id).length <= 0 && (
	            <Button variant="outline-danger" onClick={() => handleClickDeleteColumn(column.id)}>Remove Column</Button>
	          )}
      	  </Card.Body>
	          
      	</Card>
          
        </Col>
    ))
	)
}
export default Columns