import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Utensils } from 'lucide-react';
import './CafeSection.css';

const menuItems = [
    {
        id: 1,
        name: 'Power Protein Shake',
        price: '$8.50',
        desc: 'Whey protein, banana, almond milk, peanut butter.',
        img: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 2,
        name: 'Acai Super Bowl',
        price: '$12.00',
        desc: 'Organic acai, house-made granola, fresh berries, honey.',
        img: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 3,
        name: 'Keto Grilled Chicken',
        price: '$15.00',
        desc: 'Herb-grilled chicken breast, avocado, mixed greens.',
        img: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=600&auto=format&fit=crop'
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 50 }
    }
};

const CafeSection = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const handleOrder = (itemName) => {
        const text = encodeURIComponent(`Hi, I'd like to order the ${itemName} from the Cafe menu.`);
        window.open(`https://wa.me/919019465897?text=${text}`, '_blank');
    };

    return (
        <section id="cafeteria" className="cafe-section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="section-title">Fuel <span className="neon-text">Station</span></h2>
                    <p className="section-subtitle">
                        Premium nutrition to maximize your gains and recovery.
                    </p>
                </motion.div>

                <motion.div
                    className="menu-grid"
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                    {menuItems.map((item) => (
                        <motion.div
                            key={item.id}
                            className="menu-item"
                            variants={itemVariants}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 0 25px rgba(212, 175, 55, 0.3)",
                                y: -10
                            }}
                        >
                            <div className="img-container">
                                <img src={item.img} alt={item.name} className="menu-img" />
                                <div className="img-overlay"></div>
                            </div>
                            <div className="menu-content">
                                <div className="menu-header">
                                    <h3 className="menu-title">{item.name}</h3>
                                    <span className="menu-price">{item.price}</span>
                                </div>
                                <p className="menu-desc">{item.desc}</p>
                                <button
                                    className="order-btn"
                                    onClick={() => handleOrder(item.name)}
                                >
                                    <Utensils size={16} className="mr-2" /> Order Now
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default CafeSection;
