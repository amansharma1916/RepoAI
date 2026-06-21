import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WordMarquee from './components/WordMarquee';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Demo from './components/Demo';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Legal from './components/Legal';
import About from './components/About';
import Login from './components/login/LoginPage';
import Register from './components/register/RegisterPage';
import ProtectedRoute from './protection/ProtectedRoute';
import PublicLayout from './protection/PublicLayout';
import Dashboard from './components/dashboard/Dashboard';
import { Routes, Route } from 'react-router-dom';

function HomePage() {
  return (
    <>
      <Hero />
      <WordMarquee />
      <Features />
      <HowItWorks />
      <Demo />
    </>
  );
}


function App() {
  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-x-hidden">
      <Routes>
        <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/about" element={<About />} />
        </Route>


        <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
        </Route>




      </Routes>
    </div>
  );
}

export default App;
