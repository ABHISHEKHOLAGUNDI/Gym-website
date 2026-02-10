import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';
import './TransformationSection.css';

const TransformationSection = () => {
    const [sliderPos, setSliderPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleDrag = (e) => {
        if (!isDragging) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const percent = Math.min(Math.max((x / rect.width) * 100, 0), 100);
        setSliderPos(percent);
    };

    useEffect(() => {
        const stopDrag = () => setIsDragging(false);
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchend', stopDrag);
        return () => {
            window.removeEventListener('mouseup', stopDrag);
            window.removeEventListener('touchend', stopDrag);
        };
    }, []);

    return (
        <section id="transformation" className="transformation-section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="transform-header"
                >
                    <h2 className="section-title">
                        Real <span className="neon-text">Results</span>
                    </h2>
                    <p className="section-subtitle">
                        See what's possible with our elite training programs.
                    </p>
                </motion.div>

                <div
                    className="slider-container"
                    ref={containerRef}
                    onMouseMove={handleDrag}
                    onTouchMove={handleDrag}
                    onMouseDown={() => setIsDragging(true)}
                    onTouchStart={() => setIsDragging(true)}
                >
                    <div className="img-layer after-img">
                        <img src="/after.png" alt="After Transformation" />
                        <span className="label after-label">AFTER</span>
                    </div>

                    <div
                        className="img-layer before-img"
                        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                    >
                        <img src="/before.png" alt="Before Transformation" />
                        <span className="label before-label">BEFORE</span>
                    </div>

                    <div
                        className="slider-handle"
                        style={{ left: `${sliderPos}%` }}
                    >
                        <div className="handle-line"></div>
                        <div className="handle-circle">
                            <MoveHorizontal size={20} color="black" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TransformationSection;
