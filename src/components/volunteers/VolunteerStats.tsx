interface VolunteerStatsProps {
  totalVolunteers: number;
  desiredParents: number;
  desiredStudents: number;
  parentCount: number;
  studentCount: number;
  approvedHoursTotal: string;
  approvedCount: number;
  pendingCount: number;
  awaitingSubmissionCount: number;
  showStatusBreakdown: boolean;
}

const VolunteerStats: React.FC<VolunteerStatsProps> = ({
  totalVolunteers,
  desiredParents,
  desiredStudents,
  parentCount,
  studentCount,
  approvedHoursTotal,
  approvedCount,
  pendingCount,
  awaitingSubmissionCount,
  showStatusBreakdown
}) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-blue-700">
            Total Volunteers: <span className="font-semibold">{totalVolunteers}</span>
          </p>
        </div>
        {desiredParents > 0 && (
          <div className="flex items-center">
            <span className="text-green-700">
              Parents:{' '}
              <span className={`font-semibold ${parentCount >= desiredParents ? 'text-green-800' : 'text-orange-600'}`}>
                {parentCount} / {desiredParents}
              </span>
            </span>
          </div>
        )}
        {desiredStudents > 0 && (
          <div className="flex items-center">
            <span className="text-blue-700">
              Students:{' '}
              <span className={`font-semibold ${studentCount >= desiredStudents ? 'text-blue-800' : 'text-orange-600'}`}>
                {studentCount} / {desiredStudents}
              </span>
            </span>
          </div>
        )}
        <div className="flex items-center">
          <svg className="w-5 h-5 text-indigo-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-indigo-700">
            Hours Approved: <span className="font-semibold">{approvedHoursTotal}</span>
          </span>
        </div>
      </div>
      {showStatusBreakdown && (
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-green-600">
            Approved: <span className="font-semibold">{approvedCount}</span>
          </span>
          <span className="text-yellow-600">
            Pending: <span className="font-semibold">{pendingCount}</span>
          </span>
          <span className="text-red-400">
            Awaiting Submission: <span className="font-semibold">{awaitingSubmissionCount}</span>
          </span>
        </div>
      )}
    </div>
  </div>
);

export default VolunteerStats;

