import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import Login from './pages/Login';
import Register from './pages/Register';
import ViewAllListings from './pages/Listings';
import MyAccount from './pages/account';
import LotDetailsPage from './pages/LotDetails';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings" element={<ViewAllListings />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/lot-details/:lot_Id" element={<LotDetailsPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
