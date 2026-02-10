import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import './ClassScheduleSection.css';

const scheduleData = {
    Monday: [
        { time: '06:00 AM', class: 'Morning Glory Yoga', trainer: 'Sarah J.', room: 'Zen Studio' },
        { time: '09:00 AM', class: 'HIIT Inferno', trainer: 'Mike T.', room: 'Main Arena' },
        { time: '05:00 PM', class: 'Powerlifting 101', trainer: 'Big Rob', room: 'Iron Zone' },
        { time: '07:00 PM', class: 'Zumba Party', trainer: 'Linda', room: 'Dance Hall' },
    ],
    Tuesday: [
        { time: '07:00 AM', class: 'Spin Cycle', trainer: 'Alex', room: 'Cycle Lab' },
        { time: '10:00 AM', class: 'Core Crusher', trainer: 'Sarah J.', room: 'Mat Area' },
        { time: '06:00 PM', class: 'Boxing Blitz', trainer: 'Tyson', room: 'Ring' },
    ],
    Wednesday: [
        { time: '06:00 AM', class: 'Sunrise Yoga', trainer: 'Sarah J.', room: 'Zen Studio' },
        { time: '05:00 PM', class: 'CrossFit WOD', trainer: 'Coach D', room: 'Box 1' },
        { time: '08:00 PM', class: 'MMA Technique', trainer: 'Tyson', room: 'Ring' },
    ],
    Thursday: [
        { time: '07:00 AM', class: 'HIIT Cardio', trainer: 'Mike T.', room: 'Main Arena' },
        { time: '06:00 PM', class: 'Leg Day Lab', trainer: 'Big Rob', room: 'Squat Rack' },
    ],
    Friday: [
        { time: '06:00 AM', class: 'Full Body Blast', trainer: 'Alex', room: 'Main Arena' },
        { time: '05:00 PM', class: 'Friday Night Pump', trainer: 'All Coaches', room: 'Iron Zone' },
    ],
};

const ClassScheduleSection = () => {
    const [activeDay, setActiveDay] = useState('Monday');
    const days = Object.keys(scheduleData);

    return (
        <section id="schedule" className="schedule-section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="schedule-header"
                >
                    <h2 className="section-title">Battle <span className="neon-text">Rhythm</span></h2>
                    <p className="section-subtitle">Join the ranks. Committing to a schedule is the first step to victory.</p>
                </motion.div>

                <div className="days-tabs">
                    {days.map((day) => (
                        <button
                            key={day}
                            className={`day-tab ${activeDay === day ? 'active' : ''}`}
                            onClick={() => setActiveDay(day)}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                <div className="schedule-display glass-panel">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeDay}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="class-list"
                        >
                            {scheduleData[activeDay].map((item, index) => (
                                <div key={index} className="class-card">
                                    <div className="class-time">
                                        <Clock size={16} className="icon-gold" />
                                        <span>{item.time}</span>
                                    </div>
                                    <div className="class-info">
                                        <h3 className="class-name">{item.class}</h3>
                                        <p className="trainer-name">with {item.trainer}</p>
                                    </div>
                                    <div className="class-location">
                                        <MapPin size={16} className="icon-gold" />
                                        <span>{item.room}</span>
                                    </div>
                                    <button className="book-btn">Book</button>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default ClassScheduleSection;
