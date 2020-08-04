import React from 'react';
import { useAuthState } from './auth-state';

export function SignInOutButton() {
  const [state, actions] = useAuthState();
  const { isSignedIn } = state;
  const { signIn, signOut } = actions;
  if (isSignedIn === undefined) {
    return null;
  }

  return isSignedIn ? (
    <a onClick={signOut} className="sign-out">
      ログアウト
    </a>
  ) : (
    <a onClick={signIn} className="sign-in">
      ログイン
    </a>
  );
}
