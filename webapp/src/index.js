import React from 'react';
import {
  BrowserRouter as Router,
  useParams,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import ReactDOM from 'react-dom';
import './styles.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router>
    <Route path="/entity/:index">
      <App />
    </Route>
  </Router>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
