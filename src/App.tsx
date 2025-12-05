import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import VolunteerRegistration from './components/VolunteerRegistration';
import VolunteerList from './components/VolunteerList';
import Login from './components/Login';
import TimeLogForm from './components/TimeLogForm';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, updateDoc, doc, Timestamp, arrayUnion, arrayRemove } from 'firebase/firestore';
import type { EagleProject } from './components/EventList';

// Eagle Project interface matching the new database structure
interface Project extends EagleProject {
  attendance?: string[]; // Array of volunteer IDs marked as present
  registered_volunteers?: string[]; // Array of volunteer IDs who registered
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
  const [currentView, setCurrentView] = useState<'eventList' | 'createEvent' | 'editEvent' | 'volunteerRegistration' | 'volunteerList' | 'volunteeringHistory' | 'myProjects' | 'logHours'>('eventList');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Project | null>(null);

  // State for storing projects and volunteers (now populated from Firebase)
  const [events, setEvents] = useState<Project[]>([]);
  const [eventVolunteers, setEventVolunteers] = useState<Volunteer[]>([]);

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
          registered_volunteers: data.registered_volunteers || [],
        } as Project;
      });
      setEvents(projectsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Fetch volunteers for selected event
  useEffect(() => {
    const fetchEventVolunteers = async () => {
      if (!selectedEventId) {
        setEventVolunteers([]);
        return;
      }

      const event = events.find(e => e.id === selectedEventId);
      
      if (!event || !event.registered_volunteers || event.registered_volunteers.length === 0) {
        setEventVolunteers([]);
        return;
      }

      // For each registered UID, get user info
      const volunteersData: Volunteer[] = [];
      
      for (const uid of event.registered_volunteers) {
        // Check if this is the current user
        if (currentUser && currentUser.uid === uid) {
          volunteersData.push({
            id: uid,
            firstName: currentUser.displayName?.split(' ')[0] || 'User',
            lastName: currentUser.displayName?.split(' ').slice(1).join(' ') || '',
            email: currentUser.email || 'N/A'
          });
        } else {
          // For other users, show UID since we can't fetch their Auth data
          volunteersData.push({
            id: uid,
            firstName: 'User',
            lastName: '',
            email: 'Not available'
          });
        }
      }
      
      setEventVolunteers(volunteersData);
    };

    fetchEventVolunteers();
  }, [selectedEventId, events, currentUser]);

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

  // Handler for registering the authenticated user for an event
  const handleRegisterForEvent = async (eventId: string) => {
    if (!currentUser) {
      alert('You must be logged in to register.');
      return;
    }

    try {
      // Add the user to the project's registered_volunteers array
      await updateDoc(doc(db, 'Project', eventId), {
        registered_volunteers: arrayUnion(currentUser.uid)
      });
      
      console.log('Registered user', currentUser.uid, 'for event', eventId);
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Failed to register. Please try again.');
    }
  };

  // Handler for unregistering the authenticated user from an event
  const handleUnregisterFromEvent = async (eventId: string) => {
    if (!currentUser) {
      alert('You must be logged in to unregister.');
      return;
    }

    try {
      await updateDoc(doc(db, 'Project', eventId), {
        registered_volunteers: arrayRemove(currentUser.uid)
      });
    } catch (error) {
      console.error('Error unregistering from event:', error);
      alert('Failed to unregister. Please try again.');
    }
  };

  // Handler for logging hours for a specific event
  const handleLogHours = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentView('logHours');
  };

  // Handler for when time log is submitted
  const handleTimeLogSubmit = () => {
    setCurrentView('eventList');
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
    return eventVolunteers;
  };

  // Get the count of currently registered volunteers for a project
  const getRegisteredVolunteerCount = (projectId: string) => {
    const event = events.find(e => e.id === projectId);
    return event?.registered_volunteers?.length || 0;
  };

  // Get projects created by the current user
  const getMyProjects = () => {
    return events.filter(event => event.creator_id === currentUser?.uid);
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
                  currentView === 'myProjects'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentView('myProjects')}
              >
                My Projects
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
            onLogHours={handleLogHours}
            currentUserId={currentUser?.uid}
            onRegisterEvent={handleRegisterForEvent}
            onUnregisterEvent={handleUnregisterFromEvent}
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

        {currentView === 'logHours' && selectedEventId && (
          <div className="space-y-6">
            <button
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => setCurrentView('eventList')}
            >
              ← Back to Projects
            </button>
            <TimeLogForm
              projectId={selectedEventId}
              projectName={getSelectedEvent()?.name}
              onSubmit={handleTimeLogSubmit}
              onCancel={() => setCurrentView('eventList')}
            />
          </div>
        )}

        {currentView === 'myProjects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">My Eagle Projects</h2>
              <button
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                onClick={() => setCurrentView('createEvent')}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Project
              </button>
            </div>

            {getMyProjects().length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getMyProjects().map((event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow-sm border-2 border-green-200 hover:shadow-md transition-shadow relative">
                    {/* My Projects badge */}
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      My Project
                    </div>

                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.name}</h3>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-start space-x-2">
                          <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Date</p>
                            <p className="text-sm text-gray-600">
                              {event.date instanceof Timestamp
                                ? event.date.toDate().toLocaleString()
                                : new Date(event.date).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {event.description && (
                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-sm font-medium text-gray-900 mb-1">Description</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                          </div>
                        )}

                        <div className="pt-2 border-t border-gray-100 grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Parent Volunteers</p>
                            <p className="text-sm font-semibold text-gray-900">{event.parent_volunteers}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Student Volunteers</p>
                            <p className="text-sm font-semibold text-gray-900">{event.student_volunteers}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Volunteer Hours</p>
                            <p className="text-sm font-semibold text-gray-900">{event.volunteer_hours}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-gray-500">Current Signups</p>
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <p className="text-sm font-semibold text-blue-600">
                                {getRegisteredVolunteerCount(event.id)} / {event.parent_volunteers + event.student_volunteers} volunteers
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex space-x-3">
                          <button
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                            onClick={() => handleEditEvent(event)}
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Project
                          </button>

                          <button
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            onClick={() => handleViewVolunteers(event.id)}
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            Volunteers
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
                <p className="mt-1 text-sm text-gray-500">Create your first Eagle project to get started.</p>
                <button
                  className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  onClick={() => setCurrentView('createEvent')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Project
                </button>
              </div>
            )}
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
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
