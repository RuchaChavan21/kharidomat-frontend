import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isLoggedIn = !!token;

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

    console.log('AuthContext updated:', { token, user, isLoggedIn });
  }, [token, user, isLoggedIn]);

  const login = async (placeholderUser, authToken) => {
    try {
      setToken(authToken);
      localStorage.setItem('token', authToken);

      // Fetch full user profile using API service
      const response = await API.get('/users/profile');
      const fullUser = response.data;

      setUser(fullUser);
      localStorage.setItem('user', JSON.stringify(fullUser));
    } catch (err) {
      console.error('AuthContext login error:', err.message);
      // Don't clear token on profile fetch failure - user might still be logged in
      // Only clear if it's an authentication error
      if (err.response?.status === 401 || err.response?.status === 403) {
        setToken(null);
        setUser(null);
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      if (!token) {
        console.log('No token available for refreshUser');
        return;
      }

      const response = await API.get('/users/profile');
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      console.log('User profile refreshed successfully:', updatedUser);
    } catch (err) {
      console.error('AuthContext refreshUser error:', err.message);
      // Don't clear user/token on refresh failure, just log the error
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
