import { Timestamp } from 'firebase/firestore';
import { EagleProject } from '../../types/projects';

interface MyProjectCardProps {
  project: EagleProject;
  registeredCount: number;
  onEdit: (project: EagleProject) => void;
  onViewVolunteers: (projectId: string) => void;
}

const formatDate = (date: Timestamp | string) => {
  return date instanceof Timestamp
    ? date.toDate().toLocaleString()
    : new Date(date).toLocaleString();
};

const MyProjectCard: React.FC<MyProjectCardProps> = ({ project, registeredCount, onEdit, onViewVolunteers }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-900">Date</p>
            <p className="text-sm text-gray-600">{formatDate(project.date)}</p>
          </div>
        </div>

        {project.description && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-900 mb-1">Description</p>
            <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
          </div>
        )}

        <div className="pt-2 border-t border-gray-100 grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Parent Volunteers</p>
            <p className="text-sm font-semibold text-gray-900">{project.parent_volunteers}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Student Volunteers</p>
            <p className="text-sm font-semibold text-gray-900">{project.student_volunteers}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Volunteer Hours</p>
            <p className="text-sm font-semibold text-gray-900">{project.volunteer_hours}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500">Current Signups</p>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm font-semibold text-blue-600">
                {registeredCount} / {(project.parent_volunteers ?? 0) + (project.student_volunteers ?? 0)} volunteers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex space-x-3">
          <button
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            onClick={() => onEdit(project)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Project
          </button>

          <button
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            onClick={() => onViewVolunteers(project.id)}
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
);

export default MyProjectCard;

