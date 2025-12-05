import EventList from '../components/EventList';
import { EagleProject, TimeRequestStatus } from '../types/projects';

interface AllProjectsViewProps {
  events: EagleProject[];
  currentUserId?: string | null;
  onViewVolunteers: (eventId: string) => void;
  onEditEvent: (event: EagleProject) => void;
  onLogHours: (eventId: string) => void;
  onRegisterEvent: (eventId: string, role: 'scout' | 'parent') => void;
  onUnregisterEvent: (eventId: string) => void;
  timeRequestStatuses?: Record<string, TimeRequestStatus>;
}

const AllProjectsView: React.FC<AllProjectsViewProps> = (props) => {
  return (
    <EventList {...props} />
  );
};

export default AllProjectsView;

