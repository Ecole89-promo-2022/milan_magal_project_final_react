import { createContext } from 'react';

export const AuthContext = createContext({
  signIn: () => {},
  signOut: () => {},
  token: null,
  isAdmin: false,
});