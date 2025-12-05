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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">All Eagle Projects</h2>
      </div>

      {events && events.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
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
  );
};

export default EventList;
