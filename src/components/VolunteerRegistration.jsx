import { useState } from 'react';
import './VolunteerRegistration.css';
import { db } from '../../lib/firebase';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create volunteer document
      const volunteerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      };

      // Add volunteer to Volunteers collection
      const volunteerRef = await addDoc(collection(db, 'Volunteers'), volunteerData);

      // Add volunteer ID to the event's participated array
      const eventRef = doc(db, 'Events', eventId);
      await updateDoc(eventRef, {
        participated: arrayUnion(volunteerRef.id)
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: ''
      });

      alert('Registration successful! Thank you for volunteering.');
      
      // Call the parent handler if provided
      if (onRegister) {
        onRegister();
      }
    } catch (error) {
      console.error('Error registering volunteer:', error);
      alert('Failed to register. Please try again.');
    }
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
