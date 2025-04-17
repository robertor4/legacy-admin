import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [isLoading, setIsLoading] = useState(true); // Prevent flicker on load

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const refresh = localStorage.getItem('refreshToken');
    setAuthToken(token);
    setRefreshToken(refresh);
    setIsLoading(false);
  }, []);

  const login = (token) => {
    // The token is already stored in localStorage by the loginUser function
    setAuthToken(token);
    setRefreshToken(localStorage.getItem('refreshToken'));
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setAuthToken(null);
    setRefreshToken(null);
  };

  const value = { 
    authToken, 
    refreshToken,
    login, 
    logout, 
    isLoading 
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
