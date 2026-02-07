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

      if (authToken === 'DEMO_TOKEN') {
        const demoUser = {
          id: 'demo-user-123',
          name: 'Demo User',
          email: 'demo@kharidomat.com',
          role: 'USER',
          profileCreate: true
        };
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        console.log('Logged in as Demo User');
        return;
      }

      /*
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
      */

      // STATIC MODE: Always use demo user
      const staticUser = {
        id: 'demo-user-123',
        name: 'Demo User',
        fullName: 'Demo User',
        email: placeholderUser?.email || 'demo@kharidomat.com',
        role: 'USER',
        profileCreate: true,
        phone: '1234567890',
        prn: 'PRN123456',
        academicYear: 'Third Year'
      };
      setUser(staticUser);
      localStorage.setItem('user', JSON.stringify(staticUser));
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

  const refreshUser = async () => {
    try {
      if (!token) {
        console.log('No token available for refreshUser');
        return;
      }

      if (token === 'DEMO_TOKEN') {
        console.log('Skipping refresh for Demo User');
        return;
      }

      /*
      const res = await fetch('http://localhost:8080/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      console.log('User profile refreshed successfully:', updatedUser);
      */
      console.log('Skipping refreshUser fetch (Static Mode)');
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
