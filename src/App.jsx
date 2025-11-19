import { useState } from 'react';
import './App.css';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import VolunteerRegistration from './components/VolunteerRegistration';
import VolunteerList from './components/VolunteerList';

const App = () => {
  // State for managing the current view
  const [currentView, setCurrentView] = useState('eventList');
  const [selectedEventId, setSelectedEventId] = useState(null);
  
  // State for storing events and volunteers (will be replaced with Firebase later)
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  // Handler for creating a new event
  const handleEventCreate = (newEvent) => {
    setEvents(prev => [...prev, newEvent]);
    setCurrentView('eventList');
  };

  // Handler for registering a volunteer
  const handleVolunteerRegister = (registration) => {
    setVolunteers(prev => [...prev, registration]);
  };

  // Handler for viewing volunteers for a specific event
  const handleViewVolunteers = (eventId) => {
    setSelectedEventId(eventId);
    setCurrentView('volunteerList');
  };

  // Get the selected event details
  const getSelectedEvent = () => {
    return events.find(event => event.id === selectedEventId);
  };

  // Get volunteers for the selected event
  const getEventVolunteers = () => {
    return volunteers.filter(volunteer => volunteer.eventId === selectedEventId);
  };

  return (
    <div className="App">
      <nav className="app-nav">
        <h1>Volunteer Event Manager</h1>
        <div className="nav-buttons">
          <button 
            className={currentView === 'eventList' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('eventList')}
          >
            All Events
          </button>
          <button 
            className={currentView === 'createEvent' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('createEvent')}
          >
            Create Event
          </button>
        </div>
      </nav>

      <main className="app-main">
        {currentView === 'eventList' && (
          <EventList 
            events={events}
            onViewVolunteers={handleViewVolunteers}
          />
        )}

        {currentView === 'createEvent' && (
          <EventForm onEventCreate={handleEventCreate} />
        )}

        {currentView === 'volunteerRegistration' && (
          <VolunteerRegistration 
            eventId={selectedEventId}
            eventName={getSelectedEvent()?.name}
            onRegister={handleVolunteerRegister}
          />
        )}

        {currentView === 'volunteerList' && (
          <div>
            <button 
              className="back-btn"
              onClick={() => setCurrentView('eventList')}
            >
              ← Back to Events
            </button>
            <VolunteerList 
              volunteers={getEventVolunteers()}
              eventName={getSelectedEvent()?.name}
            />
          </div>
        )}
      </main>

      {/* Info box for registration links */}
      {currentView === 'eventList' && events.length > 0 && (
        <div className="info-box">
          <p><strong>Note:</strong> Click "Copy Registration Link" on any event to get the volunteer registration URL. 
          You can share this link with volunteers to register for the event.</p>
        </div>
      )}
    </div>
  );
};

export default App;
