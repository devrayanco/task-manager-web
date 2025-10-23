import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';

interface AuthData {
  token: string;
  username: string;
  email: string;
}

interface AuthContextType {
  authData: AuthData | null;
  login: (data: AuthData) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa carregando

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      const email = localStorage.getItem('email');

      if (token && username && email) {
        setAuthData({ token, username, email });
      }
    } catch (error) {
      console.error("Falha ao carregar dados de autenticação", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (data: AuthData) => {
    setAuthData(data);
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('email', data.email);
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
  };

  const value = {
    authData,
    login,
    logout,
    isLoading, 
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};