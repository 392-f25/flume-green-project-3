import { useState } from 'react';
import './EventForm.css';

const EventForm = ({ onEventCreate, currentUser }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    parentVolunteersNeeded: '',
    scoutVolunteersNeeded: '',
    hoursPerVolunteer: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create Eagle Scout project object with a unique ID
    const newProject = {
      id: Date.now().toString(),
      ...formData,
      ownerId: currentUser?.id,
      ownerName: currentUser?.displayName,
      createdAt: new Date().toISOString(),
      volunteers: [],
      hourSubmissions: []
    };

    // Call the parent handler (you'll connect this to Firebase later)
    if (onEventCreate) {
      onEventCreate(newProject);
    }

    // Reset form
    setFormData({
      projectName: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      parentVolunteersNeeded: '',
      scoutVolunteersNeeded: '',
      hoursPerVolunteer: ''
    });

    alert('Eagle Scout project created successfully!');
  };

  return (
    <div className="event-form-container">
      <h2>Create Eagle Scout Project</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="projectName">Project Name *</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            required
            placeholder="Enter project name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Enter project location"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date *</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="parentVolunteersNeeded">Parent Volunteers Needed *</label>
            <input
              type="number"
              id="parentVolunteersNeeded"
              name="parentVolunteersNeeded"
              value={formData.parentVolunteersNeeded}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="scoutVolunteersNeeded">Scout Volunteers Needed *</label>
            <input
              type="number"
              id="scoutVolunteersNeeded"
              name="scoutVolunteersNeeded"
              value={formData.scoutVolunteersNeeded}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="hoursPerVolunteer">Expected Hours Per Volunteer *</label>
          <input
            type="number"
            id="hoursPerVolunteer"
            name="hoursPerVolunteer"
            value={formData.hoursPerVolunteer}
            onChange={handleChange}
            required
            min="0.5"
            step="0.5"
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Project Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Describe the work that will be done during this Eagle Scout project..."
          />
        </div>

        <button type="submit" className="submit-btn">Post Eagle Scout Project</button>
      </form>
    </div>
  );
};

export default EventForm;
