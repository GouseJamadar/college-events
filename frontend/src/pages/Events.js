import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiChevronRight, FiChevronDown, FiSearch, FiFilter } from 'react-icons/fi';
import './Events.css';

const Events = () => {
  const [groupedEvents, setGroupedEvents] = useState({});
  const [allEvents, setAllEvents] = useState([]);
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const categories = ['all', 'technical', 'cultural', 'sports', 'academic', 'workshop', 'seminar', 'other'];

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
      
      // Flatten events for search
      const flat = [];
      Object.values(response.data).forEach(month => {
        flat.push(...month.events);
      });
      setAllEvents(flat);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getCountdown = (date) => {
    const eventDate = new Date(date);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Event Ended', class: 'ended' };
    if (diffDays === 0) return { text: 'Today!', class: 'today' };
    if (diffDays === 1) return { text: 'Tomorrow', class: 'soon' };
    if (diffDays <= 7) return { text: `${diffDays} days left`, class: 'soon' };
    return { text: `${diffDays} days left`, class: 'upcoming' };
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

  // Filter events based on search and category
  const filterEvents = (events) => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.venue.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  };

  // Get filtered grouped events
  const getFilteredGroupedEvents = () => {
    const filtered = {};
    Object.entries(groupedEvents).forEach(([monthIndex, monthData]) => {
      filtered[monthIndex] = {
        ...monthData,
        events: filterEvents(monthData.events)
      };
    });
    return filtered;
  };

  const filteredGroupedEvents = getFilteredGroupedEvents();
  const totalFilteredEvents = Object.values(filteredGroupedEvents).reduce((sum, m) => sum + m.events.length, 0);

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
          <button onClick={() => setSelectedYear(y => y - 1)} className="year-btn">←</button>
          <span className="current-year">{selectedYear}</span>
          <button onClick={() => setSelectedYear(y => y + 1)} className="year-btn">→</button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search events by name, description, or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          <FiFilter /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="filter-options">
          <span className="filter-label">Category:</span>
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-chip ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
              style={categoryFilter === cat && cat !== 'all' ? { backgroundColor: getCategoryColor(cat) } : {}}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}

      {(searchTerm || categoryFilter !== 'all') && (
        <div className="search-results-info">
          Found {totalFilteredEvents} event{totalFilteredEvents !== 1 ? 's' : ''}
          {searchTerm && ` matching "${searchTerm}"`}
          {categoryFilter !== 'all' && ` in ${categoryFilter}`}
          <button className="clear-filters" onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }}>
            Clear Filters
          </button>
        </div>
      )}

      <div className="months-container">
        {Object.entries(filteredGroupedEvents).map(([monthIndex, monthData]) => (
          <div key={monthIndex} className="month-card">
            <div 
              className={`month-header ${expandedMonth === parseInt(monthIndex) ? 'active' : ''}`}
              onClick={() => setExpandedMonth(expandedMonth === parseInt(monthIndex) ? null : parseInt(monthIndex))}
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
                  monthData.events.map(event => {
                    const countdown = getCountdown(event.date);
                    return (
                      <div 
                        key={event._id} 
                        className="event-card clickable"
                        onClick={() => handleEventClick(event._id)}
                      >
                        <div className="event-category" style={{ backgroundColor: getCategoryColor(event.category) }}>
                          {event.category}
                        </div>
                        <span className={`countdown-badge ${countdown.class}`}>{countdown.text}</span>
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
                          <button className="btn btn-primary">View Details</button>
                        </div>
                      </div>
                    );
                  })
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
