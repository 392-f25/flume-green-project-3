import { useState } from 'react';
import './HourSubmission.css';

const HourSubmission = ({ projectId, currentUser, onSubmit }) => {
  const [formData, setFormData] = useState({
    hours: '',
    dateWorked: ''
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
    
    const submission = {
      id: Date.now().toString(),
      projectId: projectId,
      userId: currentUser.id,
      userName: currentUser.displayName,
      userEmail: currentUser.email,
      hours: parseFloat(formData.hours),
      dateWorked: formData.dateWorked,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      approverSignature: null
    };

    onSubmit(projectId, submission);

    // Reset form
    setFormData({
      hours: '',
      dateWorked: ''
    });

    alert('Hours submitted for approval!');
  };

  return (
    <div className="hour-submission-container">
      <h3>Submit Volunteer Hours</h3>
      <form onSubmit={handleSubmit} className="hour-submission-form">
        <div className="form-group">
          <label htmlFor="dateWorked">Date Worked *</label>
          <input
            type="date"
            id="dateWorked"
            name="dateWorked"
            value={formData.dateWorked}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="hours">Hours Worked *</label>
          <input
            type="number"
            id="hours"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            required
            min="0.5"
            step="0.5"
            placeholder="0.0"
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit Hours for Approval
        </button>
      </form>
    </div>
  );
};

export default HourSubmission;
