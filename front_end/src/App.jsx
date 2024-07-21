import React, { useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/home/HomePage';
import { SignUpPage } from './pages/auth/signup/SignUpPage';
import { SignInPage } from './pages/auth/sigin/SignInPage';
import {Sidebar} from './components/common/Sidebar'
import {RightPanel} from './components/common/RightPannel'
import { NotificationPage } from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
       {/* common components are not the part of route  */}
      <Sidebar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path='/notifications' element={<NotificationPage/>} />
        <Route path='/profile/:username' element={<ProfilePage/>} />
      </Routes>
      <RightPanel/>
    </>
  );
}

export default App;
