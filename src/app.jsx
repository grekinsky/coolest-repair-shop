import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import Main from './Components/Main';
import styles from './app.css';

const cx = classNames.bind(styles);

const rootEl = document.getElementById('app');
rootEl.classList.add(cx('app'));

const render = (Component) => {
  ReactDOM.render(
    (
      <AppContainer>
        <Component />
      </AppContainer>),
    rootEl,
  );
};

render(Main);

if (module.hot) module.hot.accept('./Components/Main', () => render(Main));
