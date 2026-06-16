import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthenticatedUser } from '../services/auth-api';

type AuthContextType = {
  user: AuthenticatedUser | null;
  setUser: (user: AuthenticatedUser | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  setUser: () => {},
  token: null,
  setToken: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUserState] = useState<AuthenticatedUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@auth_user');
        const storedToken = await AsyncStorage.getItem('@auth_token');
        if (storedUser && storedToken) {
          setUserState(JSON.parse(storedUser));
          setTokenState(storedToken);
        }
      } catch (error) {
        console.error('Failed to load auth state', error);
      } finally {
        setIsInitializing(false);
      }
    };
    void loadStoredAuth();
  }, []);

  const setUser = async (newUser: AuthenticatedUser | null) => {
    setUserState(newUser);
    try {
      if (newUser) {
        await AsyncStorage.setItem('@auth_user', JSON.stringify(newUser));
      } else {
        await AsyncStorage.removeItem('@auth_user');
      }
    } catch (error) {
      console.error('Failed to save user state', error);
    }
  };

  const setToken = async (newToken: string | null) => {
    setTokenState(newToken);
    try {
      if (newToken) {
        await AsyncStorage.setItem('@auth_token', newToken);
      } else {
        await AsyncStorage.removeItem('@auth_token');
      }
    } catch (error) {
      console.error('Failed to save token state', error);
    }
  };

  const logout = async () => {
    setUserState(null);
    setTokenState(null);
    try {
      await AsyncStorage.removeItem('@auth_user');
      await AsyncStorage.removeItem('@auth_token');
    } catch (error) {
      console.error('Failed to remove auth state', error);
    }
  };
  
  if (isInitializing) {
    return null; // or a splash screen / loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
