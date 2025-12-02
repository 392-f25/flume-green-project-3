import { useState } from 'react';
import './HourApproval.css';

const HourApproval = ({ projectId, submissions, onApprove }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedHours, setEditedHours] = useState('');
  const [signature, setSignature] = useState('');

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  const handleApprove = (submission) => {
    if (!signature.trim()) {
      alert('Please enter your digital signature to approve.');
      return;
    }

    const approvedSubmission = {
      ...submission,
      hours: editingId === submission.id ? parseFloat(editedHours) : submission.hours,
      status: 'approved',
      approverSignature: signature,
      approvedAt: new Date().toISOString()
    };

    onApprove(projectId, approvedSubmission);
    setEditingId(null);
    setEditedHours('');
    setSignature('');
  };

  const startEditing = (submission) => {
    setEditingId(submission.id);
    setEditedHours(submission.hours.toString());
  };

  return (
    <div className="hour-approval-container">
      <h3>Review Hour Submissions</h3>
      
      {pendingSubmissions.length > 0 ? (
        <div className="submissions-list">
          {pendingSubmissions.map((submission) => (
            <div key={submission.id} className="submission-card">
              <div className="submission-header">
                <h4>{submission.userName}</h4>
                <span className="email">{submission.userEmail}</span>
              </div>
              
              <div className="submission-details">
                <div className="detail-item">
                  <span className="label">Date Worked:</span>
                  <span className="value">
                    {new Date(submission.dateWorked).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="label">Hours Submitted:</span>
                  {editingId === submission.id ? (
                    <input
                      type="number"
                      value={editedHours}
                      onChange={(e) => setEditedHours(e.target.value)}
                      min="0.5"
                      step="0.5"
                      className="hours-edit-input"
                    />
                  ) : (
                    <span className="value">{submission.hours} hours</span>
                  )}
                </div>
                
                <div className="detail-item">
                  <span className="label">Submitted:</span>
                  <span className="value">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="approval-actions">
                {editingId !== submission.id && (
                  <button 
                    className="edit-btn"
                    onClick={() => startEditing(submission)}
                  >
                    Edit Hours
                  </button>
                )}
                
                <div className="signature-section">
                  <label htmlFor={`signature-${submission.id}`}>
                    Digital Signature:
                  </label>
                  <input
                    type="text"
                    id={`signature-${submission.id}`}
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Type your full name"
                    className="signature-input"
                  />
                </div>
                
                <button 
                  className="approve-btn"
                  onClick={() => handleApprove(submission)}
                >
                  Approve {editingId === submission.id && '(With Edited Hours)'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-submissions">No pending hour submissions.</p>
      )}
    </div>
  );
};

export default HourApproval;
