import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './GymSection.css';

const features = [
    {
        id: 1,
        title: 'Strength Training',
        desc: 'Build raw power with our state-of-the-art free weights and resistance machines.',
        img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 2,
        title: 'HIIT & Cardio',
        desc: 'Burn calories fast in our high-intensity zones equipped with smart treadmills.',
        img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 3,
        title: 'Yoga & Recovery',
        desc: 'Find your balance and recover faster in our dedicated mindfulness studios.',
        img: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 4,
        title: 'Personal Training',
        desc: 'Get customized plans from elite trainers to fast-track your results.',
        img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop'
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 60 }
    }
};

const GymSection = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    return (
        <section id="gym" className="gym-section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">The <span className="neon-text">Arena</span></h2>
                    <p className="section-subtitle">
                        Where champions are forged. Access world-class equipment and expert guidance.
                    </p>
                </motion.div>

                <motion.div
                    className="gym-grid"
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.id}
                            className="gym-card glass-panel"
                            variants={itemVariants}
                            whileHover={{
                                scale: 1.05,
                                rotate: 1,
                                boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)"
                            }}
                        >
                            <div
                                className="card-bg"
                                style={{ backgroundImage: `url(${feature.img})` }}
                            />
                            <div className="card-overlay">
                                <h3 className="card-title">{feature.title}</h3>
                                <p className="card-desc">{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default GymSection;
