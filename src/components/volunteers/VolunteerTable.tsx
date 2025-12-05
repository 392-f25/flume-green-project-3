import { useState } from 'react';
import { Volunteer } from '../../types/projects';
import { notifyVolunteers } from '../../utils/notifications';

interface VolunteerTableProps {
  volunteers: Volunteer[];
  roleLabel: string;
  roleColor: 'green' | 'blue' | 'red';
  attendance: string[];
  eventId?: string;
  eventName?: string;
  eventDate?: any;
  eventDescription?: string;
  creatorId?: string;
  currentUserId?: string;
  onHoursApproval?: (volunteerId: string, timeRequestId: string | undefined, isApproved: boolean) => void;
  onEditHours?: (volunteerId: string, timeRequestId: string, newHours: number) => Promise<void>;
  onNotify?: (volunteers: Volunteer[]) => void;
}

const VolunteerTable: React.FC<VolunteerTableProps> = ({ volunteers, roleLabel, roleColor, attendance, eventId, eventName, eventDate, eventDescription, creatorId, currentUserId, onHoursApproval, onEditHours, onNotify }) => {
  const [editingVolunteerId, setEditingVolunteerId] = useState<string | null>(null);
  const [hoursDraft, setHoursDraft] = useState('');
  const [savingVolunteerId, setSavingVolunteerId] = useState<string | null>(null);

  const startEditing = (volunteer: Volunteer) => {
    if (volunteer.submittedHours === undefined) return;
    setEditingVolunteerId(volunteer.id);
    setHoursDraft(volunteer.submittedHours.toString());
  };

  const cancelEditing = () => {
    setEditingVolunteerId(null);
    setHoursDraft('');
  };

  const saveEditedHours = async (volunteer: Volunteer) => {
    if (!onEditHours || !volunteer.timeRequestId) {
      cancelEditing();
      return;
    }
    const parsedHours = parseFloat(hoursDraft);
    if (Number.isNaN(parsedHours) || parsedHours <= 0) {
      alert('Please enter a valid number of hours greater than zero.');
      return;
    }
    setSavingVolunteerId(volunteer.id);
    try {
      await onEditHours(volunteer.id, volunteer.timeRequestId, parsedHours);
      cancelEditing();
    } catch (error) {
      console.error('Error updating hours:', error);
      alert('Failed to update hours. Please try again.');
    } finally {
      setSavingVolunteerId(null);
    }
  };

  // const headerColor = roleColor === 'green' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200';
  let headerColor: string;
  switch(roleColor) {
    case 'green': 
      headerColor = 'bg-green-50 border-green-200';
      break;
    case 'blue': 
      headerColor = 'bg-blue-50 border-blue-200';
      break;
    default:
      headerColor = 'bg-red-50 border-red-200';
  }
  const titleColor = 'text-black';

  const handleNotify = () => {
    if (eventId) {
      notifyVolunteers(volunteers, {
        eventName,
        eventDate,
        eventDescription,
        eventId,
        senderId: currentUserId,
      });
    } else if (onNotify) {
      onNotify(volunteers);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className={`${headerColor} border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold text-gray-900 ${titleColor}`}>{roleLabel}</h3>
          {onNotify && (
            <button
              type="button"
              onClick={handleNotify}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Notify All
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        {volunteers.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                {eventId && onHoursApproval && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                )}
                {eventId && onHoursApproval && currentUserId === creatorId && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {volunteers.map((volunteer) => {
                const isOwnerView = currentUserId === creatorId;
                const isEditing = editingVolunteerId === volunteer.id;
                const isApproved = attendance.includes(volunteer.id);
                return (
                  <tr key={volunteer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{volunteer.firstName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{volunteer.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{volunteer.email}</td>
                    {eventId && onHoursApproval && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {isEditing ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              step="0.25"
                              value={hoursDraft}
                              onChange={(e) => setHoursDraft(e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                            <button
                              type="button"
                              onClick={() => saveEditedHours(volunteer)}
                              disabled={savingVolunteerId === volunteer.id}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary-500 disabled:opacity-60"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              disabled={savingVolunteerId === volunteer.id}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-300 disabled:opacity-60"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : volunteer.submittedHours !== undefined ? (
                          <div className="inline-flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isApproved ? 'bg-gray-100 text-gray-600 border border-gray-200' : 'bg-blue-100 text-blue-800'}`}>
                              {volunteer.submittedHours} hours
                            </span>
                            {isOwnerView && onEditHours && volunteer.timeRequestId && (
                              <button
                                type="button"
                                onClick={() => startEditing(volunteer)}
                                className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label={`Edit hours for ${volunteer.firstName} ${volunteer.lastName}`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232a2.25 2.25 0 113.182 3.182L9.06 17.768a1.5 1.5 0 01-.53.337l-3.478 1.159a.375.375 0 01-.474-.474l1.16-3.478a1.5 1.5 0 01.337-.53l9.384-9.384z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8L16 6" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Not submitted</span>
                        )}
                      </td>
                    )}
                    {eventId && onHoursApproval && currentUserId === creatorId && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={attendance.includes(volunteer.id)}
                            disabled={volunteer.submittedHours === undefined || isApproved}
                            onChange={(e) => onHoursApproval(volunteer.id, volunteer.timeRequestId, e.target.checked)}
                            className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <span className={`ml-2 text-sm ${volunteer.submittedHours === undefined || isApproved ? 'text-gray-400' : ''}`}>
                            {attendance.includes(volunteer.id) ? 'Approved' : 'Approve'}
                          </span>
                        </label>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No {roleLabel.toLowerCase()} registered yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerTable;

