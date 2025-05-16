import { createContext } from 'react';
import type { AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  token: '',
  loading: true,
  loginWithSSO: async () => {},
  loginWithProvider: async () => {},
  loginWithEmailAndPassword: async () => {},
  logout: async () => {},
});

AuthContext.displayName = 'kortexa.ai:auth:standalone';
