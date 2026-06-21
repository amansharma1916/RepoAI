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
import { Routes, Route } from 'react-router-dom';




function App() {
  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-x-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <WordMarquee />
            <Features />
            <HowItWorks />
            <Demo />
          </>
        } />
        <Route path="/legal" element={<Legal />} />
        <Route path="/about" element={<About />} />
        
      </Routes>
      {/* <CTA /> */}
      <Footer />
    </div>
  );
}

export default App;
