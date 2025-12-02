import { useState } from 'react';
import './EmailVolunteers.css';

const EmailVolunteers = ({ volunteers, projectName, onSend }) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
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
    
    const emailData = {
      recipients: volunteers.map(v => v.userEmail),
      subject: formData.subject,
      message: formData.message,
      sentAt: new Date().toISOString()
    };

    // You'll implement the actual email sending with Firebase later
    onSend(emailData);

    // Reset form
    setFormData({
      subject: '',
      message: ''
    });

    alert(`Email will be sent to ${volunteers.length} volunteer(s)`);
  };

  return (
    <div className="email-volunteers-container">
      <h3>Email All Volunteers</h3>
      
      <div className="recipients-info">
        <p><strong>Recipients:</strong> {volunteers.length} volunteer{volunteers.length !== 1 ? 's' : ''}</p>
        <details className="recipients-list">
          <summary>View Recipients</summary>
          <ul>
            {volunteers.map((volunteer, index) => (
              <li key={index}>
                {volunteer.userName} ({volunteer.userEmail})
              </li>
            ))}
          </ul>
        </details>
      </div>

      <form onSubmit={handleSubmit} className="email-form">
        <div className="form-group">
          <label htmlFor="subject">Subject *</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder={`Update: ${projectName}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="8"
            placeholder="Type your message to all volunteers..."
          />
        </div>

        <button type="submit" className="send-btn">
          Send Email to All Volunteers
        </button>
      </form>
    </div>
  );
};

export default EmailVolunteers;
