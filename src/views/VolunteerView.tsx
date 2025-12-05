import VolunteerList from '../components/VolunteerList';
import { EagleProject, Volunteer } from '../types/projects';

interface VolunteerViewProps {
  event?: EagleProject;
  volunteers: Volunteer[];
  onBack: () => void;
  onHoursApproval: (volunteerId: string, timeRequestId: string | undefined, isApproved: boolean) => Promise<void>;
  onEditHours: (volunteerId: string, timeRequestId: string, newHours: number) => Promise<void>;
  currentUserId?: string | null;
}

const VolunteerView: React.FC<VolunteerViewProps> = ({ event, volunteers, onBack, onHoursApproval, onEditHours, currentUserId }) => {
  return (
    <div className="space-y-6">
      <button
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        onClick={onBack}
      >
        ← Back to Projects
      </button>
      <VolunteerList
        volunteers={volunteers}
        eventName={event?.name}
        eventDate={event?.date}
        eventDescription={event?.description}
        eventId={event?.id}
        attendance={event?.attendance}
        onHoursApproval={onHoursApproval}
        onEditHours={onEditHours}
        creatorId={event?.creator_id}
        currentUserId={currentUserId || undefined}
        parentVolunteers={event?.parent_volunteers}
        studentVolunteers={event?.student_volunteers}
      />
    </div>
  );
};

export default VolunteerView;

