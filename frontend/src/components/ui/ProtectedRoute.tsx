// ProtectedRoute.tsx
import React, { useContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext, { AuthContextType } from './AuthContext';

interface ProtectedRouteProps {
  element: ReactNode;
  condition: (context: AuthContextType) => boolean;
}

const ProtectedRoute = ({ element, condition }: ProtectedRouteProps) => {
  const context = useContext(AuthContext);

  if (!context || !condition(context)) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
