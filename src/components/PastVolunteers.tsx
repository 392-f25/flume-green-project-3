interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registeredAt?: string;
}

import type { EagleProject } from './EventList';

interface PastVolunteersProps {
  volunteers: Volunteer[];
  events: EagleProject[];
}

const PastVolunteers: React.FC<PastVolunteersProps> = ({ volunteers, events }) => {
  // Calculate volunteer participation stats
  const getVolunteerStats = (volunteerId: string) => {
    const participatedEvents = events.filter(event =>
      event.participated?.includes(volunteerId)
    );
    return {
      totalEvents: participatedEvents.length,
      eventNames: participatedEvents.map(event => event.name)
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">All Past Volunteers</h2>
        <p className="mt-1 text-lg text-gray-600">Volunteers who have participated in your projects</p>
      </div>

      {volunteers && volunteers.length > 0 ? (
        <>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-700">
                Total Unique Volunteers: <span className="font-semibold">{volunteers.length}</span>
              </p>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projects Participated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      First Registered
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {volunteers.map((volunteer) => {
                    const stats = getVolunteerStats(volunteer.id);
                    return (
                      <tr key={volunteer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {volunteer.firstName[0]}{volunteer.lastName[0]}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {volunteer.firstName} {volunteer.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {volunteer.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">{stats.totalEvents}</span>
                            {stats.totalEvents > 0 && (
                              <div className="text-xs text-gray-500 mt-1 max-w-xs">
                                {stats.eventNames.slice(0, 2).join(', ')}
                                {stats.eventNames.length > 2 && ` +${stats.eventNames.length - 2} more`}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {volunteer.registeredAt
                            ? new Date(volunteer.registeredAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No past volunteers yet</h3>
          <p className="mt-1 text-sm text-gray-500">Volunteers who register for your projects will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default PastVolunteers;

