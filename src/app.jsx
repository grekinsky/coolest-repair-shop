import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import javascriptTimeAgo from 'javascript-time-ago';
import classNames from 'classnames/bind';
import Main from './Components/Main';
import createAppStore from './store';
import styles from './app.css';

// Bind CSS classNames
const cx = classNames.bind(styles);

// Get root element
const rootEl = document.getElementById('app');
// Assign root className
rootEl.classList.add(cx('app'));

// Init App store
const history = createHistory();
const store = createAppStore({}, history);

// Setup locale
javascriptTimeAgo.locale(require('javascript-time-ago/locales/en'));
require('javascript-time-ago/intl-messageformat-global');
require('intl-messageformat/dist/locale-data/en');

const render = (Component) => {
  ReactDOM.render(
    (
      <AppContainer>
        <Component store={store} history={history} />
      </AppContainer>),
    rootEl,
  );
};

render(Main);

// Enable Hot Module Replacement
if (module.hot) module.hot.accept('./Components/Main', () => render(Main));
