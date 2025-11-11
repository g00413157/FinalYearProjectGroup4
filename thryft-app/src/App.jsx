import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { FirebaseProvider } from './context/FirebaseContext.jsx';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Shop from './components/Shop';
import Game from './components/Game/Game';
import Closet from './components/Closet/Closet';
import AccountWrapper from './components/Account/AccountWrapper';
import LogIn from './components/Account/LogIn';
import SplashScreen from './components/SplashScreen';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setIsAuthenticated(true);
  }, []);

  return (
    <GoogleOAuthProvider clientId="266562936456-bfessc9bropo6r396rqkmuokp8g4f0lv.apps.googleusercontent.com">
      <FirebaseProvider>
        <AuthProvider>
          {showSplash ? (
            <SplashScreen />
          ) : (
            <Routes>
              {/* Auth Route */}
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" />
                  ) : (
                    <LogIn setIsAuthenticated={setIsAuthenticated} />
                  )
                }
              />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <>
                      <Home />
                      <NavigationBar />
                    </>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/shop"
                element={
                  isAuthenticated ? (
                    <>
                      <Shop />
                      <NavigationBar />
                    </>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/game"
                element={
                  isAuthenticated ? (
                    <>
                      <Game />
                      <NavigationBar />
                    </>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/closet"
                element={
                  isAuthenticated ? (
                    <>
                      <Closet />
                      <NavigationBar />
                    </>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/account"
                element={
                  isAuthenticated ? (
                    <>
                      <AccountWrapper />
                      <NavigationBar />
                    </>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
          )}
        </AuthProvider>
      </FirebaseProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
