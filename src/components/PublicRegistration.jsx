import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VolunteerRegistration.css';
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const PublicRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventRef = doc(db, 'Events', eventId);
        const eventSnap = await getDoc(eventRef);
        
        if (eventSnap.exists()) {
          const eventData = {
            id: eventSnap.id,
            ...eventSnap.data(),
            startTime: eventSnap.data().startTime?.toDate?.()?.toISOString() || eventSnap.data().startTime,
            endTime: eventSnap.data().endTime?.toDate?.()?.toISOString() || eventSnap.data().endTime
          };
          setEvent(eventData);
        } else {
          setError('Event not found. Please check the registration link.');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
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

      // Show success message
      alert('Registration successful! Thank you for volunteering.');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: ''
      });
    } catch (error) {
      console.error('Error registering volunteer:', error);
      alert('Failed to register. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="volunteer-registration-container">
        <div className="loading">Loading event details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="volunteer-registration-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="volunteer-registration-container">
      <h2>Volunteer Registration</h2>
      
      {event && (
        <div className="event-info">
          <h3>{event.name}</h3>
          <div className="event-details-simple">
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Start:</strong> {formatDateTime(event.startTime)}</p>
            <p><strong>End:</strong> {formatDateTime(event.endTime)}</p>
            {event.description && (
              <p><strong>Description:</strong> {event.description}</p>
            )}
          </div>
        </div>
      )}
      
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
            disabled={submitting}
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
            disabled={submitting}
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
            disabled={submitting}
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={submitting}
        >
          {submitting ? 'Registering...' : 'Register as Volunteer'}
        </button>
      </form>
    </div>
  );
};

export default PublicRegistration;

