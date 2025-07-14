import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function RootWrapper() {
  const { darkMode } = useTheme();
  return (
    <div className={darkMode ? 'dark transition-colors duration-300' : 'transition-colors duration-300'}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <RootWrapper />
    </ThemeProvider>
  </React.StrictMode>
);
