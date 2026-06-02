import React, { createContext, useContext, useState } from 'react';
import { AuthenticatedUser } from '../services/auth-api';

type AuthContextType = {
  user: AuthenticatedUser | null;
  setUser: (user: AuthenticatedUser | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  setUser: () => {},
  token: null,
  setToken: () => {}
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
