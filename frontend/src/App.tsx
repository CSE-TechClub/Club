import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Blogs from './pages/Blogs';
import CreateBlog from './pages/CreateBlog';
import BlogDetails from './pages/BlogDetails';

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
  const navigate = useNavigate();

  const publicRoutes = ['/login', '/register', '/adminlogin', '/reset-password', '/forgot-password'];

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setLoading(false);

      if (!data.session && !publicRoutes.includes(location.pathname)) {
        navigate('/login');
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);

      if (!session && !publicRoutes.includes(location.pathname)) {
        navigate('/login');
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [location.pathname, navigate]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  const hideNavbarOnRoutes = ['/login', '/register', '/adminlogin', '/reset-password', '/forgot-password'];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!hideNavbarOnRoutes.includes(location.pathname) && <Navbar />}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 animate-fade-in">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/members" element={<Members />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/ai" element={<AIBlog />} />
          <Route path="/web-dev" element={<WebDevBlog />} />
          <Route path="/devops" element={<DevOpsBlog />} />
          <Route path="/cyber" element={<CyberSecBlog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default AppWrapper;
