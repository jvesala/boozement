import { hydrateRoot } from 'react-dom/client';

import './index.css';
import { App } from './App';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { configureStoreWithState } from './app/store';

declare global {
  interface Window {
    __PRELOADED_STATE__: any;
  }
}
const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

const store = configureStoreWithState(preloadedState);

store.subscribe(() => {
  console.log('STATE', store.getState());
});

const domNode = document.getElementById('root')!;
hydrateRoot(
  domNode,
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
);
