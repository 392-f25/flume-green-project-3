import TimeLogForm from '../components/TimeLogForm';

interface LogHoursViewProps {
  projectId: string;
  projectName?: string;
  onBack: () => void;
  onSubmit: () => void;
}

const LogHoursView: React.FC<LogHoursViewProps> = ({ projectId, projectName, onBack, onSubmit }) => (
  <div className="space-y-6">
    <button
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      onClick={onBack}
    >
      ← Back to Projects
    </button>
    <TimeLogForm
      projectId={projectId}
      projectName={projectName}
      onSubmit={onSubmit}
      onCancel={onBack}
    />
  </div>
);

export default LogHoursView;

