import React from 'react';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer = () => {
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

                <div style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>
                    <p>© 2024 UltimaFit. All rights reserved.</p>
                    <p style={{ marginTop: '0.5rem' }}>Designed with power.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
