import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ShoppingBag } from 'lucide-react';
import './ShopSection.css';

const products = [
    {
        id: 1,
        name: 'UltimaFit Hoodie',
        price: '$45.00',
        img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 2,
        name: 'Pro Lifting Straps',
        price: '$25.00',
        img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 3,
        name: 'Whey Isolate 5lb',
        price: '$75.00',
        img: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 4,
        name: 'Stainless Shaker',
        price: '$15.00',
        img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=600&auto=format&fit=crop'
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', damping: 15 }
    }
};

const ShopSection = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const handleBuy = (productName) => {
        const text = encodeURIComponent(`Hi, I'm interested in buying the ${productName} from UltimaFit website.`);
        window.open(`https://wa.me/919019465897?text=${text}`, '_blank');
    };

    return (
        <section id="shop" className="shop-section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">Gear <span className="neon-text">Up</span></h2>
                    <p className="section-subtitle">
                        Official merch and supplements to elevate your performance.
                    </p>
                </motion.div>

                <motion.div
                    className="product-grid"
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            className="product-card"
                            variants={itemVariants}
                            whileHover={{
                                y: -10,
                                boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                                borderColor: "#D4AF37"
                            }}
                        >
                            <img src={product.img} alt={product.name} className="product-img" />
                            <h3 className="product-name">{product.name}</h3>
                            <span className="product-price">{product.price}</span>
                            <button
                                className="whatsapp-btn"
                                onClick={() => handleBuy(product.name)}
                            >
                                <ShoppingBag size={18} /> Buy on WhatsApp
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ShopSection;
