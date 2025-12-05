import MyProjectCard from '../components/event/MyProjectCard';
import { EagleProject } from '../types/projects';

interface MyProjectsViewProps {
  projects: EagleProject[];
  getRegisteredCount: (projectId: string) => number;
  onCreateNew: () => void;
  onEditEvent: (event: EagleProject) => void;
  onViewVolunteers: (eventId: string) => void;
}

const MyProjectsView: React.FC<MyProjectsViewProps> = ({ projects, getRegisteredCount, onCreateNew, onEditEvent, onViewVolunteers }) => {
  if (!projects.length) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
        <p className="mt-1 text-sm text-gray-500">Create your first Eagle project to get started.</p>
        <button
          className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          onClick={onCreateNew}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Your First Project
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">My Eagle Projects</h2>
        <button
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          onClick={onCreateNew}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Project
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <MyProjectCard
            key={project.id}
            project={project}
            registeredCount={getRegisteredCount(project.id)}
            onEdit={onEditEvent}
            onViewVolunteers={onViewVolunteers}
          />
        ))}
      </div>
    </div>
  );
};

export default MyProjectsView;

