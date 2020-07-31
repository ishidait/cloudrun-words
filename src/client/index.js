import React from 'react';
import { render } from 'react-dom';
import { App } from './App';
import { AuthProvider } from './auth-state';
import './app.css';
import './favicon.png';

window.addEventListener('load', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>,
    document.getElementById('root')
  );
});
