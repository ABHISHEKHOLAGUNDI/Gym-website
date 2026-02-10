import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import HeroSection from './sections/HeroSection';
import GymSection from './sections/GymSection';

import MemberSpotlight from './sections/MemberSpotlight';
import BMISection from './sections/BMISection';
import TransformationSection from './sections/TransformationSection';
import LocationSection from './sections/LocationSection';
import CafeSection from './sections/CafeSection';
import ShopSection from './sections/ShopSection';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import PlanSelection from './components/PlanSelection';
import AdminDashboard from './pages/AdminDashboard';

// This is the main landing page with all the animations and sections
const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const [showPlans, setShowPlans] = useState(false);

  useEffect(() => {
    // Smooth Scroll Setup
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Fake loading time for preloader
    setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Preloader loading={loading} />
      <div className="app">
        <Navbar onJoinClick={() => setShowPlans(true)} />
        <main>
          <HeroSection onJoinClick={() => setShowPlans(true)} />
          <MemberSpotlight />
          <GymSection />
          <CafeSection />
          <ShopSection />

          <BMISection />
          <TransformationSection />
          <LocationSection />
        </main>
        {/* Footer Section */}
        <Footer />
        <PlanSelection isOpen={showPlans} onClose={() => setShowPlans(false)} />
      </div>
    </>
  );
};

// Main App Component with Routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
