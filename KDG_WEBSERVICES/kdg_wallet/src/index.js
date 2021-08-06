import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter } from 'react-router-dom';
import './assets/css/style.scss';
import { LanguageLayer } from './context/LanguageLayer';
import { initialState, reducer } from './context/reducer';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <LanguageLayer initialState={initialState} reducer={reducer}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LanguageLayer>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
