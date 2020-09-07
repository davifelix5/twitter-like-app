import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const mainElement = document.getElementById('root')

ReactDOM.render(
  <React.StrictMode>
    <App {...mainElement.dataset} />
  </React.StrictMode>, mainElement
);
