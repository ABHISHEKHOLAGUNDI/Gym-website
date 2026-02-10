import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, TrendingDown } from 'lucide-react';
import './PlanSelection.css';

const PlanSelection = ({ isOpen, onClose }) => {
    const handlePlanSelect = (planType) => {
        const number = "919019465897";
        const text = encodeURIComponent(`Hi, I'm interested in joining the ${planType} plan at UltimaFit.`);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="plan-modal"
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                    >
                        <button className="close-btn" onClick={onClose}><X size={24} /></button>
                        <h2 className="modal-title">CHOOSE YOUR <span className="neon-text">PATH</span></h2>

                        <div className="plans-container">
                            <div className="plan-card gain" onClick={() => handlePlanSelect("Weight Gain / Muscle Build")}>
                                <Dumbbell size={48} className="plan-icon" />
                                <h3>MUSCLE BUILD</h3>
                                <p>Advanced hypertrophy training & high-calorie nutrition.</p>
                                <button className="btn-primary plan-btn">Select Plan</button>
                            </div>

                            <div className="plan-card loss" onClick={() => handlePlanSelect("Weight Loss / Shred")}>
                                <TrendingDown size={48} className="plan-icon" />
                                <h3>FAT SHRED</h3>
                                <p>HIIT focused cardio & macro-optimized deficit diet.</p>
                                <button className="btn-primary plan-btn">Select Plan</button>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="go-back-link" onClick={onClose}>
                                ← Go Back
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


export default PlanSelection;
