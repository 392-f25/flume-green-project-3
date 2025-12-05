import { Timestamp } from 'firebase/firestore';

// Eagle Project type matching the new database structure
export interface EagleProject {
  id: string;
  name: string;
  description: string;
  date: Timestamp | string;
  creator_id: string;
  parent_volunteers: number;
  student_volunteers: number;
  volunteer_hours: number;
  participated?: string[];
}

interface EventListProps {
  events: EagleProject[];
  onSelectEvent?: (eventId: string) => void;
  onViewVolunteers?: (eventId: string) => void;
  onEditEvent?: (event: EagleProject) => void;
  onLogHours?: (eventId: string) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onSelectEvent, onViewVolunteers, onEditEvent, onLogHours }) => {
  const formatDateTime = (dateValue: Timestamp | string | undefined) => {
    if (!dateValue) return 'N/A';
    const date = dateValue instanceof Timestamp 
      ? dateValue.toDate() 
      : new Date(dateValue);
    return date.toLocaleString();
  };

  const copyRegistrationLink = (eventId) => {
    // In a real app, this would be the actual URL with routing
    const link = `${window.location.origin}/register/${eventId}`;
    navigator.clipboard.writeText(link);
    alert('Registration link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">All Eagle Projects</h2>
      </div>

      {events && events.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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
                      <p className="text-sm text-gray-600">{formatDateTime(event.date)}</p>
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
                </div>

                <div className="space-y-3">
                  <button
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    onClick={() => onLogHours && onLogHours(event.id)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Log Hours
                  </button>

                  <div className="flex space-x-3">
                    <button
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                      onClick={() => copyRegistrationLink(event.id)}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Link
                    </button>

                    <button
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                      onClick={() => onViewVolunteers && onViewVolunteers(event.id)}
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first Eagle project.</p>
        </div>
      )}
    </div>
  );
};

export default EventList;
