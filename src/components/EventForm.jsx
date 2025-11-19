import { useState } from 'react';
import './EventForm.css';

const EventForm = ({ onEventCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    startTime: '',
    endTime: '',
    description: ''
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
    
    // Create event object with a unique ID
    const newEvent = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    // Call the parent handler (you'll connect this to Firebase later)
    if (onEventCreate) {
      onEventCreate(newEvent);
    }

    // Reset form
    setFormData({
      name: '',
      location: '',
      startTime: '',
      endTime: '',
      description: ''
    });

    alert('Event created successfully!');
  };

  return (
    <div className="event-form-container">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="name">Event Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter event name"
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
            placeholder="Enter event location"
          />
        </div>

        <div className="form-group">
          <label htmlFor="startTime">Start Time *</label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endTime">End Time *</label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Enter event description"
          />
        </div>

        <button type="submit" className="submit-btn">Create Event</button>
      </form>
    </div>
  );
};

export default EventForm;
