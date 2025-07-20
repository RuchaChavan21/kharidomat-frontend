import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage, or with default values
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('token') ? true : false;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token');
  });
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Effect to manage localStorage when token or user changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }

    // Update isLoggedIn based on token presence
    setIsLoggedIn(!!token);
    console.log('AuthContext updated:', { token, user, isLoggedIn: !!token }); // Debug log
  }, [token, user]); // Depend on token and user state

  const login = (userData, authToken) => {
    // These states will now be saved by the useEffect hook
    setToken(authToken);
    setUser(userData);
    // isLoggedIn will be updated by useEffect
  };

  const logout = () => {
    // These states will now be removed by the useEffect hook
    setToken(null);
    setUser(null);
    // isLoggedIn will be updated by useEffect
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);