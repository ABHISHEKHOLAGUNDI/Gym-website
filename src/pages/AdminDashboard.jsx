import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, MessageCircle, Plus, Search, RefreshCw, TrendingUp, Users, AlertTriangle, FileText, Download, Share2, X, Star, Gift, Megaphone, Utensils } from 'lucide-react';
import html2canvas from 'html2canvas';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ revenue: 0, active: 0, critical: 0 });
    const [birthdaysToday, setBirthdaysToday] = useState([]);

    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const receiptRef = useRef(null);

    const [newMember, setNewMember] = useState({
        name: '', phone: '', plan_type: 'Muscle Build', duration_months: 1, amount_paid: '', dob: ''
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('members')
            .select('*');

        if (error) {
            console.error('Error fetching members:', error);
        } else {
            const today = new Date();
            const todayMonth = today.getMonth();
            const todayDate = today.getDate();
            const bdays = [];

            const processed = (data || []).map(m => {
                const start = new Date(m.start_date);
                const expiry = new Date(start);
                expiry.setMonth(start.getMonth() + m.duration_months);
                const daysLeft = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));

                // Check Birthday
                if (m.dob) {
                    const dob = new Date(m.dob);
                    if (dob.getMonth() === todayMonth && dob.getDate() === todayDate) {
                        bdays.push(m);
                    }
                }

                return { ...m, daysLeft, expiryDate: expiry };
            });

            processed.sort((a, b) => a.daysLeft - b.daysLeft);
            setMembers(processed);
            calculateStats(processed);
            setBirthdaysToday(bdays);
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
            setNewMember({ name: '', phone: '', plan_type: 'Muscle Build', duration_months: 1, amount_paid: '', dob: '' });
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
        if (newAmount === null) return;

        const today = new Date().toISOString().split('T')[0];
        const { error } = await supabase
            .from('members')
            .update({
                start_date: today,
                amount_paid: newAmount,
                duration_months: 1
            })
            .eq('id', member.id);

        if (error) alert(error.message);
        else {
            alert(`Successfully renewed ${member.name}!`);
            fetchMembers();
        }
    };

    const toggleMoM = async (member) => {
        // Toggle is_mom status
        const newVal = !member.is_mom;
        const { error } = await supabase
            .from('members')
            .update({ is_mom: newVal })
            .eq('id', member.id);

        if (error) alert(error.message);
        else {
            if (newVal) alert(`${member.name} is now Member of the Month! 🏆`);
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

    const sendDietPlan = (member, type) => {
        let planLink = "";
        let planTitle = "";

        if (type === 'muscle') {
            planTitle = "Muscle Gain Plan";
            planLink = "https://tinyurl.com/ultima-muscle"; // Placeholder
        } else if (type === 'fatloss') {
            planTitle = "Fat Loss Plan";
            planLink = "https://tinyurl.com/ultima-fatloss"; // Placeholder
        } else {
            planTitle = "Lean & Fit Plan";
            planLink = "https://tinyurl.com/ultima-lean"; // Placeholder
        }

        const msg = `Hello ${member.name}! 🥗\nHere is your *${planTitle}* from UltimaFit:\n${planLink}\n\nStay consistent! 💪`;
        window.open(`https://wa.me/${member.phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const sendBulkAlert = () => {
        const msg = prompt("Enter functionality Broadcast Message (e.g., 'Gym closed tomorrow'):");
        if (!msg) return;

        // Collect all phones
        const phones = members.map(m => m.phone).join(',');
        // This is a rough workaround as "Multiple tabs" gets blocked.
        // Better PRO approach: Copy to clipboard.

        navigator.clipboard.writeText(phones).then(() => {
            alert("⚠️ Bulk Message Strategy:\n\n1. I have COPIED all member phone numbers to your clipboard.\n2. Create a 'Broadcast List' in WhatsApp.\n3. Paste the numbers there.\n\nThen send this message: " + msg);
        });
    };

    // Receipt Functions (Same as before)
    const openReceipt = (member) => { setSelectedMember(member); setShowReceiptModal(true); };
    const shareReceipt = async () => { /* ... existing share logic ... */
        if (!receiptRef.current) return;
        try {
            const canvas = await html2canvas(receiptRef.current, { backgroundColor: '#000000', scale: 2 });
            canvas.toBlob(async (blob) => {
                if (!blob) return;
                const file = new File([blob], `Receipt.png`, { type: 'image/png' });
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({ files: [file], title: 'UltimaFit Receipt', text: `Payment Receipt for ${selectedMember.name}` });
                } else {
                    const link = document.createElement('a'); link.download = file.name; link.href = canvas.toDataURL(); link.click();
                    alert("Image Downloaded! Attach manually on WhatsApp.");
                    window.open(`https://wa.me/${selectedMember.phone}?text=${encodeURIComponent("Here is your receipt!")}`, '_blank');
                }
            });
        } catch (err) { alert('Failed to generate receipt.'); }
    };

    const filtered = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.phone.includes(searchTerm));

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Gym Manager <span className="highlight-gold">PRO+</span></h1>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={sendBulkAlert} style={{ marginRight: '10px' }}>
                        <Megaphone size={18} /> Bulk Alert
                    </button>
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <Plus size={20} /> New Member
                    </button>
                </div>
            </div>

            {/* Birthday Alert */}
            {birthdaysToday.length > 0 && (
                <div className="birthday-banner">
                    <Gift className="type-pulse" size={24} />
                    <span>Birthdays Today: {birthdaysToday.map(m => m.name).join(', ')} - Wish them now! 🎂</span>
                </div>
            )}

            {/* Stats Bar */}
            <div className="stats-container">
                <div className="stat-card">
                    <TrendingUp className="stat-icon gold" />
                    <div><h3>₹{stats.revenue.toLocaleString()}</h3><p>Total Revenue</p></div>
                </div>
                <div className="stat-card">
                    <Users className="stat-icon blue" />
                    <div><h3>{stats.active}</h3><p>Active Members</p></div>
                </div>
                <div className="stat-card">
                    <AlertTriangle className={`stat-icon ${stats.critical > 0 ? 'red-pulse' : 'green'}`} />
                    <div><h3>{stats.critical}</h3><p>Expiring Soon</p></div>
                </div>
            </div>

            <div className="search-bar">
                <Search size={20} className="search-icon" />
                <input type="text" placeholder="Search members..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>

            {loading ? <div className="loading">Syncing...</div> : (
                <div className="members-grid">
                    <AnimatePresence>
                        {filtered.map(member => {
                            let statusClass = 'status-safe';
                            if (member.daysLeft < 0) statusClass = 'status-expired';
                            else if (member.daysLeft <= 5) statusClass = 'status-critical';
                            else if (member.daysLeft <= 10) statusClass = 'status-warning';

                            return (
                                <motion.div
                                    layout key={member.id}
                                    className={`member-card ${statusClass} ${member.is_mom ? 'mom-glow' : ''}`}
                                >
                                    {member.is_mom && <div className="mom-badge"><Star size={12} fill="black" /> STAR MEMBER</div>}

                                    <div className="card-top">
                                        <div>
                                            <h3>{member.name} {member.is_mom && '⭐'}</h3>
                                            <span className="plan-pill">{member.plan_type}</span>
                                        </div>
                                        <div className="days-badge">
                                            {member.daysLeft < 0 ? 'EXPIRED' : `${member.daysLeft} Days`}
                                        </div>
                                    </div>

                                    <div className="card-info">
                                        <p>📱 {member.phone}</p>
                                        <p>🗓️ Ends: {member.expiryDate.toLocaleDateString()}</p>
                                        {member.dob && <p>🎂 DOB: {new Date(member.dob).toLocaleDateString()}</p>}
                                    </div>

                                    <div className="card-actions-grid">
                                        <button className="action-btn whatsapp" onClick={() => sendWhatsApp(member)} title="Remind"><MessageCircle size={16} /></button>
                                        <button className="action-btn receipt" onClick={() => openReceipt(member)} title="Bill"><FileText size={16} /></button>
                                        <button className="action-btn renew" onClick={() => renewMember(member)} title="Renew"><RefreshCw size={16} /></button>

                                        {/* New Features */}
                                        <button className={`action-btn mom ${member.is_mom ? 'active' : ''}`} onClick={() => toggleMoM(member)} title="Make Member of Month">
                                            <Star size={16} />
                                        </button>

                                        <div className="diet-dropdown">
                                            <button className="action-btn diet" title="Send Diet Plan"><Utensils size={16} /></button>
                                            <div className="diet-content">
                                                <span onClick={() => sendDietPlan(member, 'muscle')}>💪 Muscle</span>
                                                <span onClick={() => sendDietPlan(member, 'fatloss')}>🔥 Fat Loss</span>
                                                <span onClick={() => sendDietPlan(member, 'lean')}>🥗 Lean</span>
                                            </div>
                                        </div>

                                        <button className="action-btn delete" onClick={() => deleteMember(member.id)} title="Delete"><Trash2 size={16} /></button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>New Member</h2>
                        <form onSubmit={addMember}>
                            <input type="text" placeholder="Name" required value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} />
                            <input type="tel" placeholder="Phone" required value={newMember.phone} onChange={e => setNewMember({ ...newMember, phone: e.target.value })} />

                            <label style={{ fontSize: '0.8rem', color: '#888' }}>Date of Birth (Optional for Birthday Wishes)</label>
                            <input type="date" value={newMember.dob} onChange={e => setNewMember({ ...newMember, dob: e.target.value })} />

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

            {/* Receipt Modal (Same as existing) */}
            {showReceiptModal && selectedMember && (
                <div className="modal-overlay">
                    <div className="receipt-modal-content">
                        <button className="close-btn" onClick={() => setShowReceiptModal(false)}><X size={20} /></button>
                        <div ref={receiptRef} className="receipt-paper">
                            {/* ... Receipt Rendering ... */}
                            <div className="receipt-header"><h2>ULTIMA<span className="highlight">FIT</span></h2><p>OFFICIAL RECEIPT</p></div>
                            <div className="receipt-body">
                                <div className="receipt-row"><span>Member:</span><strong>{selectedMember.name}</strong></div>
                                <div className="receipt-row"><span>Plan:</span><strong>{selectedMember.plan_type}</strong></div>
                                <div className="receipt-row"><span>Duration:</span><strong>{selectedMember.duration_months} Month(s)</strong></div>
                                <div className="receipt-row"><span>Valid Until:</span><strong>{selectedMember.expiryDate.toLocaleDateString()}</strong></div>
                                <div className="receipt-divider"></div>
                                <div className="receipt-total"><span>AMOUNT PAID</span><span className="amount">₹{selectedMember.amount_paid}</span></div>
                                <div className="receipt-status">PAID ✅</div>
                            </div>
                            <div className="receipt-footer"><p>Thank you for training with us!</p><p className="small">Generated on {new Date().toLocaleDateString()}</p></div>
                        </div>
                        <div className="receipt-actions">
                            <button className="btn-whatsapp" onClick={shareReceipt} style={{ width: '100%', justifyContent: 'center' }}><Share2 size={18} /> Share Receipt</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
