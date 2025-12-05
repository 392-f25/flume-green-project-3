import EventForm from '../components/EventForm';

interface CreateProjectViewProps {
  onEventCreate: () => void;
}

const CreateProjectView: React.FC<CreateProjectViewProps> = ({ onEventCreate }) => {
  return <EventForm onEventCreate={onEventCreate} />;
};

export default CreateProjectView;

