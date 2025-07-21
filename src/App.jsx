import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import Items from './pages/Items';
import ItemDetails from './pages/ItemDetails';
import BookingDetails from './pages/BookingDetails';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import Wishlist from './pages/Wishlist';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import PostItem from './pages/PostItem';
import BookOrRentItem from './pages/BookItem';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import { useAuth } from './context/AuthContext';
import RecentListings from './pages/RecentListings';
import Chat from './pages/Chat';
import EditProfile from './pages/EditProfile';

function PublicHomeRoute() {
  // Always show Home page, regardless of login state
  return <Home />;
}

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PublicHomeRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<PrivateRoute><ResetPassword /></PrivateRoute>} />
        <Route path="/items" element={<Items />} />
        <Route path="/item/:itemId" element={<ItemDetails />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/bookings/item/:itemId" element={<PrivateRoute><BookOrRentItem /></PrivateRoute>} />
        <Route path="/booking/:bookingId" element={<PrivateRoute><BookingDetails /></PrivateRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
        <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
        <Route path="/post-item" element={<PrivateRoute><PostItem /></PrivateRoute>} />
        <Route path="/items/add" element={<PrivateRoute><PostItem /></PrivateRoute>} />
        <Route path="/book-item/:itemId" element={<PrivateRoute><BookOrRentItem /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/recent-listings" element={<RecentListings />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
