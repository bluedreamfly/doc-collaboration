import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';
import 'antd/dist/antd.css';
import App from './App';

const Main = () => {
  return <Router>
    <Route path="/" component={App}/>
  </Router>
}

ReactDOM.render(<Main />, document.getElementById('root'));
