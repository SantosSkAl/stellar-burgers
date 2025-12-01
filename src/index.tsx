import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './components/app/app';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './services/store';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

// const basename = '/stellar-burgers'; // для gh-pages
// также для билда нужно добавить publicPath: '/stellar-burgers/' в
// output обьект вебпак конфига

root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <BrowserRouter basename={basename}> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
