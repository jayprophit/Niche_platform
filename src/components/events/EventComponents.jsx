/**
 * Social Events Components
 * Components for events functionality in the social media section
 */

import React, { useState, useEffect } from 'react';

/**
 * Event list component
 */
export function EventList({ events = [], onAttendEvent }) {
  const [filter, setFilter] = useState('upcoming');
  
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    const now = new Date();
    
    if (filter === 'upcoming') {
      return eventDate >= now;
    } else if (filter === 'past') {
      return eventDate < now;
    } else if (filter === 'attending') {
      return event.isAttending && eventDate >= now;
    }
    
    return true;
  });
  
  return (
    <div className="social-event-list">
      <div className="event-list-header">
        <h2>Events</h2>
        
        <div className="event-filters">
          <button 
            className={`filter-button ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`filter-button ${filter === 'attending' ? 'active' : ''}`}
            onClick={() => setFilter('attending')}
          >
            Attending
          </button>
          <button 
            className={`filter-button ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Past
          </button>
        </div>
        
        <button className="create-event-button">
          <span className="create-icon">+</span>
          <span className="create-label">Create Event</span>
        </button>
      </div>
      
      {filteredEvents.length > 0 ? (
        <div className="events-grid">
          {filteredEvents.map((event, index) => (
            <EventCard 
              key={index} 
              event={event} 
              onAttendEvent={onAttendEvent} 
            />
          ))}
        </div>
      ) : (
        <div className="empty-events">
          <div className="empty-icon">📅</div>
          <h3>No {filter} Events</h3>
          <p>
            {filter === 'upcoming' && "There are no upcoming events scheduled."}
            {filter === 'attending' && "You're not attending any upcoming events."}
            {filter === 'past' && "There are no past events to display."}
          </p>
          {filter !== 'past' && (
            <button className="create-event-button">
              <span className="create-icon">+</span>
              <span className="create-label">Create Event</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Event card component
 */
export function EventCard({ event, onAttendEvent }) {
  const [isAttending, setIsAttending] = useState(event.isAttending);
  
  const handleAttendToggle = () => {
    setIsAttending(!isAttending);
    onAttendEvent(event.id, !isAttending);
  };
  
  const eventDate = new Date(event.startDate);
  const isPastEvent = eventDate < new Date();
  
  return (
    <div className={`event-card ${isPastEvent ? 'past-event' : ''}`}>
      <div className="event-cover">
        <img 
          src={event.coverImage || '/default-event-cover.jpg'} 
          alt={event.title} 
          className="cover-image"
        />
        
        <div className="event-date-badge">
          <div className="event-month">
            {eventDate.toLocaleDateString('en-US', { month: 'short' })}
          </div>
          <div className="event-day">
            {eventDate.getDate()}
          </div>
        </div>
      </div>
      
      <div className="event-info">
        <h3 className="event-title">{event.title}</h3>
        
        <div className="event-meta">
          <div className="event-time">
            <span className="time-icon">🕒</span>
            <span className="time-text">
              {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {event.endDate && ` - ${new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </span>
          </div>
          
          <div className="event-location">
            <span className="location-icon">📍</span>
            <span className="location-text">
              {event.isOnline ? 'Online Event' : event.location}
            </span>
          </div>
          
          {event.group && (
            <div className="event-group">
              <span className="group-icon">👥</span>
              <span className="group-text">
                {event.group.name}
              </span>
            </div>
          )}
        </div>
        
        <p className="event-description">
          {event.description.length > 100 ? 
            `${event.description.substring(0, 100)}...` : 
            event.description}
        </p>
        
        <div className="event-attendance">
          <div className="attendance-count">
            <span className="attending-icon">✓</span>
            <span className="attending-count">{event.attendingCount} going</span>
          </div>
          
          <div className="event-actions">
            {!isPastEvent && (
              <button 
                className={`attend-button ${isAttending ? 'attending' : ''}`}
                onClick={handleAttendToggle}
              >
                {isAttending ? 'Going' : 'Attend'}
              </button>
            )}
            <a href={`/events/${event.id}`} className="view-event-button">
              Details
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Event detail component
 */
export function EventDetail({ event, currentUser, onAttendEvent, onInviteFriends }) {
  const [isAttending, setIsAttending] = useState(event.isAttending);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  const handleAttendToggle = () => {
    setIsAttending(!isAttending);
    onAttendEvent(event.id, !isAttending);
  };
  
  const handleInvite = () => {
    setShowInviteModal(true);
  };
  
  const handleInviteSubmit = (selectedFriends) => {
    onInviteFriends(event.id, selectedFriends);
    setShowInviteModal(false);
  };
  
  const eventDate = new Date(event.startDate);
  const isPastEvent = eventDate < new Date();
  
  return (
    <div className="social-event-detail">
      <div className="event-header">
        <div className="event-cover">
          <img 
            src={event.coverImage || '/default-event-cover.jpg'} 
            alt={event.title} 
            className="cover-image"
          />
        </div>
        
        <div className="event-info">
          <div className="event-date-badge">
            <div className="event-month">
              {eventDate.toLocaleDateString('en-US', { month: 'short' })}
            </div>
            <div className="event-day">
              {eventDate.getDate()}
            </div>
          </div>
          
          <div className="event-details">
            <h1 className="event-title">{event.title}</h1>
            
            <div className="event-meta">
              <div className="event-time">
                <span className="time-icon">🕒</span>
                <span className="time-text">
                  {eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  {' at '}
                  {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {event.endDate && (
                    <>
                      {' - '}
                      {new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </>
                  )}
                </span>
              </div>
              
              <div className="event-location">
                <span className="location-icon">📍</span>
                <span className="location-text">
                  {event.isOnline ? 'Online Event' : event.location}
                </span>
              </div>
              
              {event.group && (
                <div className="event-group">
                  <span className="group-icon">👥</span>
                  <span className="group-text">
                    Hosted by{' '}
                    <a href={`/groups/${event.group.id}`} className="group-link">
                      {event.group.name}
                    </a>
                  </span>
                </div>
              )}
              
              {event.organizer && (
                <div className="event-organizer">
                  <span className="organizer-icon">👤</span>
                  <span className="organizer-text">
                    Organized by{' '}
                    <a href={`/profile/${event.organizer.username}`} className="organizer-link">
                      {event.organizer.displayName}
                    </a>
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="event-actions">
            {!isPastEvent && (
              <>
                <button 
                  className={`attend-button ${isAttending ? 'attending' : ''}`}
                  onClick={handleAttendToggle}
                >
                  {isAttending ? 'Going' : 'Attend'}
                </button>
                
                {isAttending && (
                  <button 
                    className="invite-button"
                    onClick={handleInvite}
                  >
                    <span className="invite-icon">✉️</span>
                    <span className="invite-label">Invite Friends</span>
                  </button>
                )}
              </>
            )}
            
            <button className="share-button">
              <span className="share-icon">↗️</span>
              <span className="share-label">Share</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="event-content">
        <div className="event-main">
          <div className="event-section">
            <h3>About this event</h3>
            <div className="event-description">
              {event.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          
          {event.agenda && event.agenda.length > 0 && (
            <div className="event-section">
              <h3>Agenda</h3>
              <div className="event-agenda">
                {event.agenda.map((item, index) => (
                  <div key={index} className="agenda-item">
                    <div className="agenda-time">{item.time}</div>
                    <div className="agenda-content">
                      <div className="agenda-title">{item.title}</div>
                      {item.description && (
                        <div className="agenda-description">{item.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {event.speakers && event.speakers.length > 0 && (
            <div className="event-section">
              <h3>Speakers</h3>
              <div className="event-speakers">
                {event.speakers.map((speaker, index) => (
                  <div key={index} className="speaker-item">
                    <img 
                      src={speaker.avatar || '/default-avatar.jpg'} 
                      alt={speaker.name} 
                      className="speaker-avatar"
                    />
                    <div className="speaker-info">
                      <div className="speaker-name">{speaker.name}</div>
                      {speaker.title && (
                        <div className="speaker-title">{speaker.title}</div>
                      )}
                      {speaker.bio && (
                        <div className="speaker-bio">{speaker.bio}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="event-sidebar">
          <div className="sidebar-section">
            <h3>Date and Time</h3>
            <div className="date-time-details">
              <div className="date-detail">
                <div className="detail-label">Start:</div>
                <div className="detail-value">
                  {eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  {' at '}
                  {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {event.endDate && (
                <div className="date-detail">
                  <div className="detail-label">End:</div>
                  <div className="detail-value">
                    {new Date(event.endDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    {' at '}
                    {new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )}
              
              <button className="add-calendar-button">
                <span className="calendar-icon">📅</span>
                <span className="calendar-label">Add to Calendar</span>
              </button>
            </div>
          </div>
          
          <div className="sidebar-section">
            <h3>Location</h3>
            <div className="location-details">
              {event.isOnline ? (
                <>
                  <div className="online-badge">Online Event</div>
                  {event.onlineUrl && (
                    <a href={event.onlineUrl} className="online-link" target="_blank" rel="noopener noreferrer">
                      Join Event
                    </a>
                  )}
                </>
              ) : (
                <>
                  <div className="location-address">{event.location}</div>
                  {event.locationDetails && (
                    <div className="location-details">{event.locationDetails}</div>
                  )}
                  <div className="location-map">
                    {/* Map would be rendered here */}
                    <div className="map-placeholder">Map</div>
                  </div>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`} 
                    className="directions-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                </>
              )}
            </div>
          </div>
          
          <div className="sidebar-section">
            <h3>Attendees ({event.attendingCount})</h3>
            <div className="attendees-preview">
              {event.attendees && event.attendees.length > 0 ? (
                <>
                  <div className="attendees-avatars">
                    {event.attendees.slice(0, 5).map((attendee, index) => (
                      <img 
                        key={index}
                        src={attendee.avatar || '/default-avatar.jpg'} 
                        alt={attendee.displayName} 
                        className="attendee-avatar"
                        title={attendee.displayName}
                      />
                    ))}
                    {event.attendingCount > 5 && (
                      <div className="more-attendees">+{event.attendingCount - 5}</div>
                    )}
                  </div>
                  <a href="#attendees" className=<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>