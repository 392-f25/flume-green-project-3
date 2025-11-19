import './EventList.css';

const EventList = ({ events, onSelectEvent, onViewVolunteers }) => {
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  const copyRegistrationLink = (eventId) => {
    // In a real app, this would be the actual URL with routing
    const link = `${window.location.origin}/register/${eventId}`;
    navigator.clipboard.writeText(link);
    alert('Registration link copied to clipboard!');
  };

  return (
    <div className="event-list-container">
      <h2>All Events</h2>
      
      {events && events.length > 0 ? (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h3>{event.name}</h3>
              </div>
              
              <div className="event-details">
                <div className="detail-item">
                  <span className="label">Location:</span>
                  <span className="value">{event.location}</span>
                </div>
                
                <div className="detail-item">
                  <span className="label">Start:</span>
                  <span className="value">{formatDateTime(event.startTime)}</span>
                </div>
                
                <div className="detail-item">
                  <span className="label">End:</span>
                  <span className="value">{formatDateTime(event.endTime)}</span>
                </div>
                
                <div className="detail-item description">
                  <span className="label">Description:</span>
                  <p className="value">{event.description}</p>
                </div>
              </div>
              
              <div className="event-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => copyRegistrationLink(event.id)}
                >
                  Copy Registration Link
                </button>
                
                <button 
                  className="action-btn secondary"
                  onClick={() => onViewVolunteers && onViewVolunteers(event.id)}
                >
                  View Volunteers
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-events">
          <p>No events have been created yet.</p>
          <p>Create your first event to get started!</p>
        </div>
      )}
    </div>
  );
};

export default EventList;
