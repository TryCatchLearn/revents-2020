import React from 'react';
import ReactDOM from 'react-dom';
import './app/layout/styles.css';
import App from './app/layout/App';
import * as serviceWorker from './serviceWorker';

const rootEl = document.getElementById('root');

function render() {
  ReactDOM.render(<App />, rootEl)
}

if (module.hot) {
  module.hot.accept('./app/layout/App', function() {
    setTimeout(render);
  })
}

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
