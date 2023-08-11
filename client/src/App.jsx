import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import IndexPage from './pages/indexpage';
import LoginPage from './pages/loginpage';
import Layout from './layout';
import RegisterPage from './pages/registerpage';
import AdminPanel from './pages/adminpage';
import { UserContextProvider } from './usercontext';
import ProfilePage from './pages/profilepage';
import PlacesPage from './pages/placespage';
import PlacesFormPage from './pages/placesformpage';
import AccountPage from './pages/profilepage';
import PlacePage from './pages/placepage';
import BookingsPage from './pages/bookingspage';
import BookingPage from './pages/bookingpage';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials=true;
function App() {
  
  return (
    <UserContextProvider>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<ProfilePage/>} />
        <Route path="/account/places" element={<PlacesPage/>} />
        <Route path="/account/places/new" element={<PlacesFormPage/>} />
        <Route path="/account/places/:place_id" element={<PlacesFormPage/>} />
        <Route path="/place/:place_id" element={<PlacePage/>}/>
        <Route path="/account/bookings" element={<BookingsPage/>}/>
        <Route path="/account/bookings/:booking_id" element={<BookingPage/>}/>
        <Route path="/admin/*" element={<AdminPanel />} />
      </Route>
    </Routes>
    </UserContextProvider>
  );
}

export default App;
