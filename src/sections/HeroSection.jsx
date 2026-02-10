import React from 'react';
import { motion } from 'framer-motion';
import './HeroSection.css';

const HeroSection = ({ onJoinClick }) => {
    return (
        <section id="home" className="hero-section">
            {/* Video Background */}
            <div className="video-bg-container">
                <video autoPlay loop muted playsInline className="hero-video">
                    <source src="/video1.webm" type="video/webm" />
                </video>
                <div className="video-overlay"></div>
            </div>

            <div className="container hero-content">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 className="hero-title">
                        FORGE <br />
                        <span className="neon-text">LEGENDS</span>
                    </h1>

                    <button
                        className="btn-primary hero-btn"
                        onClick={onJoinClick}
                    >
                        VIEW PLANS
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
