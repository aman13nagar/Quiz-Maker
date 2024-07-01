// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isLoggedIn());

  const login = async (email, password) => {
    await authService.login(email, password);
    setIsLoggedIn(true);
  };

  const signup = async (firstName, lastName, email, password) => {
    await authService.signup(firstName, lastName, email, password);
    setIsLoggedIn(true);
  };

  const logout = () => {
    authService.logout();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
