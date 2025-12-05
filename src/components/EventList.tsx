import { Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import RoleSelectionModal from './RoleSelectionModal';

export interface EagleProject {
  id: string;
  name: string;
  description: string;
  date: Timestamp | string;
  creator_id?: string;
  parent_volunteers?: number;
  student_volunteers?: number;
  volunteer_hours?: number;
  registered_volunteers?: Record<string, 'scout' | 'parent'>;
  participated?: string[];
  attendance?: string[];
}

export interface TimeRequestStatus {
  requestId: string;
  status: 'pending' | 'approved';
}

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

const formatDateTime = (value: Timestamp | string) => {
  // Convert Firestore timestamps or ISO strings into a readable value without seconds.
  const date = typeof value === 'string' ? new Date(value) : value.toDate();
  if (Number.isNaN(date.getTime())) {
    return 'Date to be determined';
  }

  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};

const EventList = ({
  events,
  currentUserId,
  onViewVolunteers,
  onEditEvent,
  onLogHours,
  onRegisterEvent,
  onUnregisterEvent,
  timeRequestStatuses
}: EventListProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEventForRegistration, setSelectedEventForRegistration] = useState<EagleProject | null>(null);

  const handleRegisterClick = (event: EagleProject) => {
    if (!onRegisterEvent) return;
    setSelectedEventForRegistration(event);
    setModalOpen(true);
  };

  const handleRoleSelection = (role: 'scout' | 'parent') => {
    if (selectedEventForRegistration && onRegisterEvent) {
      onRegisterEvent(selectedEventForRegistration.id, role);
    }
    setModalOpen(false);
    setSelectedEventForRegistration(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedEventForRegistration(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">All Eagle Projects</h2>
      </div>

      {events && events.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const isRegistered = currentUserId ? Boolean(event.registered_volunteers?.[currentUserId]) : false;
            const isOwner = Boolean(event.creator_id && event.creator_id === currentUserId);
            const requestStatus = timeRequestStatuses?.[event.id];
            const showStatusTag = Boolean(isRegistered && !isOwner && requestStatus);
            const showLogHoursButton = Boolean(isRegistered && onLogHours && (!requestStatus || isOwner));
            const statusLabel = requestStatus?.status === 'approved' ? 'Hours Approved' : 'Waiting for Approval';
            const statusClasses = requestStatus?.status === 'approved'
              ? 'text-green-700 bg-green-100 border border-green-200'
              : 'text-yellow-800 bg-yellow-100 border border-yellow-200';
            const cardClasses = [
              'bg-white rounded-lg shadow-sm transition-shadow flex flex-col hover:shadow-md',
              'relative',
              isOwner ? 'border-2 border-green-200' : 'border border-gray-200'
            ].join(' ');

            return (
              <div
                key={event.id}
                className={cardClasses}
              >
                {isOwner && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    My Project
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-semibold text-gray-900 flex-1 break-words">{event.name}</h3>
                    {isRegistered && (
                      showStatusTag ? (
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${statusClasses}`}
                        >
                          {statusLabel}
                        </span>
                      ) : (
                        showLogHoursButton && (
                          <button
                            className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors whitespace-nowrap"
                            onClick={() => onLogHours?.(event.id)}
                          >
                            Log Hours
                          </button>
                        )
                      )
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
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
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Parent Volunteers</p>
                      <p className="text-sm font-semibold text-gray-900">{event.parent_volunteers ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Student Volunteers</p>
                      <p className="text-sm font-semibold text-gray-900">{event.student_volunteers ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Volunteer Hours</p>
                      <p className="text-sm font-semibold text-gray-900">{event.volunteer_hours ?? 0}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-3">
                  <button
                    className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isRegistered
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      }`}
                    onClick={() => {
                      if (isRegistered) {
                        onUnregisterEvent?.(event.id);
                      } else {
                        handleRegisterClick(event);
                      }
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isRegistered ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      )}
                    </svg>
                    {isRegistered ? 'Unregister' : 'Register'}
                  </button>

                  <button
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    onClick={() => onViewVolunteers?.(event.id)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    View Volunteers
                  </button>

                  {isOwner && onEditEvent && (
                    <button
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                      onClick={() => onEditEvent(event)}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-4M18.414 2.586a2 2 0 010 2.828L12 12l-4 1 1-4 6.414-6.586a2 2 0 012.829 0z" />
                      </svg>
                      Edit Project
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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

      <RoleSelectionModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSelectRole={handleRoleSelection}
        eventName={selectedEventForRegistration?.name || ''}
      />
    </div>
  );
};

export default EventList;
