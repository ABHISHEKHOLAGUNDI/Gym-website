import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose }) => {
    const handleWhatsApp = (plan) => {
        const message = `Hello UltimaFit! I'm interested in the *${plan}* membership. Please guide me through the payment process.`;
        const url = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="payment-modal-overlay">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="payment-modal"
                    >
                        <button className="close-btn" onClick={onClose}>
                            <X size={24} />
                        </button>

                        <h2 className="modal-title">Select Your <span className="neon-text">Legacy</span></h2>
                        <p className="modal-subtitle">Choose a plan to begin your transformation.</p>

                        <div className="plans-grid">
                            <div className="plan-card">
                                <h3>Warrior</h3>
                                <div className="price">₹1500<span>/mo</span></div>
                                <ul>
                                    <li><Check size={16} /> Gym Access</li>
                                    <li><Check size={16} /> Cardio Zone</li>
                                    <li><Check size={16} /> Locker Access</li>
                                </ul>
                                <button className="btn-primary" onClick={() => handleWhatsApp('Warrior Plan')}>Join Now</button>
                            </div>

                            <div className="plan-card featured">
                                <div className="badge">Best Value</div>
                                <h3>Titan</h3>
                                <div className="price">₹4000<span>/3mo</span></div>
                                <ul>
                                    <li><Check size={16} /> All Warrior Perks</li>
                                    <li><Check size={16} /> Personal Trainer (2 sessions)</li>
                                    <li><Check size={16} /> Diet Plan</li>
                                    <li><Check size={16} /> Steam Bath</li>
                                </ul>
                                <button className="btn-primary" onClick={() => handleWhatsApp('Titan Plan')}>Join Now</button>
                            </div>

                            <div className="plan-card">
                                <h3>God Mode</h3>
                                <div className="price">₹12000<span>/yr</span></div>
                                <ul>
                                    <li><Check size={16} /> All Titan Perks</li>
                                    <li><Check size={16} /> Unlimited PT</li>
                                    <li><Check size={16} /> Nutrition Supplements</li>
                                    <li><Check size={16} /> VIP Access</li>
                                </ul>
                                <button className="btn-primary" onClick={() => handleWhatsApp('God Mode Plan')}>Join Now</button>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="go-back-link" onClick={onClose}>
                                ← Go Back
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PaymentModal;
