interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registeredAt?: string;
}

interface VolunteerListProps {
  volunteers: Volunteer[];
  eventName?: string;
  eventId?: string;
  attendance?: string[];
  onAttendanceChange?: (volunteerId: string, isPresent: boolean) => void;
}

const VolunteerList: React.FC<VolunteerListProps> = ({
  volunteers,
  eventName,
  eventId,
  attendance = [],
  onAttendanceChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Registered Volunteers</h2>
        {eventName && (
          <p className="mt-1 text-lg text-gray-600">Event: {eventName}</p>
        )}
      </div>

      {volunteers && volunteers.length > 0 ? (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-blue-700">
                  Total Volunteers: <span className="font-semibold">{volunteers.length}</span>
                </p>
              </div>
              {eventId && onAttendanceChange && (
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600">
                    Present: <span className="font-semibold">{attendance.length}</span>
                  </span>
                  <span className="text-red-600">
                    Absent: <span className="font-semibold">{volunteers.length - attendance.length}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      First Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered At
                    </th>
                    {eventId && onAttendanceChange && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendance
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {volunteers.map((volunteer) => (
                    <tr key={volunteer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {volunteer.firstName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {volunteer.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {volunteer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {volunteer.registeredAt
                          ? new Date(volunteer.registeredAt).toLocaleDateString() + ' ' +
                            new Date(volunteer.registeredAt).toLocaleTimeString()
                          : 'N/A'}
                      </td>
                      {eventId && onAttendanceChange && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={attendance.includes(volunteer.id)}
                              onChange={(e) => onAttendanceChange(volunteer.id, e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm">Present</span>
                          </label>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No volunteers yet</h3>
          <p className="mt-1 text-sm text-gray-500">No volunteers have registered for this event yet.</p>
        </div>
      )}
    </div>
  );
};

export default VolunteerList;
