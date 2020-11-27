import React from 'react'
import IndexPage from 'pages/index'
import Login from 'pages/login'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login/>
        </Route>
         <Route path="/">
          <IndexPage/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
