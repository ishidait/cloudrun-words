import React from 'react';
import { SignInOutButton } from './SignInOutButton';

export function Header({ userName }) {
  return (
    <header className="app-header">
      <h1>CloudRun - Words</h1>
      <div className="username">{userName}</div>
      <SignInOutButton />
    </header>
  );
}
