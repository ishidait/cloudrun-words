import React from 'react';
import { render } from 'react-dom';
import { App } from './App';
import './app.css';
import './favicon.png';

window.addEventListener('load', () => {
  render(
    <div>
      <App />
    </div>,
    document.getElementById('root')
  );
});
