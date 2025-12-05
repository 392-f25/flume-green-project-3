import { useMemo, useState } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { EagleProject } from '../types/projects';
import { useProjectData } from '../hooks/useProjectData';
import TopNav from '../components/navigation/TopNav';
import { useNotifications } from '../hooks/useNotifications';
import AllProjectsView from './AllProjectsView';
import CreateProjectView from './CreateProjectView';
import EditProjectView from './EditProjectView';
import VolunteerView from './VolunteerView';
import LogHoursView from './LogHoursView';
import MyProjectsView from './MyProjectsView';
import Login from '../components/Login';

type ViewKey = 'eventList' | 'createEvent' | 'editEvent' | 'volunteerList' | 'myProjects' | 'logHours';

const MainAppInner: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<ViewKey>('eventList');
  const { events, eventVolunteers, userTimeRequests, selectedEventId, editingEvent, setSelectedEventId, setEditingEvent, registerForEvent, unregisterFromEvent, approveVolunteerHours, editVolunteerHours } = useProjectData({ currentUser });
  const { notifications, markNotificationRead, markAllNotificationsRead } = useNotifications(currentUser?.uid ?? null);

  if (!currentUser) {
    return <Login />;
  }

  const selectedEvent = useMemo(() => events.find((event) => event.id === selectedEventId), [events, selectedEventId]);
  const myProjects = useMemo(() => events.filter((event) => event.creator_id === currentUser?.uid), [events, currentUser]);

  const handleViewVolunteers = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentView('volunteerList');
  };

  const handleLogHours = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentView('logHours');
  };

  const handleEditEvent = (event: EagleProject) => {
    setEditingEvent(event);
    setCurrentView('editEvent');
  };

  const handleEventCreateOrUpdate = () => {
    setEditingEvent(null);
    setCurrentView('eventList');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getRegisteredVolunteerCount = (projectId: string) => {
    const event = events.find((item) => item.id === projectId);
    return event?.registered_volunteers ? Object.keys(event.registered_volunteers).length : 0;
  };

  const topNavView: 'eventList' | 'createEvent' | 'myProjects' =
    currentView === 'createEvent'
      ? 'createEvent'
      : currentView === 'myProjects'
      ? 'myProjects'
      : 'eventList';

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav
        currentView={topNavView}
        onChangeView={(view) => setCurrentView(view)}
        userName={currentUser.displayName || currentUser.email}
        userPhotoUrl={currentUser.photoURL}
        onSignOut={handleSignOut}
        notifications={notifications}
        onMarkNotificationRead={markNotificationRead}
        onMarkAllNotificationsRead={markAllNotificationsRead}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'eventList' && (
          <AllProjectsView
            events={events}
            onViewVolunteers={handleViewVolunteers}
            onEditEvent={handleEditEvent}
            onLogHours={handleLogHours}
            currentUserId={currentUser?.uid}
            onRegisterEvent={registerForEvent}
            onUnregisterEvent={unregisterFromEvent}
            timeRequestStatuses={userTimeRequests}
          />
        )}

        {currentView === 'createEvent' && (
          <CreateProjectView onEventCreate={handleEventCreateOrUpdate} />
        )}

        {currentView === 'editEvent' && editingEvent && (
          <EditProjectView editEvent={editingEvent} onEventUpdate={handleEventCreateOrUpdate} />
        )}

        {currentView === 'volunteerList' && selectedEvent && (
          <VolunteerView
            event={selectedEvent}
            volunteers={eventVolunteers}
            onBack={() => setCurrentView('eventList')}
            onHoursApproval={approveVolunteerHours}
            onEditHours={editVolunteerHours}
            currentUserId={currentUser?.uid}
          />
        )}

        {currentView === 'logHours' && selectedEventId && (
          <LogHoursView
            projectId={selectedEventId}
            projectName={selectedEvent?.name}
            onBack={() => setCurrentView('eventList')}
            onSubmit={handleEventCreateOrUpdate}
          />
        )}

        {currentView === 'myProjects' && (
          <MyProjectsView
            projects={myProjects}
            getRegisteredCount={getRegisteredVolunteerCount}
            onCreateNew={() => setCurrentView('createEvent')}
            onEditEvent={handleEditEvent}
            onViewVolunteers={handleViewVolunteers}
          />
        )}
      </main>
    </div>
  );
};

const MainApp: React.FC = () => (
  <AuthProvider>
    <MainAppInner />
  </AuthProvider>
);

export default MainApp;

