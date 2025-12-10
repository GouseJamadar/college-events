const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventsByMonth,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getMyEvents,
  getEventsGroupedByMonth
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getAllEvents);
router.get('/grouped/:year', getEventsGroupedByMonth);
router.get('/month/:year/:month', getEventsByMonth);
router.get('/my-events', protect, getMyEvents);
router.get('/:id', getEventById);

router.post('/', protect, admin, createEvent);
router.put('/:id', protect, admin, updateEvent);
router.delete('/:id', protect, admin, deleteEvent);

router.post('/:id/register', protect, registerForEvent);
router.post('/:id/unregister', protect, unregisterFromEvent);

module.exports = router;

college-events\frontend\src\pages\Events.js
+165
@@ -1,0 +1,164 @@
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import './Events.css';

const Events = () => {
  const [groupedEvents, setGroupedEvents] = useState({});
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, [selectedYear]);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    setExpandedMonth(currentMonth);
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get(`/events/grouped/${selectedYear}`);
      setGroupedEvents(response.data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/register`);
      toast.success('Successfully registered for event!');
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      technical: '#3182ce',
      cultural: '#d53f8c',
      sports: '#38a169',
      academic: '#805ad5',
      workshop: '#dd6b20',
      seminar: '#319795',
      other: '#718096'
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return (
      <div className="events-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>College Events</h1>
        <div className="year-selector">
          <button 
            onClick={() => setSelectedYear(y => y - 1)}
            className="year-btn"
          >
            ←
          </button>
          <span className="current-year">{selectedYear}</span>
          <button 
            onClick={() => setSelectedYear(y => y + 1)}
            className="year-btn"
          >
            →
          </button>
        </div>
      </div>

      <div className="months-container">
        {Object.entries(groupedEvents).map(([monthIndex, monthData]) => (
          <div key={monthIndex} className="month-card">
            <div 
              className={`month-header ${expandedMonth === parseInt(monthIndex) ? 'active' : ''}`}
              onClick={() => setExpandedMonth(
                expandedMonth === parseInt(monthIndex) ? null : parseInt(monthIndex)
              )}
            >
              <div className="month-info">
                <FiCalendar className="month-icon" />
                <h2>{monthData.name}</h2>
                <span className="event-count">{monthData.events.length} events</span>
              </div>
              {expandedMonth === parseInt(monthIndex) ? <FiChevronDown /> : <FiChevronRight />}
            </div>

            {expandedMonth === parseInt(monthIndex) && (
              <div className="month-events">
                {monthData.events.length === 0 ? (
                  <p className="no-events">No events scheduled for this month</p>
                ) : (
                  monthData.events.map(event => (
                    <div key={event._id} className="event-card">
                      <div 
                        className="event-category"
                        style={{ backgroundColor: getCategoryColor(event.category) }}
                      >
                        {event.category}
                      </div>
                      <div className="event-content">
                        <h3>{event.title}</h3>
                        <p className="event-description">{event.description}</p>
                        <div className="event-details">
                          <span><FiCalendar /> {formatDate(event.date)}</span>
                          <span><FiClock /> {event.time}</span>
                          <span><FiMapPin /> {event.venue}</span>
                          <span><FiUsers /> {event.registeredUsers?.length || 0}/{event.maxParticipants}</span>
                        </div>
                      </div>
                      <div className="event-actions">
                        {event.registeredUsers?.some(u => u._id === user?.id || u === user?.id) ? (
                          <span className="registered-badge">✓ Registered</span>
                        ) : event.registeredUsers?.length >= event.maxParticipants ? (
                          <span className="full-badge">Event Full</span>
                        ) : (
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleRegister(event._id)}
                          >
                            Register Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;