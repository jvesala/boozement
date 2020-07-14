import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import { configureStoreWithState } from './app/store';

// @ts-ignore
const preloadedState = window.__PRELOADED_STATE__
// @ts-ignore
delete window.__PRELOADED_STATE__

const store = configureStoreWithState(preloadedState)

store.subscribe(() => {
    console.log('STATE', store.getState());
});

ReactDOM.hydrate(
  <Provider store={store}>
     <Router>
         <App />
     </Router>
  </Provider>,
 document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
