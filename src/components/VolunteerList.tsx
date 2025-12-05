import { useMemo } from 'react';
import VolunteerTable from './volunteers/VolunteerTable';
import VolunteerStats from './volunteers/VolunteerStats';
import { Volunteer } from '../types/projects';
import { notifyVolunteers } from '../utils/notifications';

interface VolunteerListProps {
  volunteers: Volunteer[];
  eventName?: string;
  eventDate?: any;
  eventDescription?: string;
  eventId?: string;
  attendance?: string[];
  onHoursApproval?: (volunteerId: string, timeRequestId: string | undefined, isApproved: boolean) => void;
  onEditHours?: (volunteerId: string, timeRequestId: string, newHours: number) => Promise<void>;
  onNotifyAwaitingSubmission?: (volunteers: Volunteer[]) => void;
  creatorId?: string;
  currentUserId?: string;
  parentVolunteers?: number;
  studentVolunteers?: number;
}

const VolunteerList: React.FC<VolunteerListProps> = ({
  volunteers,
  eventName,
  eventDate,
  eventDescription,
  eventId,
  creatorId,
  currentUserId,
  attendance = [],
  onHoursApproval,
  onEditHours,
  onNotifyAwaitingSubmission,
  parentVolunteers,
  studentVolunteers
}) => {
  const parentVolunteersList = useMemo(() => volunteers.filter((volunteer) => volunteer.role === 'parent'), [volunteers]);
  const studentVolunteersList = useMemo(() => volunteers.filter((volunteer) => volunteer.role === 'scout'), [volunteers]);
  const awaitingSubmissionList = useMemo(
    () => volunteers.filter((volunteer) => !attendance.includes(volunteer.id) && volunteer.submittedHours === undefined),
    [volunteers, attendance]
  );

  const parentCount = parentVolunteersList.length;
  const studentCount = studentVolunteersList.length;
  const desiredParents = parentVolunteers || 0;
  const desiredStudents = studentVolunteers || 0;

  const approvedHours = useMemo(
    () => volunteers.reduce((total, volunteer) => {
      if (attendance.includes(volunteer.id) && typeof volunteer.submittedHours === 'number') {
        return total + volunteer.submittedHours;
      }
      return total;
    }, 0),
    [volunteers, attendance]
  );

  const formattedApprovedHours = Number.isInteger(approvedHours) ? approvedHours.toString() : approvedHours.toFixed(2);
  const approvedCount = attendance.length;
  const pendingCount = volunteers.filter((volunteer) => !attendance.includes(volunteer.id) && volunteer.submittedHours !== undefined).length;
  const awaitingSubmissionCount = volunteers.filter((volunteer) => !attendance.includes(volunteer.id) && volunteer.submittedHours === undefined).length;

  const renderEventDetails = () => {
    if (!eventDate && !eventDescription) return null;
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
        <div className="space-y-3">
          {eventDate && (
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">Date</p>
                <p className="text-sm text-gray-600">
                  {typeof eventDate?.toDate === 'function'
                    ? eventDate.toDate().toLocaleString()
                    : new Date(eventDate).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          {eventDescription && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-900 mb-1">Description</p>
              <p className="text-sm text-gray-600 leading-relaxed">{eventDescription}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!volunteers.length) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Registered Volunteers</h2>
          {eventName && <p className="mt-1 text-lg text-gray-600">Event: {eventName}</p>}
        </div>
        {renderEventDetails()}
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No volunteers yet</h3>
          <p className="mt-1 text-sm text-gray-500">No volunteers have registered for this event yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Registered Volunteers</h2>
        {eventName && <p className="mt-1 text-lg text-gray-600">Event: {eventName}</p>}
      </div>

      {renderEventDetails()}

      <VolunteerStats
        totalVolunteers={volunteers.length}
        desiredParents={desiredParents}
        desiredStudents={desiredStudents}
        parentCount={parentCount}
        studentCount={studentCount}
        approvedHoursTotal={formattedApprovedHours}
        approvedCount={approvedCount}
        pendingCount={pendingCount}
        awaitingSubmissionCount={awaitingSubmissionCount}
        showStatusBreakdown={Boolean(eventId && onHoursApproval)}
      />

      <div className="space-y-6">
        {awaitingSubmissionList.length > 0 && (
          <VolunteerTable
            volunteers={awaitingSubmissionList}
            roleLabel="Awaiting Submission"
            roleColor="red"
            attendance={attendance}
            eventId={eventId}
            eventName={eventName}
            eventDate={eventDate}
            eventDescription={eventDescription}
            creatorId={creatorId}
            currentUserId={currentUserId}
            onHoursApproval={onHoursApproval}
            onEditHours={onEditHours}
            onNotify={(list) => {
              onNotifyAwaitingSubmission?.(list);
              notifyVolunteers(list, {
                eventName,
                eventDate,
                eventDescription,
                eventId,
                senderId: currentUserId
              });
            }}
          />
        )}
        <VolunteerTable
          volunteers={parentVolunteersList}
          roleLabel="Parent Volunteers"
          roleColor="green"
          attendance={attendance}
          eventId={eventId}
          creatorId={creatorId}
          currentUserId={currentUserId}
          onHoursApproval={onHoursApproval}
          onEditHours={onEditHours}
        />
        <VolunteerTable
          volunteers={studentVolunteersList}
          roleLabel="Student Volunteers"
          roleColor="blue"
          attendance={attendance}
          eventId={eventId}
          creatorId={creatorId}
          currentUserId={currentUserId}
          onHoursApproval={onHoursApproval}
          onEditHours={onEditHours}
        />
      </div>
    </div>
  );
};

export default VolunteerList;
