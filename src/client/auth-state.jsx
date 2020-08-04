import React, { createContext, useReducer, useEffect } from 'react';
import { init, signIn, signOut } from './google-auth';

const AuthStateContext = createContext();

function authReducer(state, action) {
  console.log('authReducer', state, action);

  switch (action.type) {
    case 'SIGN_IN': {
      const user = action.payload.user;
      const authResponse = user.getAuthResponse();
      const profile = action.payload.user.getBasicProfile();

      return {
        ...state,
        isSignedIn: true,
        userId: user.getId(),
        userName: profile.getName(),
        userEmail: profile.getEmail(),
        idToken: authResponse.id_token,
        error: null,
      };
    }
    case 'SIGN_OUT': {
      return {
        ...state,
        isSignedIn: false,
        userId: '',
        userName: '',
        userEmail: '',
        idToken: '',
        error: null,
      };
    }
    case 'AUTH_ERROR': {
      return {
        ...state,
        error: action.payload.error,
      };
    }
    default: {
      throw new Error(`Invalid action type: '${action.type}'`);
    }
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    isSignedIn: undefined,
    userId: '',
    userName: '',
    userEmail: '',
    idToken: '',
    error: null,
  });

  useEffect(() => {
    init((user, error) => {
      if (error) {
        console.error(error);
        dispatch({ type: 'AUTH_ERROR', payload: { error } });
        return;
      }

      console.log('Google API initialized. user=', user);
      if (user && user.isSignedIn()) {
        dispatch({ type: 'SIGN_IN', payload: { user } });
      } else {
        dispatch({ type: 'SIGN_OUT' });
      }
    });
  }, []);

  return (
    <AuthStateContext.Provider value={[state, dispatch]}>
      {children}
    </AuthStateContext.Provider>
  );
}

export function useAuthState() {
  const [state, dispatch] = React.useContext(AuthStateContext);
  if (state === undefined) {
    throw new Error('useAuthState must be used within AuthProvider');
  }

  function catchError(func) {
    return async (...args) => {
      try {
        await func(...args);
      } catch (error) {
        dispatch({ type: 'AUTH_ERROR', payload: { error } });
      }
    };
  }

  const actions = {
    signIn: catchError(async () => {
      const user = await signIn();
      dispatch({ type: 'SIGN_IN', payload: { user } });
    }),
    signOut: catchError(async () => {
      await signOut();
      dispatch({ type: 'SIGN_OUT' });
    }),
  };

  return [state, actions];
}
