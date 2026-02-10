import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

import './Navbar.css';

const Navbar = ({ onJoinClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJoinClick = () => {
    setIsOpen(false);
    onJoinClick();
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <a href="#" className="logo">ULTIMA<span className="highlight">FIT</span></a>

          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
            <li><a href="#home" onClick={() => setIsOpen(false)}>Home</a></li>
            <li><a href="#gym" onClick={() => setIsOpen(false)}>Gym</a></li>
            <li><a href="#schedule" onClick={() => setIsOpen(false)}>Schedule</a></li>
            <li><a href="#bmi" onClick={() => setIsOpen(false)}>BMI</a></li>
            <li><a href="#cafeteria" onClick={() => setIsOpen(false)}>Cafe</a></li>
            <li><a href="#location" onClick={() => setIsOpen(false)}>Location</a></li>
            <li><a href="#shop" onClick={() => setIsOpen(false)}>Shop</a></li>
            <li><button className="btn-primary" onClick={handleJoinClick}>Join Now</button></li>
          </ul>
        </div>
      </nav>

    </>
  );
};

export default Navbar;
