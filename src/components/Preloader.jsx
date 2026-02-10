import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

const Preloader = ({ loading }) => {
    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                >
                    <div className="loader-text">ULTIMA</div>
                    <div className="loader-bar"></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
