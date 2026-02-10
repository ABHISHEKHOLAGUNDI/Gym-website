import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, MessageCircle, Plus, Search, RefreshCw, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ revenue: 0, active: 0, critical: 0 });

    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMember, setNewMember] = useState({
        name: '', phone: '', plan_type: 'Muscle Build', duration_months: 1, amount_paid: ''
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('members')
            .select('*'); // We will sort manually in JS to handle dynamic calculated dates

        if (error) {
            console.error('Error fetching members:', error);
        } else {
            // Process Data: Calculate Days Left & Sort
            const processed = (data || []).map(m => {
                const start = new Date(m.start_date);
                const expiry = new Date(start);
                expiry.setMonth(start.getMonth() + m.duration_months);
                const daysLeft = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
                return { ...m, daysLeft, expiryDate: expiry };
            });

            // Sort: Critical (lowest daysLeft) first
            processed.sort((a, b) => a.daysLeft - b.daysLeft);

            setMembers(processed);
            calculateStats(processed);
        }
        setLoading(false);
    };

    const calculateStats = (data) => {
        const revenue = data.reduce((sum, m) => sum + (Number(m.amount_paid) || 0), 0);
        const active = data.length;
        const critical = data.filter(m => m.daysLeft <= 5).length;
        setStats({ revenue, active, critical });
    };

    const addMember = async (e) => {
        e.preventDefault();
        const startDate = new Date().toISOString().split('T')[0];
        const { error } = await supabase.from('members').insert([{ ...newMember, start_date: startDate }]);

        if (error) alert(error.message);
        else {
            setShowAddModal(false);
            setNewMember({ name: '', phone: '', plan_type: 'Muscle Build', duration_months: 1, amount_paid: '' });
            fetchMembers();
        }
    };

    const deleteMember = async (id) => {
        if (!window.confirm('Delete this member permanently?')) return;
        const { error } = await supabase.from('members').delete().eq('id', id);
        if (error) alert(error.message);
        else fetchMembers();
    };

    const renewMember = async (member) => {
        const newAmount = prompt(`Renew ${member.name} for another month? Enter Amount Paid:`, member.amount_paid);
        if (newAmount === null) return; // Cancelled

        const today = new Date().toISOString().split('T')[0];
        const { error } = await supabase
            .from('members')
            .update({
                start_date: today,
                amount_paid: newAmount,
                duration_months: 1 // Reset to 1 month default on renew, or keep previous? Let's default to a 1 month renewal
            })
            .eq('id', member.id);

        if (error) alert(error.message);
        else {
            alert(`Successfully renewed ${member.name}!`);
            fetchMembers();
        }
    };

    const sendWhatsApp = (member) => {
        const formattedExpiry = member.expiryDate.toLocaleDateString();
        let message = `Hello ${member.name}, your UltimaFit membership expires on ${formattedExpiry}.`;
        if (member.daysLeft < 0) message += ` It's expired! Please renew.`;
        else if (member.daysLeft <= 5) message += ` Only ${member.daysLeft} days left. Renew now!`;

        window.open(`https://wa.me/${member.phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const filtered = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.phone.includes(searchTerm)
    );

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Gym Manager <span className="highlight-gold">PRO</span></h1>
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={20} /> New Member
                </button>
            </div>

            {/* Stats Bar */}
            <div className="stats-container">
                <div className="stat-card">
                    <TrendingUp className="stat-icon gold" />
                    <div>
                        <h3>₹{stats.revenue.toLocaleString()}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
                <div className="stat-card">
                    <Users className="stat-icon blue" />
                    <div>
                        <h3>{stats.active}</h3>
                        <p>Active Members</p>
                    </div>
                </div>
                <div className="stat-card">
                    <AlertTriangle className={`stat-icon ${stats.critical > 0 ? 'red-pulse' : 'green'}`} />
                    <div>
                        <h3>{stats.critical}</h3>
                        <p>Expiring Soon</p>
                    </div>
                </div>
            </div>

            <div className="search-bar">
                <Search size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? <div className="loading">Syncing...</div> : (
                <div className="members-grid">
                    <AnimatePresence>
                        {filtered.map(member => {
                            // Determine Status Color
                            let statusClass = 'status-safe';
                            if (member.daysLeft < 0) statusClass = 'status-expired';
                            else if (member.daysLeft <= 5) statusClass = 'status-critical';
                            else if (member.daysLeft <= 10) statusClass = 'status-warning';

                            return (
                                <motion.div
                                    layout
                                    key={member.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`member-card ${statusClass}`}
                                >
                                    <div className="card-top">
                                        <div>
                                            <h3>{member.name}</h3>
                                            <span className="plan-pill">{member.plan_type}</span>
                                        </div>
                                        <div className="days-badge">
                                            {member.daysLeft < 0 ? 'EXPIRED' : `${member.daysLeft} Days`}
                                        </div>
                                    </div>

                                    <div className="card-info">
                                        <p>📱 {member.phone}</p>
                                        <p>🗓️ Ends: {member.expiryDate.toLocaleDateString()}</p>
                                    </div>

                                    <div className="card-actions">
                                        <button className="action-btn whatsapp" onClick={() => sendWhatsApp(member)} title="Send Reminder">
                                            <MessageCircle size={18} />
                                        </button>
                                        <button className="action-btn renew" onClick={() => renewMember(member)} title="Renew Subscription">
                                            <RefreshCw size={18} />
                                        </button>
                                        <button className="action-btn delete" onClick={() => deleteMember(member.id)} title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal Logic (Same as before) */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>New Member</h2>
                        <form onSubmit={addMember}>
                            <input type="text" placeholder="Name" required value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} />
                            <input type="tel" placeholder="Phone" required value={newMember.phone} onChange={e => setNewMember({ ...newMember, phone: e.target.value })} />
                            <select value={newMember.plan_type} onChange={e => setNewMember({ ...newMember, plan_type: e.target.value })}>
                                <option>Muscle Build</option>
                                <option>Fat Shred</option>
                                <option>Personal Training</option>
                            </select>
                            <input type="number" placeholder="Months" min="1" required value={newMember.duration_months} onChange={e => setNewMember({ ...newMember, duration_months: e.target.value })} />
                            <input type="number" placeholder="Amount (₹)" required value={newMember.amount_paid} onChange={e => setNewMember({ ...newMember, amount_paid: e.target.value })} />
                            <div className="modal-buttons">
                                <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
