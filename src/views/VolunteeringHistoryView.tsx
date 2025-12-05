import { useMemo } from 'react';
import { Timestamp } from 'firebase/firestore';
import { EagleProject, TimeRequestStatus } from '../types/projects';

interface VolunteeringHistoryViewProps {
  events: EagleProject[];
  currentUserId: string;
  timeRequests: Record<string, TimeRequestStatus>;
}

const formatDateTime = (value?: Timestamp | string) => {
  if (!value) return 'Date not available';
  const date = value instanceof Timestamp ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date not available'
    : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const formatHours = (hours?: number) => {
  if (typeof hours !== 'number') return '0';
  return Number.isInteger(hours) ? hours.toString() : hours.toFixed(2);
};

const VolunteeringHistoryView: React.FC<VolunteeringHistoryViewProps> = ({ events, currentUserId, timeRequests }) => {
  const historyEntries = useMemo(() => {
    return events
      .filter((event) => Boolean(event.registered_volunteers?.[currentUserId] && timeRequests[event.id]))
      .map((event) => ({
        event,
        request: timeRequests[event.id]
      }));
  }, [events, currentUserId, timeRequests]);

  const { totalApprovedHours, totalLoggedHours } = useMemo(() => {
    return historyEntries.reduce(
      (acc, { request }) => {
        const hours = request?.hours ?? 0;
        acc.totalLoggedHours += hours;
        if (request?.status === 'approved') {
          acc.totalApprovedHours += hours;
        }
        return acc;
      },
      { totalApprovedHours: 0, totalLoggedHours: 0 }
    );
  }, [historyEntries]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900">Volunteering History</h2>
        <p className="mt-2 text-sm text-gray-600">Review the projects you have supported and the hours you have logged.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wide text-primary-700 font-semibold">Total Logged Hours</p>
            <p className="mt-2 text-2xl font-bold text-primary-900">{formatHours(totalLoggedHours)}</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wide text-green-700 font-semibold">Approved Hours</p>
            <p className="mt-2 text-2xl font-bold text-green-900">{formatHours(totalApprovedHours)}</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wide text-blue-700 font-semibold">Projects Logged</p>
            <p className="mt-2 text-2xl font-bold text-blue-900">{historyEntries.length}</p>
          </div>
        </div>
      </div>

      {historyEntries.length > 0 ? (
        <div className="space-y-4">
          {historyEntries.map(({ event, request }) => {
            const statusLabel = request?.status === 'approved' ? 'Approved' : 'Pending Approval';
            const statusClasses = request?.status === 'approved'
              ? 'text-green-700 bg-green-100 border border-green-200'
              : 'text-yellow-800 bg-yellow-100 border border-yellow-200';

            return (
              <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                    <p className="text-sm text-gray-600">Event Date: {formatDateTime(event.date)}</p>
                  </div>
                  <span className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${statusClasses}`}>
                    {statusLabel}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Hours Logged</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{formatHours(request?.hours)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Submission Date</p>
                    <p className="mt-1 text-sm text-gray-700">{formatDateTime(request?.submittedAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Role</p>
                    <p className="mt-1 text-sm text-gray-700">{event.registered_volunteers?.[currentUserId] === 'parent' ? 'Parent Volunteer' : 'Student Volunteer'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Organizer</p>
                    <p className="mt-1 text-sm text-gray-700">{event.creator_id ? (event.creator_id === currentUserId ? 'You' : 'Project Owner') : 'Not available'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-3 text-lg font-semibold text-gray-900">No volunteering history yet</h3>
          <p className="mt-2 text-sm text-gray-600">Log hours for a project and once they are approved, they will appear here along with your totals.</p>
        </div>
      )}
    </div>
  );
};

export default VolunteeringHistoryView;
