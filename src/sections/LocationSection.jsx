import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import './LocationSection.css';

const LocationSection = () => {
    return (
        <section id="location" className="location-section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="location-header"
                >
                    <h2 className="section-title">Find <span className="neon-text">Us</span></h2>
                    <p className="section-subtitle">Visit our premium facility. Your transformation starts here.</p>
                </motion.div>

                <div className="location-grid glass-panel">
                    <div className="location-info">
                        <div className="info-item">
                            <MapPin className="gold-icon" size={32} />
                            <div>
                                <h3>Address</h3>
                                <p>UltimaFit HQ, 123 Muscle Blvd<br />Fit City, FC 90210</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <Phone className="gold-icon" size={32} />
                            <div>
                                <h3>Phone</h3>
                                <p>+1 (555) 123-4567</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <Mail className="gold-icon" size={32} />
                            <div>
                                <h3>Email</h3>
                                <p>contact@ultimafit.com</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <Clock className="gold-icon" size={32} />
                            <div>
                                <h3>Hours</h3>
                                <p>Mon-Fri: 5am - 11pm<br />Sat-Sun: 7am - 9pm</p>
                            </div>
                        </div>
                    </div>

                    <div className="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15220.07604674393!2d78.09633857508823!3d17.506540058852305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcbefadbb674177%3A0x73d324be84803002!2sNarsimha%20Reddy%20Engineering%20College!5e0!3m2!1sen!2sin!4v1707584000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Gym Location"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LocationSection;
