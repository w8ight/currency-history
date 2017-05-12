import './styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

ReactDOM.render(
    <App initialState={window.__INITIAL_STATE__}/>,
    document.getElementById('root')
);