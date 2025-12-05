import EventCard from './event/EventCard';
import { EagleProject, TimeRequestStatus } from '../types/projects';

interface EventListProps {
  events: EagleProject[];
  currentUserId?: string | null;
  onViewVolunteers?: (eventId: string) => void;
  onEditEvent?: (event: EagleProject) => void;
  onLogHours?: (eventId: string) => void;
  onRegisterEvent?: (eventId: string, role: 'scout' | 'parent') => void;
  onUnregisterEvent?: (eventId: string) => void;
  timeRequestStatuses?: Record<string, TimeRequestStatus>;
}

const EventList: React.FC<EventListProps> = ({ events, currentUserId, onViewVolunteers, onEditEvent, onLogHours, onRegisterEvent, onUnregisterEvent, timeRequestStatuses }) => {
  // Filter projects into unlogged and all projects
  const unloggedProjects = events.filter(event => {
    const isRegistered = currentUserId ? Boolean(event.registered_volunteers?.[currentUserId]) : false;
    const isOwner = Boolean(event.creator_id && event.creator_id === currentUserId);
    const hasTimeRequest = timeRequestStatuses?.[event.id];
    
    // Show in unlogged if: registered, not owner, and hasn't logged hours yet
    return isRegistered && !isOwner && !hasTimeRequest;
  });

  // Get unlogged project IDs for filtering
  const unloggedProjectIds = new Set(unloggedProjects.map(p => p.id));
  
  // All projects excluding those in unlogged section
  const allProjects = events.filter(event => !unloggedProjectIds.has(event.id));

  return (
    <div className="space-y-8">
      {/* Unlogged Projects Section */}
      {unloggedProjects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-3xl font-bold text-gray-900">Unlogged Projects</h2>
          </div>
          <p className="text-sm text-gray-600">Projects you've registered for but haven't logged hours yet.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {unloggedProjects.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                currentUserId={currentUserId}
                onViewVolunteers={onViewVolunteers}
                onEditEvent={onEditEvent}
                onLogHours={onLogHours}
                onRegisterEvent={onRegisterEvent}
                onUnregisterEvent={onUnregisterEvent}
                timeRequestStatuses={timeRequestStatuses}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">All Eagle Projects</h2>
        </div>

        {allProjects && allProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allProjects.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                currentUserId={currentUserId}
                onViewVolunteers={onViewVolunteers}
                onEditEvent={onEditEvent}
                onLogHours={onLogHours}
                onRegisterEvent={onRegisterEvent}
                onUnregisterEvent={onUnregisterEvent}
                timeRequestStatuses={timeRequestStatuses}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first Eagle project.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
