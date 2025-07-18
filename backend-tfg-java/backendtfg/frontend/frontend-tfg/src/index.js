import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,    
      document.getElementById('root'),
    );


