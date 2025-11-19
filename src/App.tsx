import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import VolunteerRegistration from './components/VolunteerRegistration';
import VolunteerList from './components/VolunteerList';
import PublicRegistration from './components/PublicRegistration';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

interface Event {
  id: string;
  name: string;
  location: string;
  description: string;
  startTime: string;
  endTime: string;
  participated?: string[];
}

interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Main application component for authenticated/admin views
const MainApp: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  
  // State for managing the current view
  const [currentView, setCurrentView] = useState<'eventList' | 'createEvent' | 'volunteerRegistration' | 'volunteerList'>('eventList');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // State for storing events and volunteers (now populated from Firebase)
  const [events, setEvents] = useState<Event[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // If not authenticated, show login
  if (!currentUser) {
    return <Login />;
  }

  // Fetch events from Firebase in real-time
  useEffect(() => {
    const eventsRef = collection(db, 'Events');
    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          location: data.location || '',
          description: data.description || '',
          participated: data.participated || [],
          // Convert Firestore Timestamps to ISO strings for display
          startTime: data.startTime?.toDate?.()?.toISOString() || data.startTime,
          endTime: data.endTime?.toDate?.()?.toISOString() || data.endTime
        } as Event;
      });
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  // Fetch all volunteers from Firebase in real-time
  useEffect(() => {
    const volunteersRef = collection(db, 'Volunteers');
    const unsubscribe = onSnapshot(volunteersRef, (snapshot) => {
      const volunteersData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || ''
        } as Volunteer;
      });
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
  const handleViewVolunteers = (eventId: string) => {
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
      event.participated!.includes(volunteer.id)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Volunteer Event Manager</h1>
            
            <div className="flex items-center space-x-4">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'eventList'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentView('eventList')}
              >
                All Events
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'createEvent'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentView('createEvent')}
              >
                Create Event
              </button>

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-300">
                {currentUser.photoURL && (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'User'} 
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700">{currentUser.displayName || currentUser.email}</span>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'eventList' && (
          <EventList 
            events={events}
            onViewVolunteers={handleViewVolunteers}
          />
        )}

        {currentView === 'createEvent' && (
          <EventForm onEventCreate={handleEventCreate} />
        )}

        {currentView === 'volunteerRegistration' && selectedEventId && (
          <VolunteerRegistration 
            eventId={selectedEventId}
            eventName={getSelectedEvent()?.name}
            onRegister={handleVolunteerRegister}
          />
        )}

        {currentView === 'volunteerList' && (
          <div className="space-y-6">
            <button
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
    </div>
  );
};

// Root App component with routing
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/register/:eventId" element={<PublicRegistration />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
