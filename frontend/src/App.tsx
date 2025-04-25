import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Members from './pages/Members';
import Quizzes from './pages/Quizzes';
import { LeaderboardPage } from './pages/LeaderboardPage';
import AdminDashboard from './pages/AdminDashboard';
import AIBlog from './pages/AIBlog';
import WebDevBlog from './pages/WebDevBlog';
import DevOpsBlog from './pages/DevOpsBlog';
import CyberSecBlog from './pages/CyberSecBlog';
import Login from './pages/Login';
import Register from './pages/register';
import ProfilePage from './pages/Profile';
import AdminLogin from './pages/AdminLoginPage';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setLoading(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  // Define paths where Navbar should be hidden
  const hideNavbarOnRoutes = ['/login', '/register', '/adminlogin'];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!hideNavbarOnRoutes.includes(location.pathname) && isAuthenticated && <Navbar />}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 animate-fade-in">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/members" element={<Members />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/ai" element={<AIBlog />} />
          <Route path="/web-dev" element={<WebDevBlog />} />
          <Route path="/devops" element={<DevOpsBlog />} />
          <Route path="/cyber" element={<CyberSecBlog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default AppWrapper;
