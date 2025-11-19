import { useState, useEffect } from 'react';
import './App.css';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import VolunteerRegistration from './components/VolunteerRegistration';
import VolunteerList from './components/VolunteerList';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const App = () => {
  // State for managing the current view
  const [currentView, setCurrentView] = useState('eventList');
  const [selectedEventId, setSelectedEventId] = useState(null);
  
  // State for storing events and volunteers (now populated from Firebase)
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  // Fetch events from Firebase in real-time
  useEffect(() => {
    const eventsRef = collection(db, 'Events');
    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamps to ISO strings for display
        startTime: doc.data().startTime?.toDate?.()?.toISOString() || doc.data().startTime,
        endTime: doc.data().endTime?.toDate?.()?.toISOString() || doc.data().endTime
      }));
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  // Fetch all volunteers from Firebase in real-time
  useEffect(() => {
    const volunteersRef = collection(db, 'Volunteers');
    const unsubscribe = onSnapshot(volunteersRef, (snapshot) => {
      const volunteersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVolunteers(volunteersData);
    });

    return () => unsubscribe();
  }, []);

  // Handler for creating a new event
  const handleEventCreate = () => {
    // Navigation only - EventForm now handles Firebase directly
    setCurrentView('eventList');
  };

  // Handler for registering a volunteer
  const handleVolunteerRegister = () => {
    // VolunteerRegistration now handles Firebase directly
    alert('Registration successful!');
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
    // Find the event and get volunteers from the participated array
    const event = events.find(e => e.id === selectedEventId);
    if (!event || !event.participated) return [];
    
    // Match volunteers by their IDs in the participated array
    return volunteers.filter(volunteer => 
      event.participated.includes(volunteer.id)
    );
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
