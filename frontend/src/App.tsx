import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Members from './pages/Members';
import Quizzes from './pages/Quizzes';
import AdminDashboard from './pages/AdminDashboard';
import AIBlog from './pages/AIBlog';
import WebDevBlog from './pages/WebDevBlog';
import DevOpsBlog from './pages/DevOpsBlog';
import CyberSecBlog from './pages/CyberSecBlog';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 animate-fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/members" element={<Members />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/ai" element={<AIBlog />} />
            <Route path="/web-dev" element={<WebDevBlog />} />
            <Route path="/devops" element={<DevOpsBlog />} />
            <Route path="/cyber" element={<CyberSecBlog />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;