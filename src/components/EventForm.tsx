import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import type { EagleProject } from '../types/projects';

interface EventFormData {
  name: string;
  date: string;
  description: string;
  parent_volunteers: number;
  student_volunteers: number;
  volunteer_hours: number;
}

interface EventFormProps {
  onEventCreate?: () => void;
  onEventUpdate?: () => void;
  editEvent?: EagleProject;
}

const EventForm: React.FC<EventFormProps> = ({ onEventCreate, onEventUpdate, editEvent }) => {
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    date: '',
    description: '',
    parent_volunteers: 0,
    student_volunteers: 0,
    volunteer_hours: 0
  });

  const isEditMode = !!editEvent;

  // Populate form when in edit mode
  useEffect(() => {
    if (editEvent) {
      const dateValue = editEvent.date instanceof Timestamp
        ? editEvent.date.toDate().toISOString().slice(0, 16)
        : new Date(editEvent.date).toISOString().slice(0, 16);

      setFormData({
        name: editEvent.name,
        description: editEvent.description || '',
        date: dateValue,
        parent_volunteers: editEvent.parent_volunteers || 0,
        student_volunteers: editEvent.student_volunteers || 0,
        volunteer_hours: editEvent.volunteer_hours || 0,
      });
    } else {
      // Reset form when switching to create mode
      setFormData({
        name: '',
        date: '',
        description: '',
        parent_volunteers: 0,
        student_volunteers: 0,
        volunteer_hours: 0
      });
    }
  }, [editEvent]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'parent_volunteers' || name === 'student_volunteers' || name === 'volunteer_hours'
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Ensure user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert('You must be logged in to create or edit events.');
        return;
      }

      const projectData = {
        name: formData.name,
        description: formData.description,
        date: Timestamp.fromDate(new Date(formData.date)),
        parent_volunteers: formData.parent_volunteers,
        student_volunteers: formData.student_volunteers,
        volunteer_hours: formData.volunteer_hours,
      };

      if (isEditMode && editEvent && editEvent.id) {
        // Update existing project (don't update creator_id field)
        await updateDoc(doc(db, 'Project', editEvent.id), projectData);
        alert('Project updated successfully!');

        // Call the parent handler to navigate back
        if (onEventUpdate) {
          onEventUpdate();
        }
      } else {
        // Create new project with creator_id field
        const newProject = {
          ...projectData,
          creator_id: currentUser.uid, // Add user ID to track ownership
        };

        // Add to Firebase
        await addDoc(collection(db, 'Project'), newProject);

        // Reset form
        setFormData({
          name: '',
          date: '',
          description: '',
          parent_volunteers: 0,
          student_volunteers: 0,
          volunteer_hours: 0
        });

        alert('Project created successfully!');

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
            {isEditMode ? 'Edit Eagle Project' : 'Create New Eagle Project'}
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
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
                placeholder="Enter project description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="parent_volunteers" className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Volunteers *
                </label>
                <input
                  type="number"
                  id="parent_volunteers"
                  name="parent_volunteers"
                  value={formData.parent_volunteers}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label htmlFor="student_volunteers" className="block text-sm font-medium text-gray-700 mb-2">
                  Student Volunteers *
                </label>
                <input
                  type="number"
                  id="student_volunteers"
                  name="student_volunteers"
                  value={formData.student_volunteers}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label htmlFor="volunteer_hours" className="block text-sm font-medium text-gray-700 mb-2">
                  Volunteer Hours *
                </label>
                <input
                  type="number"
                  id="volunteer_hours"
                  name="volunteer_hours"
                  value={formData.volunteer_hours}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditMode ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                </svg>
                {isEditMode ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
