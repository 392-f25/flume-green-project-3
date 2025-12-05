import EventForm from '../components/EventForm';
import { EagleProject } from '../types/projects';

interface EditProjectViewProps {
  editEvent: EagleProject;
  onEventUpdate: () => void;
}

const EditProjectView: React.FC<EditProjectViewProps> = ({ editEvent, onEventUpdate }) => {
  return <EventForm editEvent={editEvent} onEventUpdate={onEventUpdate} />;
};

export default EditProjectView;

