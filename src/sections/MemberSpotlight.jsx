import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { Star, Award, Trophy } from 'lucide-react';
import './MemberSpotlight.css';

const MemberSpotlight = () => {
    const [mom, setMom] = useState(null);

    useEffect(() => {
        const fetchMom = async () => {
            const { data } = await supabase
                .from('members')
                .select('*')
                .eq('is_mom', true)
                .limit(1)
                .single();

            if (data) setMom(data);
        };
        fetchMom();
    }, []);

    if (!mom) return null; // Don't show if no one is selected

    return (
        <section className="member-spotlight-section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="spotlight-card"
                >
                    <div className="spotlight-glow"></div>
                    <div className="spotlight-icon">
                        <Trophy size={40} color="#FFD700" />
                    </div>
                    <div className="spotlight-content">
                        <h4>MEMBER OF THE MONTH</h4>
                        <h2>{mom.name}</h2>
                        <p>{mom.plan_type} • Since {new Date(mom.start_date).getFullYear()}</p>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="#FFD700" color="#FFD700" />)}
                        </div>
                        <p className="quote">"Dedication never takes a day off."</p>
                    </div>
                    <div className="spotlight-badge">
                        <Award size={24} />
                        <span>ELITE</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default MemberSpotlight;
