import React, { createContext, useContext, useState, useEffect } from 'react';

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

      // Fetch full user profile
      const res = await fetch('http://localhost:8080/api/users/profile', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch user profile');
      const fullUser = await res.json();

      setUser(fullUser);
      localStorage.setItem('user', JSON.stringify(fullUser));
    } catch (err) {
      console.error('AuthContext login error:', err.message);
      setToken(null);
      setUser(null);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
