import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useHistory } from "react-router-dom";


function Login() {
	const history = useHistory();
  React.useEffect(() => {
    if (localStorage.getItem("kanbanToken")) {
      history.push("/");
    }
  }, [history]);

	const handleOnSubmit =(e)=> {
		e.preventDefault();
		const form = e.currentTarget;
		const { password, identifier } = form.elements
		fetch((process.env.REACT_APP_API_URL || "http://localhost:1337") + "/auth/local", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				identifier: identifier.value,
				password: password.value
			})
		})
		.then(response => response.json())
		.then(result => {
			try {
				let user = { token: result.jwt, user: result.user.username };
				localStorage.setItem("kanbanToken", JSON.stringify(user))
				if (localStorage.getItem("kanbanToken")) {
		      history.push("/");
		    }
		    console.log(result)	
			}
			catch(err) {
				alert("Wrong email or password")
			}
			
		})
		.then(err => console.log(err))
	}

	return (
		<Container className="py-5">
			<Row className="justify-content-center align-items-center">
				<Col md={6}>
				  <div className="border p-5 rounded bg-light">
				    <h3 className="mb-5">Login</h3>
					  <form onSubmit={handleOnSubmit} action="">
							<div className="form-group">
							  <label htmlFor="identifier">Email</label>
								<input type="email" className="form-control" name="identifier"/>
							</div>
							<div className="form-group">
								<label htmlFor="password">Password</label>
								<input type="password" className="form-control" name="password"/>
							</div>
							<div className="form-group">
								<button className="btn btn-primary" type="submit">Login</button>
							</div>
						</form>
				  </div>
					
				</Col>
			</Row>
		</Container>
		
	)
}

export default Login