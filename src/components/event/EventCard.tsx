import { EagleProject, TimeRequestStatus } from '../../types/projects';
import RoleSelectionModal from '../RoleSelectionModal';
import { useState } from 'react';

interface EventCardProps {
  event: EagleProject;
  currentUserId?: string | null;
  onViewVolunteers?: (eventId: string) => void;
  onEditEvent?: (event: EagleProject) => void;
  onLogHours?: (eventId: string) => void;
  onRegisterEvent?: (eventId: string, role: 'scout' | 'parent') => void;
  onUnregisterEvent?: (eventId: string) => void;
  timeRequestStatuses?: Record<string, TimeRequestStatus>;
}

const formatDateTime = (value: EagleProject['date']) => {
  const date = typeof value === 'string' ? new Date(value) : value.toDate();
  return Number.isNaN(date.getTime())
    ? 'Date to be determined'
    : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const EventCard: React.FC<EventCardProps> = ({ event, currentUserId, onViewVolunteers, onEditEvent, onLogHours, onRegisterEvent, onUnregisterEvent, timeRequestStatuses }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const isRegistered = currentUserId ? Boolean(event.registered_volunteers?.[currentUserId]) : false;
  const isOwner = Boolean(event.creator_id && event.creator_id === currentUserId);
  const requestStatus = timeRequestStatuses?.[event.id];
  const showStatusTag = Boolean(isRegistered && !isOwner && requestStatus);
  const showLogHoursButton = Boolean(isRegistered && onLogHours && (!requestStatus || isOwner));
  const isUnregisterDisabled = Boolean(isRegistered && requestStatus);
  const statusLabel = requestStatus?.status === 'approved' ? 'Hours Approved' : 'Waiting for Approval';
  const statusClasses = requestStatus?.status === 'approved'
    ? 'text-green-700 bg-green-100 border border-green-200'
    : 'text-yellow-800 bg-yellow-100 border border-yellow-200';

  const cardClasses = [
    'bg-white rounded-lg shadow-sm transition-shadow flex flex-col hover:shadow-md',
    'relative',
    isOwner ? 'border-2 border-green-200' : 'border border-gray-200'
  ].join(' ');

  const handleRoleSelection = (role: 'scout' | 'parent') => {
    if (onRegisterEvent) {
      onRegisterEvent(event.id, role);
    }
    setModalOpen(false);
  };

  return (
    <>
      <div className={cardClasses}>
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
                <span className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${statusClasses}`}>
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
            className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isUnregisterDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : isRegistered
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              }`}
            disabled={isUnregisterDisabled}
            onClick={() => {
              if (isUnregisterDisabled) return;
              if (isRegistered) {
                onUnregisterEvent?.(event.id);
              } else {
                setModalOpen(true);
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

      <RoleSelectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelectRole={handleRoleSelection}
        eventName={event.name}
      />
    </>
  );
};

export default EventCard;

