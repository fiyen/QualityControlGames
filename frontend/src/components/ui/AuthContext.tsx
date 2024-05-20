// AuthContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

export interface AuthContextType {
  visitedFirstPage: boolean;
  visitedLoginPage: boolean;
  visitedInforPage: boolean;
  visitedGamePage: boolean;
  markVisited: (page: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [visitedFirstPage, setVisitedFirstPage] = useState(false);
  const [visitedLoginPage, setVisitedLoginPage] = useState(false);
  const [visitedInforPage, setVisitedInforPage] = useState(false);
  const [visitedGamePage, setVisitedGamePage] = useState(false);
  
  const markVisited = (page: string) => {
    switch (page) {
      case "FirstPage":
        setVisitedFirstPage(true);
        break;
      case "LoginPage":
        setVisitedLoginPage(true);
        break;
      case "InforPage":
        setVisitedInforPage(true);
        break;
      case "GamePage":
        setVisitedGamePage(true);
        break;
      default:
        break;
    }
  };

  return (
    <AuthContext.Provider value={{ visitedFirstPage, visitedLoginPage, visitedInforPage, visitedGamePage, markVisited }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
