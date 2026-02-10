import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import './BMISection.css';

const BMISection = () => {
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(70);

    const calculateBMI = () => {
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    };

    const getBMIStatus = (bmi) => {
        if (bmi < 18.5) return { status: 'Underweight', color: '#3498db' };
        if (bmi < 25) return { status: 'Healthy', color: '#2ecc71' };
        if (bmi < 30) return { status: 'Overweight', color: '#f1c40f' };
        return { status: 'Obese', color: '#e74c3c' };
    };

    const bmi = calculateBMI();
    const { status, color } = getBMIStatus(bmi);

    return (
        <section id="bmi" className="bmi-section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bmi-container glass-panel"
                >
                    <div className="bmi-content">
                        <h2 className="section-title" style={{ textAlign: 'left', fontSize: '2.5rem' }}>
                            Iron <span className="neon-text">Intelligence</span>
                        </h2>
                        <p className="section-subtitle" style={{ textAlign: 'left', margin: '0 0 2rem 0' }}>
                            Calculate your body mass index to plan your transformation journey.
                        </p>

                        <div className="input-group">
                            <label>Height: <span className="gold-text">{height} cm</span></label>
                            <input
                                type="range"
                                min="140"
                                max="220"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="gold-slider"
                            />
                        </div>

                        <div className="input-group">
                            <label>Weight: <span className="gold-text">{weight} kg</span></label>
                            <input
                                type="range"
                                min="40"
                                max="150"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="gold-slider"
                            />
                        </div>
                    </div>

                    <div className="bmi-result">
                        <div className="result-circle">
                            <span className="bmi-value">{bmi}</span>
                            <span className="bmi-label">BMI</span>
                        </div>
                        <h3 className="status-text" style={{ color: color }}>{status}</h3>
                        <p className="status-desc">
                            Target Range: <strong>18.5 - 24.9</strong>
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default BMISection;
