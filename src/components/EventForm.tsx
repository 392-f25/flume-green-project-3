import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';

interface EventFormData {
  name: string;
  location: string;
  startTime: string;
  endTime: string;
  description: string;
}

interface EventFormProps {
  onEventCreate?: () => void;
  onEventUpdate?: () => void;
  editEvent?: {
    id: string;
    name: string;
    location: string;
    startTime: string;
    endTime: string;
    description: string;
  };
}

const EventForm: React.FC<EventFormProps> = ({ onEventCreate, onEventUpdate, editEvent }) => {
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    location: '',
    startTime: '',
    endTime: '',
    description: ''
  });

  const isEditMode = !!editEvent;

  // Populate form when in edit mode
  useEffect(() => {
    if (editEvent) {
      setFormData({
        name: editEvent.name,
        location: editEvent.location,
        description: editEvent.description,
        // Convert Firebase Timestamp to datetime-local format
        startTime: new Date(editEvent.startTime).toISOString().slice(0, 16),
        endTime: new Date(editEvent.endTime).toISOString().slice(0, 16),
      });
    } else {
      // Reset form when switching to create mode
      setFormData({
        name: '',
        location: '',
        startTime: '',
        endTime: '',
        description: ''
      });
    }
  }, [editEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const eventData = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        startTime: Timestamp.fromDate(new Date(formData.startTime)),
        endTime: Timestamp.fromDate(new Date(formData.endTime)),
      };

      if (isEditMode && editEvent) {
        // Update existing event
        await updateDoc(doc(db, 'Events', editEvent.id), eventData);
        alert('Event updated successfully!');

        // Call the parent handler to navigate back
        if (onEventUpdate) {
          onEventUpdate();
        }
      } else {
        // Create new event
        const newEvent = {
          ...eventData,
          participated: [] // Initialize empty array for volunteer IDs
        };

        // Add to Firebase
        await addDoc(collection(db, 'Events'), newEvent);

        // Reset form
        setFormData({
          name: '',
          location: '',
          startTime: '',
          endTime: '',
          description: ''
        });

        alert('Event created successfully!');

        // Call the parent handler to navigate back
        if (onEventCreate) {
          onEventCreate();
        }
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} event:`, error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} event. Please try again.`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter event name"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter event location"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter event description"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditMode ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                </svg>
                {isEditMode ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
