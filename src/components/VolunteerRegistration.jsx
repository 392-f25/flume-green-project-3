import { useState } from 'react';
import './VolunteerRegistration.css';

const VolunteerRegistration = ({ eventId, eventName, onRegister }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
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
    
    // Create volunteer registration object
    const registration = {
      id: Date.now().toString(),
      eventId: eventId,
      ...formData,
      registeredAt: new Date().toISOString()
    };

    // Call the parent handler (you'll connect this to Firebase later)
    if (onRegister) {
      onRegister(registration);
    }

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: ''
    });

    alert('Registration successful! Thank you for volunteering.');
  };

  return (
    <div className="volunteer-registration-container">
      <h2>Volunteer Registration</h2>
      {eventName && <p className="event-name">Event: {eventName}</p>}
      
      <form onSubmit={handleSubmit} className="volunteer-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Enter your first name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Enter your last name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <button type="submit" className="submit-btn">Register as Volunteer</button>
      </form>
    </div>
  );
};

export default VolunteerRegistration;
