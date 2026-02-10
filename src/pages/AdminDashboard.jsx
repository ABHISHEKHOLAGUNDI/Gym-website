import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, MessageCircle, Plus, Search, RefreshCw, TrendingUp, Users, AlertTriangle, FileText, Download, Share2, X, Star, Gift, Megaphone, Utensils, UserCheck, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTrainer, setFilterTrainer] = useState('All');
    const [stats, setStats] = useState({ revenue: 0, active: 0, critical: 0 });
    const [birthdaysToday, setBirthdaysToday] = useState([]);
    const [planData, setPlanData] = useState([]);

    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const receiptRef = useRef(null);

    const [newMember, setNewMember] = useState({
        name: '', phone: '', plan_type: 'Muscle Build', duration_months: 1, amount_paid: '', dob: '', trainer_name: 'Unassigned'
    });

    // Chart Colors
    const COLORS = ['#FFD700', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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

            // Plan Calculation for Chart
            const planCounts = {};

            const processed = (data || []).map(m => {
                const start = new Date(m.start_date);
                const expiry = new Date(start);
                expiry.setMonth(start.getMonth() + m.duration_months);
                const daysLeft = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));

                // Birthday Check
                if (m.dob) {
                    const dob = new Date(m.dob);
                    if (dob.getMonth() === todayMonth && dob.getDate() === todayDate) {
                        bdays.push(m);
                    }
                }

                // Plan Count
                planCounts[m.plan_type] = (planCounts[m.plan_type] || 0) + 1;

                return { ...m, daysLeft, expiryDate: expiry };
            });

            // Convert Plan Counts to Recharts Data
            const pData = Object.keys(planCounts).map(key => ({ name: key, value: planCounts[key] }));
            setPlanData(pData);

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
            setNewMember({ name: '', phone: '', plan_type: 'Muscle Build', duration_months: 1, amount_paid: '', dob: '', trainer_name: 'Unassigned' });
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
        const newVal = !member.is_mom;
        const { error } = await supabase.from('members').update({ is_mom: newVal }).eq('id', member.id);
        if (error) alert(error.message);
        else {
            if (newVal) alert(`${member.name} is now Member of the Month! 🏆`);
            fetchMembers();
        }
    };

    const assignTrainer = async (member) => {
        const trainer = prompt("Assign Trainer (e.g., Rahul, Priya, None):", member.trainer_name || "");
        if (trainer === null) return;

        const { error } = await supabase.from('members').update({ trainer_name: trainer }).eq('id', member.id);
        if (error) alert(error.message);
        else fetchMembers();
    };

    const sendWhatsApp = (member) => {
        const formattedExpiry = member.expiryDate.toLocaleDateString();
        let message = `Hello ${member.name}, your UltimaFit membership expires on ${formattedExpiry}.`;
        if (member.daysLeft < 0) message += ` It's expired! Please renew.`;
        else if (member.daysLeft <= 5) message += ` Only ${member.daysLeft} days left. Renew now!`;
        window.open(`https://wa.me/${member.phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const sendDietPlan = (member, type) => {
        let planLink = "", planTitle = "";
        if (type === 'muscle') { planTitle = "Muscle Gain Plan"; planLink = "https://tinyurl.com/ultima-muscle"; }
        else if (type === 'fatloss') { planTitle = "Fat Loss Plan"; planLink = "https://tinyurl.com/ultima-fatloss"; }
        else { planTitle = "Lean & Fit Plan"; planLink = "https://tinyurl.com/ultima-lean"; }
        const msg = `Hello ${member.name}! 🥗\nHere is your *${planTitle}* from UltimaFit:\n${planLink}\n\nStay consistent! 💪`;
        window.open(`https://wa.me/${member.phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const sendBulkAlert = () => {
        const msg = prompt("Enter functionality Broadcast Message (e.g., 'Gym closed tomorrow'):");
        if (!msg) return;
        const phones = members.map(m => m.phone).join(',');
        navigator.clipboard.writeText(phones).then(() => {
            alert("✅ NUMBERS COPIED!\n\n1. Go to WhatsApp -> New Broadcast.\n2. Paste numbers from clipboard (or add from contacts).\n3. Send your message: " + msg + "\n\n(Browsers blocked auto-sending to multiple people to prevent spam).");
            window.open('https://web.whatsapp.com', '_blank');
        });
    };

    // Receipt Functions
    const openReceipt = (member) => { setSelectedMember(member); setShowReceiptModal(true); };
    const shareReceipt = async () => {
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

    const [viewMode, setViewMode] = useState('active'); // 'active' | 'lost' | 'equipment'

    // Equipment Data (Mock for now, can be DB later)
    const [equipment, setEquipment] = useState([
        { id: 1, name: 'Treadmill 1', status: 'Working', lastService: '2025-01-10' },
        { id: 2, name: 'Cable Crossover', status: 'Maintenance', lastService: '2024-12-20' },
        { id: 3, name: 'Smith Machine', status: 'Working', lastService: '2025-02-01' },
        { id: 4, name: 'Leg Press', status: 'Broken', lastService: '2024-11-15' },
    ]);

    // Transformation Generator State
    const [transData, setTransData] = useState({ before: null, after: null, name: '' });
    const transRef = useRef(null);

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTransData(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const downloadTransformation = async () => {
        if (!transRef.current) return;
        try {
            // Clone the element to enforce desktop sizing during capture
            const original = transRef.current;
            const clone = original.cloneNode(true);

            // Set fixed dimensions for high-quality Instagram square
            clone.style.width = "1080px";
            clone.style.height = "1080px";
            clone.style.position = "absolute";
            clone.style.top = "-9999px"; // Hide it
            clone.style.left = "-9999px";
            clone.style.transform = "none"; // Remove any scaling
            document.body.appendChild(clone);

            // Wait for images in clone to load (if any)
            const images = clone.getElementsByTagName('img');
            await Promise.all(Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
            }));

            // Capture the clone
            const canvas = await html2canvas(clone, {
                backgroundColor: '#000000',
                scale: 1, // 1:1 scale since we set it to 1080px
                useCORS: true,
                width: 1080,
                height: 1080
            });

            // Clean up
            document.body.removeChild(clone);

            const link = document.createElement('a');
            link.download = `Transformation-${transData.name || 'Member'}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        } catch (err) { console.error(err); alert('Failed to generate image.'); }
    };

    const toggleEquipmentStatus = (id) => {
        setEquipment(equipment.map(e => {
            if (e.id === id) {
                const nextStatus = e.status === 'Working' ? 'Maintenance' : e.status === 'Maintenance' ? 'Broken' : 'Working';
                return { ...e, status: nextStatus, lastService: nextStatus === 'Working' ? new Date().toISOString().split('T')[0] : e.lastService };
            }
            return e;
        }));
    };

    const sendRecoveryMessage = (member) => {
        const msg = `Hey ${member.name}! It's been a while since we saw you at UltimaFit. 🏋️‍♂️\n\nWe miss your energy! Come back this week and get a *Special Renewal Discount*. Let's get back on track! 💪`;
        window.open(`https://wa.me/${member.phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const filtered = members.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.phone.includes(searchTerm);
        const matchesTrainer = filterTrainer === 'All' || (m.trainer_name && m.trainer_name.toLowerCase() === filterTrainer.toLowerCase());

        // Lost Member Logic: Expired more than 30 days ago
        const isLost = m.daysLeft < -30;

        if (viewMode === 'lost') return matchesSearch && isLost;
        if (viewMode === 'equipment') return false; // Handled separately
        if (viewMode === 'transformation') return false;
        return matchesSearch && matchesTrainer && !isLost;
    });

    const lostCount = members.filter(m => m.daysLeft < -30).length;

    // Get Unique Trainers for Filter
    const uniqueTrainers = ['All', ...new Set(members.map(m => m.trainer_name).filter(t => t && t !== 'Unassigned'))];

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Gym Manager <span className="highlight-gold">PRO+</span></h1>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={() => setViewMode('transformation')} style={{ marginRight: '10px', border: viewMode === 'transformation' ? '1px solid gold' : 'none' }}>
                        📸 Posters
                    </button>
                    <button className="btn-secondary" onClick={() => setViewMode(viewMode === 'equipment' ? 'active' : 'equipment')} style={{ marginRight: '10px' }}>
                        {viewMode === 'equipment' ? '👥 Members' : '🛠️ Machines'}
                    </button>
                    <button className="btn-secondary" onClick={() => setViewMode(viewMode === 'active' ? 'lost' : 'active')} style={{ marginRight: '10px', border: viewMode === 'lost' ? '1px solid red' : 'none', display: (viewMode === 'equipment' || viewMode === 'transformation') ? 'none' : 'flex' }}>
                        {viewMode === 'active' ? `💀 Lost Members (${lostCount})` : '💪 Active Members'}
                    </button>
                    <button className="btn-secondary" onClick={sendBulkAlert} style={{ marginRight: '10px' }}>
                        <Megaphone size={18} /> Bulk Alert
                    </button>
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <Plus size={20} /> New Member
                    </button>
                </div>
            </div>

            {/* View Mode: Active (Stats & Actions) */}
            {viewMode === 'active' && (
                <>
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

                    <div className="dashboard-actions-row">
                        {birthdaysToday.length > 0 && (
                            <div className="birthday-chip">
                                <Gift className="type-pulse" size={18} />
                                <span>{birthdaysToday.length} Birthday{birthdaysToday.length > 1 ? 's' : ''} Today!</span>
                            </div>
                        )}
                        <div className="search-box">
                            <Search size={18} className="search-icon" />
                            <input type="text" placeholder="Search name or phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <select className="filter-select" value={filterTrainer} onChange={e => setFilterTrainer(e.target.value)}>
                            {uniqueTrainers.map(t => <option key={t} value={t}>{t === 'All' ? '👨‍🏫 All Trainers' : `👨‍🏫 ${t}`}</option>)}
                        </select>
                    </div>
                </>
            )}

            {/* View Mode: Lost */}
            {viewMode === 'lost' && (
                <div className="lost-banner">
                    <h2>💀 Lost Member Recovery Zone</h2>
                    <p>These members haven't renewed in 30+ days. Win them back!</p>
                </div>
            )}

            {/* View Mode: Transformation Generator */}
            {viewMode === 'transformation' && (
                <div className="transformation-section">
                    <div className="trans-controls">
                        <h2>Create Transformation Poster</h2>
                        <input type="text" placeholder="Member Name" value={transData.name} onChange={e => setTransData({ ...transData, name: e.target.value })} />
                        <div className="file-inputs">
                            <label>Before Image <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'before')} /></label>
                            <label>After Image <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'after')} /></label>
                        </div>
                        <button className="btn-primary" onClick={downloadTransformation}><Download size={18} /> Download Poster</button>
                    </div>

                    <div className="trans-preview-container">
                        <div ref={transRef} className="trans-poster">
                            <div className="poster-header">
                                <h2>ULTIMA<span className="highlight-gold">FIT</span></h2>
                                <p>TRANSFORMATION</p>
                            </div>
                            <div className="poster-images">
                                <div className="p-img-box">
                                    <span>BEFORE</span>
                                    {transData.before ? <img src={transData.before} alt="Before" /> : <div className="placeholder">Upload Photo</div>}
                                </div>
                                <div className="p-divider">
                                    <div className="arrow">➜</div>
                                </div>
                                <div className="p-img-box">
                                    <span>AFTER</span>
                                    {transData.after ? <img src={transData.after} alt="After" /> : <div className="placeholder">Upload Photo</div>}
                                </div>
                            </div>
                            <div className="poster-footer">
                                <h3>{transData.name || 'Dedication'}</h3>
                                <p>#UltimaTransformation</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Mode: Equipment */}
            {viewMode === 'equipment' && (
                <div className="equipment-grid">
                    {equipment.map(item => (
                        <div key={item.id} className={`equipment-card ${item.status.toLowerCase()}`} onClick={() => toggleEquipmentStatus(item.id)}>
                            <div className="eq-header">
                                <h3>{item.name}</h3>
                                <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                            </div>
                            <p>Last Service: {item.lastService}</p>
                            <small>Click to change status</small>
                        </div>
                    ))}
                    <div className="equipment-card add-new">
                        <h3>+ Add Machine</h3>
                        <p>Coming Soon</p>
                    </div>
                </div>
            )}

            {/* Member Grid (Hidden in Equipment/Transformation View) */}
            {loading ? <div className="loading">Syncing...</div> : (
                <>
                    {viewMode !== 'equipment' && viewMode !== 'transformation' && (
                        <div className="members-grid">
                            <AnimatePresence>
                                {filtered.map(member => {
                                    let statusClass = 'status-safe';
                                    if (member.daysLeft < 0) statusClass = 'status-expired';
                                    else if (member.daysLeft <= 5) statusClass = 'status-critical';
                                    else if (member.daysLeft <= 10) statusClass = 'status-warning';

                                    return (
                                        <motion.div layout key={member.id} className={`member-card ${statusClass} ${member.is_mom ? 'mom-glow' : ''}`}>
                                            {member.is_mom && <div className="mom-badge"><Star size={12} fill="black" /> STAR MEMBER</div>}

                                            <div className="card-top">
                                                <div>
                                                    <h3>{member.name} {member.is_mom && '⭐'}</h3>
                                                    <span className="plan-pill">{member.plan_type}</span>
                                                    <span className="trainer-pill">👨‍🏫 {member.trainer_name || 'No Trainer'}</span>
                                                </div>
                                                <div className="days-badge">
                                                    {member.daysLeft < 0 ? 'EXPIRED' : `${member.daysLeft} Days`}
                                                </div>
                                            </div>

                                            <div className="card-info">
                                                <p>📱 {member.phone}</p>
                                                <p>🗓️ Ends: {member.expiryDate.toLocaleDateString()}</p>
                                                {member.dob && <p>🎂 {new Date(member.dob).toLocaleDateString()}</p>}
                                            </div>

                                            <div className="card-actions-grid">
                                                {viewMode === 'lost' ? (
                                                    <button className="action-btn recovery-btn" onClick={() => sendRecoveryMessage(member)} style={{ gridColumn: '1 / -1', background: '#e74c3c' }}>
                                                        💔 Recover (Send Offer)
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button className="action-btn whatsapp" onClick={() => sendWhatsApp(member)} title="Remind"><MessageCircle size={16} /></button>
                                                        <button className="action-btn receipt" onClick={() => openReceipt(member)} title="Bill"><FileText size={16} /></button>
                                                        <button className="action-btn renew" onClick={() => renewMember(member)} title="Renew"><RefreshCw size={16} /></button>
                                                        <button className={`action-btn mom ${member.is_mom ? 'active' : ''}`} onClick={() => toggleMoM(member)} title="Member of Month"><Star size={16} /></button>
                                                        <button className="action-btn trainer" onClick={() => assignTrainer(member)} title="Assign Trainer"><UserCheck size={16} /></button>
                                                        <div className="diet-dropdown">
                                                            <button className="action-btn diet" title="Diet Plan"><Utensils size={16} /></button>
                                                            <div className="diet-content">
                                                                <span onClick={() => sendDietPlan(member, 'muscle')}>💪 Muscle</span>
                                                                <span onClick={() => sendDietPlan(member, 'fatloss')}>🔥 Fat Loss</span>
                                                            </div>
                                                        </div>
                                                        <button className="action-btn delete" onClick={() => deleteMember(member.id)} title="Delete"><Trash2 size={16} /></button>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>New Member</h2>
                        <form onSubmit={addMember}>
                            <input type="text" placeholder="Name" required value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} />
                            <input type="tel" placeholder="Phone" required value={newMember.phone} onChange={e => setNewMember({ ...newMember, phone: e.target.value })} />

                            <label style={{ fontSize: '0.8rem', color: '#888' }}>Date of Birth</label>
                            <input type="date" value={newMember.dob} onChange={e => setNewMember({ ...newMember, dob: e.target.value })} />

                            <label style={{ fontSize: '0.8rem', color: '#888' }}>Assign Trainer</label>
                            <select value={newMember.trainer_name} onChange={e => setNewMember({ ...newMember, trainer_name: e.target.value })}>
                                <option value="Unassigned">Unassigned</option>
                                <option value="Rahul">Rahul</option>
                                <option value="Priya">Priya</option>
                                <option value="Vikram">Vikram</option>
                            </select>

                            <select value={newMember.plan_type} onChange={e => setNewMember({ ...newMember, plan_type: e.target.value })} style={{ marginTop: '10px' }}>
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

            {/* Receipt Modal (Preserved) */}
            {showReceiptModal && selectedMember && (
                <div className="modal-overlay">
                    <div className="receipt-modal-content">
                        <button className="close-btn" onClick={() => setShowReceiptModal(false)}><X size={20} /></button>
                        <div ref={receiptRef} className="receipt-paper">
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
