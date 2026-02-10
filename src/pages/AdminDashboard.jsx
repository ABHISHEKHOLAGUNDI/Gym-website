import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { Trash2, MessageCircle, Plus, Search } from 'lucide-react';
import './AdminDashboard.css'; // We will create this next

const AdminDashboard = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [newMember, setNewMember] = useState({
        name: '',
        phone: '',
        plan_type: 'Muscle Build',
        duration_months: 1,
        amount_paid: ''
    });
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching members:', error);
        else setMembers(data || []);
        setLoading(false);
    };

    const addMember = async (e) => {
        e.preventDefault();
        const startDate = new Date().toISOString().split('T')[0]; // Today: YYYY-MM-DD

        const { error } = await supabase
            .from('members')
            .insert([{
                ...newMember,
                start_date: startDate
            }]);

        if (error) {
            alert('Error adding member: ' + error.message);
        } else {
            setShowAddModal(false);
            setNewMember({ name: '', phone: '', plan_type: 'Muscle Build', duration_months: 1, amount_paid: '' });
            fetchMembers();
        }
    };

    const deleteMember = async (id) => {
        if (!window.confirm('Are you sure you want to delete this member?')) return;

        const { error } = await supabase
            .from('members')
            .delete()
            .eq('id', id);

        if (error) alert('Error deleting: ' + error.message);
        else fetchMembers();
    };

    const sendWhatsApp = (member) => {
        const startDate = new Date(member.start_date);
        const expiryDate = new Date(startDate);
        expiryDate.setMonth(startDate.getMonth() + member.duration_months);

        const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
        const formattedExpiry = expiryDate.toLocaleDateString();

        let message = `Hello ${member.name}, your UltimaFit membership (${member.plan_type}) expires on ${formattedExpiry}.`;

        if (daysLeft < 0) {
            message += ` It expired ${Math.abs(daysLeft)} days ago. Please renew seamlessly!`;
        } else if (daysLeft <= 5) {
            message += ` Only ${daysLeft} days left! Renew now to keep your streak.`;
        } else {
            message += ` Keep crushing it! 💪`;
        }

        const encodedMsg = encodeURIComponent(message);
        window.open(`https://wa.me/${member.phone}?text=${encodedMsg}`, '_blank');
    };

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm)
    );

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Gym Manager 🏋️‍♂️</h1>
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={20} /> Add Member
                </button>
            </div>

            <div className="search-bar">
                <Search size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="loading">Loading members...</div>
            ) : (
                <div className="members-grid">
                    {filteredMembers.map(member => {
                        const startDate = new Date(member.start_date);
                        const expiryDate = new Date(startDate);
                        expiryDate.setMonth(startDate.getMonth() + member.duration_months);
                        const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
                        const isExpired = daysLeft < 0;

                        return (
                            <motion.div
                                layout
                                key={member.id}
                                className={`member-card ${isExpired ? 'expired' : ''}`}
                            >
                                <div className="card-header">
                                    <h3>{member.name}</h3>
                                    <span className="plan-badge">{member.plan_type}</span>
                                </div>
                                <div className="card-details">
                                    <p>📱 {member.phone}</p>
                                    <p>📅 Joined: {new Date(member.start_date).toLocaleDateString()}</p>
                                    <p className={isExpired ? 'text-danger' : 'text-success'}>
                                        ⏳ {isExpired ? `Expired ${Math.abs(daysLeft)} days ago` : `${daysLeft} days left`}
                                    </p>
                                </div>
                                <div className="card-actions">
                                    <button className="whatsapp-btn" onClick={() => sendWhatsApp(member)}>
                                        <MessageCircle size={18} /> Remind
                                    </button>
                                    <button className="delete-btn" onClick={() => deleteMember(member.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add New Member</h2>
                        <form onSubmit={addMember}>
                            <input
                                type="text" placeholder="Full Name" required
                                value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                            />
                            <input
                                type="tel" placeholder="Phone (with country code)" required
                                value={newMember.phone} onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                            />
                            <select
                                value={newMember.plan_type} onChange={e => setNewMember({ ...newMember, plan_type: e.target.value })}
                            >
                                <option>Muscle Build</option>
                                <option>Fat Shred</option>
                                <option>Personal Training</option>
                            </select>
                            <input
                                type="number" placeholder="Duration (Months)" required min="1"
                                value={newMember.duration_months} onChange={e => setNewMember({ ...newMember, duration_months: parseInt(e.target.value) })}
                            />
                            <input
                                type="number" placeholder="Amount Paid (₹)" required
                                value={newMember.amount_paid} onChange={e => setNewMember({ ...newMember, amount_paid: e.target.value })}
                            />
                            <div className="modal-buttons">
                                <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Member</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
