import React from 'react';
import { render } from 'react-dom';
import { App } from './App';
import { AuthProvider } from './auth-state';
import './app.css';
import './favicon.png';

let started = false;

function startApp() {
  if (started) return;

  if (!window.gapi) {
    setTimeout(() => startApp, 100);
    return;
  }

  render(
    <AuthProvider>
      <App />
    </AuthProvider>,
    document.getElementById('root')
  );

  started = true;
}

window.addEventListener('load', startApp);
