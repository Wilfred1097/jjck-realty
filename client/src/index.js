import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';

const root = createRoot(document.getElementById('root'));

// A simple function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null; // Adjust the condition based on your actual token logic
};

// Custom route element for private routes
const PrivateRoute = ({ element, path }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<PrivateRoute element={<Homepage />} />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
