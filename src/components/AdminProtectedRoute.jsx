import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../context/Authcontext';

export const AdminProtectedRoute = ({ children }) => {
  const { user } = useUserAuth();
  
  if (!user || !user.email.endsWith('@admin.com')) {
    return <Navigate to="/admin-login" />;
  }
  
  return children;
};