import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { EagleProject } from '../../types/projects';

interface MyProjectCardProps {
  project: EagleProject;
  registeredCount: number;
  onEdit: (project: EagleProject) => void;
  onViewVolunteers: (projectId: string) => void;
  onDelete: (projectId: string) => Promise<void>;
}

const formatDate = (date: Timestamp | string) => {
  return date instanceof Timestamp
    ? date.toDate().toLocaleString()
    : new Date(date).toLocaleString();
};

const MyProjectCard: React.FC<MyProjectCardProps> = ({ project, registeredCount, onEdit, onViewVolunteers, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(project.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="p-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{project.name}</h3>
      </div>

      <div className="space-y-2.5 mb-5">
        <div className="flex items-start space-x-2">
          <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Date</p>
            <p className="text-sm text-gray-600">{formatDate(project.date)}</p>
          </div>
        </div>

        {project.description && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-gray-600 leading-snug">{project.description}</p>
          </div>
        )}

        <div className="pt-2 border-t border-gray-100 grid grid-cols-3 gap-3">
          <div>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Parent Volunteers</p>
            <p className="text-sm font-semibold text-gray-900">{project.parent_volunteers}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Student Volunteers</p>
            <p className="text-sm font-semibold text-gray-900">{project.student_volunteers}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Volunteer Hours</p>
            <p className="text-sm font-semibold text-gray-900">{project.volunteer_hours}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Current Signups</p>
            <div className="flex items-center space-x-1.5">
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

      <div className="space-y-2.5">
        {showDeleteConfirm ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm font-medium text-red-900 mb-2">Are you sure you want to delete this project?</p>
            <p className="text-xs text-red-700 mb-3">This action cannot be undone.</p>
            <div className="flex space-x-2">
              <button
                className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              className="flex-1 inline-flex items-center justify-center px-3.5 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              onClick={() => onEdit(project)}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Project
            </button>

            <button
              className="flex-1 inline-flex items-center justify-center px-3.5 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              onClick={() => onViewVolunteers(project.id)}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Volunteers
            </button>

            <button
              className="inline-flex items-center justify-center px-3.5 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              onClick={handleDeleteClick}
              title="Delete project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default MyProjectCard;

