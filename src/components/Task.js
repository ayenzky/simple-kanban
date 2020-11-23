// import Button from './Button'
import { ListGroup, Button } from 'react-bootstrap'

const Task =({
	tasks,
	actions: {onDragStart, handleClickDeleteTask},
	getTasksByColumnId,
	columnId
})=>{
	console.log("tasks", tasks)
	console.log("id", columnId)
	return (
		<ListGroup variant="flush" className="mb-3">
			{tasks && getTasksByColumnId(tasks, columnId).map(task => (
		    	<ListGroup.Item className="d-flex align-items-center rounded mb-1" variant="dark" 
		    		onDragStart={(e) => onDragStart(e, task.label, task.id)} draggable key={task.id}>
		    		<span>{task.label}</span> 
		    		<Button className="ml-auto" variant="danger" onClick={() => handleClickDeleteTask(task.id)}>Delete</Button>
		    	</ListGroup.Item>
		   ))}
		</ListGroup>
		
	)
}
export default Task