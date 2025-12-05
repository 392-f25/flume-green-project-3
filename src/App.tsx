import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import VolunteerRegistration from './components/VolunteerRegistration';
import VolunteerList from './components/VolunteerList';
import PastVolunteers from './components/PastVolunteers';
import PublicRegistration from './components/PublicRegistration';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore';
import type { EagleProject } from './components/EventList';

// Eagle Project interface matching the new database structure
interface Project extends EagleProject {
  attendance?: string[]; // Array of volunteer IDs marked as present
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
  const [currentView, setCurrentView] = useState<'eventList' | 'createEvent' | 'editEvent' | 'volunteerRegistration' | 'volunteerList' | 'allPastVolunteers'>('eventList');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Project | null>(null);

  // State for storing projects and volunteers (now populated from Firebase)
  const [events, setEvents] = useState<Project[]>([]);
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

  // Fetch projects from Firebase in real-time - only for current user
  useEffect(() => {
    if (!currentUser) return;

    const projectsRef = collection(db, 'Project');
    // Query only projects created by the current user
    const projectsQuery = query(projectsRef);
    
    const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          description: data.description || '',
          date: data.date || Timestamp.now(),
          creator_id: data.creator_id || '',
          parent_volunteers: data.parent_volunteers || 0,
          student_volunteers: data.student_volunteers || 0,
          volunteer_hours: data.volunteer_hours || 0,
          participated: data.participated || [],
          attendance: data.attendance || [],
        } as Project;
      });
      setEvents(projectsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

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

  // Handler for editing a project
  const handleEditEvent = (event: Project) => {
    setEditingEvent(event);
    setCurrentView('editEvent');
  };

  // Handler for when an event is updated
  const handleEventUpdate = () => {
    setEditingEvent(null);
    setCurrentView('eventList');
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

  // Get all past volunteers who have participated in any of the organizer's events
  const getAllPastVolunteers = () => {
    // Collect all volunteer IDs from all events
    const allVolunteerIds = new Set<string>();
    events.forEach(event => {
      if (event.participated) {
        event.participated.forEach(volunteerId => {
          allVolunteerIds.add(volunteerId);
        });
      }
    });

    // Get volunteer details for all collected IDs
    return volunteers.filter(volunteer =>
      allVolunteerIds.has(volunteer.id)
    );
  };

  // Handler for updating volunteer attendance
  const handleAttendanceChange = async (volunteerId: string, isPresent: boolean) => {
    if (!selectedEventId) return;

    try {
      const event = events.find(e => e.id === selectedEventId);
      if (!event) return;

      const currentAttendance = event.attendance || [];
      let updatedAttendance: string[];

      if (isPresent) {
        // Add volunteer to attendance if not already present
        updatedAttendance = [...new Set([...currentAttendance, volunteerId])];
      } else {
        // Remove volunteer from attendance
        updatedAttendance = currentAttendance.filter(id => id !== volunteerId);
      }

      // Update the project in Firebase
      await updateDoc(doc(db, 'Project', selectedEventId), {
        attendance: updatedAttendance
      });

      // The real-time listener will automatically update the local state
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Failed to update attendance. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Eagle Project Manager</h1>
            
            <div className="flex items-center space-x-4">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'eventList'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentView('eventList')}
              >
                All Projects
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'createEvent'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentView('createEvent')}
              >
                Create Project
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'allPastVolunteers'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentView('allPastVolunteers')}
              >
                All Past Volunteers
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
            onEditEvent={handleEditEvent}
          />
        )}

        {currentView === 'createEvent' && (
          <EventForm onEventCreate={handleEventCreate} />
        )}

        {currentView === 'editEvent' && editingEvent && (
          <EventForm
            editEvent={editingEvent}
            onEventUpdate={handleEventUpdate}
          />
        )}

        {currentView === 'allPastVolunteers' && (
          <PastVolunteers
            volunteers={getAllPastVolunteers()}
            events={events}
          />
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
              ← Back to Projects
            </button>
            <VolunteerList
              volunteers={getEventVolunteers()}
              eventName={getSelectedEvent()?.name}
              eventId={selectedEventId || ''}
              attendance={getSelectedEvent()?.attendance}
              onAttendanceChange={handleAttendanceChange}
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
