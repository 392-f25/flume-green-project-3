interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registeredAt?: string;
  submittedHours?: number;
  timeRequestId?: string;
  role?: 'scout' | 'parent';
}

interface VolunteerListProps {
  volunteers: Volunteer[];
  eventName?: string;
  eventId?: string;
  attendance?: string[];
  onAttendanceChange?: (volunteerId: string, isPresent: boolean) => void;
  onHoursApproval?: (volunteerId: string, timeRequestId: string | undefined, isApproved: boolean) => void;
  creatorId?: string;
  currentUserId?: string;
  parentVolunteers?: number;
  studentVolunteers?: number;
}

const VolunteerList: React.FC<VolunteerListProps> = ({
  volunteers,
  eventName,
  eventId,
  creatorId,
  currentUserId,
  attendance = [],
  onAttendanceChange,
  onHoursApproval,
  parentVolunteers,
  studentVolunteers
}) => {
  // Separate volunteers by role
  const parentVolunteersList = volunteers.filter(v => v.role === 'parent');
  const studentVolunteersList = volunteers.filter(v => v.role === 'scout');
  
  // Counts
  const parentCount = parentVolunteersList.length;
  const studentCount = studentVolunteersList.length;
  const desiredParents = parentVolunteers || 0;
  const desiredStudents = studentVolunteers || 0;

  // Helper function to render volunteer row
  const renderVolunteerRow = (volunteer: Volunteer) => (
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
      {eventId && onHoursApproval && (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {volunteer.submittedHours !== undefined ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {volunteer.submittedHours} hours
            </span>
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
              disabled={volunteer.submittedHours === undefined}
              onChange={(e) => onHoursApproval(volunteer.id, volunteer.timeRequestId, e.target.checked)}
              className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className={`ml-2 text-sm ${volunteer.submittedHours === undefined ? 'text-gray-400' : ''}`}>
              {attendance.includes(volunteer.id) ? 'Approved' : 'Approve'}
            </span>
          </label>
        </td>
      )}
    </tr>
  );

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
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-blue-700">
                    Total Volunteers: <span className="font-semibold">{volunteers.length}</span>
                  </p>
                </div>
                {desiredParents > 0 && (
                  <div className="flex items-center">
                    <span className="text-green-700">
                      Parents: <span className={`font-semibold ${parentCount >= desiredParents ? 'text-green-800' : 'text-orange-600'}`}>
                        {parentCount} / {desiredParents}
                      </span>
                    </span>
                  </div>
                )}
                {desiredStudents > 0 && (
                  <div className="flex items-center">
                    <span className="text-blue-700">
                      Students: <span className={`font-semibold ${studentCount >= desiredStudents ? 'text-blue-800' : 'text-orange-600'}`}>
                        {studentCount} / {desiredStudents}
                      </span>
                    </span>
                  </div>
                )}
              </div>
              {eventId && onHoursApproval && (
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600">
                    Approved: <span className="font-semibold">{attendance.length}</span>
                  </span>
                  <span className="text-gray-600">
                    Pending: <span className="font-semibold">{volunteers.length - attendance.length}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Parent Volunteers Column */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-green-50 border-b border-green-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Parent Volunteers
                  {desiredParents > 0 && (
                    <span className={`ml-2 text-sm font-normal ${parentCount >= desiredParents ? 'text-green-700' : 'text-orange-600'}`}>
                      ({parentCount} / {desiredParents})
                    </span>
                  )}
                </h3>
              </div>
              <div className="overflow-x-auto">
                {parentVolunteersList.length > 0 ? (
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
                        {eventId && onHoursApproval && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hours
                          </th>
                        )}
                        {eventId && onHoursApproval && currentUserId === creatorId && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Approved
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parentVolunteersList.map(renderVolunteerRow)}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">No parent volunteers registered yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Student Volunteers Column */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Student Volunteers
                  {desiredStudents > 0 && (
                    <span className={`ml-2 text-sm font-normal ${studentCount >= desiredStudents ? 'text-blue-700' : 'text-orange-600'}`}>
                      ({studentCount} / {desiredStudents})
                    </span>
                  )}
                </h3>
              </div>
              <div className="overflow-x-auto">
                {studentVolunteersList.length > 0 ? (
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
                        {eventId && onHoursApproval && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hours
                          </th>
                        )}
                        {eventId && onHoursApproval && currentUserId === creatorId && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Approved
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentVolunteersList.map(renderVolunteerRow)}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">No student volunteers registered yet</p>
                  </div>
                )}
              </div>
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
