import React from 'react';
import { Instagram, Twitter, Facebook, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    const handleAdminAccess = () => {
        const pin = prompt("Enter Admin PIN:");
        if (pin === "1234") { // Simple PIN for now
            navigate('/admin');
        } else if (pin !== null) {
            alert("Incorrect PIN");
        }
    };

    return (
        <footer style={{ background: '#050505', padding: '4rem 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                <h2 className="logo" style={{ marginBottom: 0 }}>ULTIMA<span className="highlight">FIT</span></h2>

                <div style={{ display: 'flex', gap: '2rem' }}>
                    {[Instagram, Twitter, Facebook, Mail].map((Icon, i) => (
                        <a key={i} href="#" style={{ color: '#fff', opacity: 0.7, transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}>
                            <Icon size={24} />
                        </a>
                    ))}
                </div>

                <div style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <p>© 2024 UltimaFit. All rights reserved.</p>
                    <p>Designed with power.</p>

                    {/* Hidden Admin Button */}
                    {/* Hidden Admin Button */}
                    <button
                        onClick={handleAdminAccess}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.1)', // Subtle border
                            borderRadius: '5px',
                            cursor: 'pointer',
                            opacity: 0.3, // Increased opacity from 0.1
                            color: '#555', // Slightly lighter color
                            transition: 'all 0.3s',
                            marginTop: '1rem',
                            padding: '5px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.color = '#e74c3c';
                            e.currentTarget.style.borderColor = '#e74c3c';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '0.3';
                            e.currentTarget.style.color = '#555';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        }}
                        title="Owner Access - Click Here"
                    >
                        <Lock size={12} /> <span style={{ fontSize: '0.7rem' }}>Admin Login</span>
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
