import { useState } from 'react';
import './ProjectDetails.css';
import HourSubmission from './HourSubmission';
import HourApproval from './HourApproval';
import EmailVolunteers from './EmailVolunteers';

const ProjectDetails = ({ 
  project, 
  currentUser, 
  onRegister, 
  onSubmitHours,
  onApproveHours,
  onSendEmail,
  onBack 
}) => {
  const [showHourSubmission, setShowHourSubmission] = useState(false);
  const [showHourApproval, setShowHourApproval] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const isOwner = currentUser?.id === project.ownerId;
  const isRegistered = project.volunteers?.some(v => v.userId === currentUser?.id);
  
  const scoutVolunteers = project.volunteers?.filter(v => v.role === 'scout') || [];
  const parentVolunteers = project.volunteers?.filter(v => v.role === 'parent') || [];
  
  const approvedSubmissions = project.hourSubmissions?.filter(h => h.status === 'approved') || [];

  const handleRegister = () => {
    const registration = {
      userId: currentUser.id,
      userName: currentUser.displayName,
      userEmail: currentUser.email,
      role: currentUser.role,
      registeredAt: new Date().toISOString()
    };
    onRegister(project.id, registration);
  };

  return (
    <div className="project-details-container">
      <button className="back-btn" onClick={onBack}>
        ← Back to Projects
      </button>

      <div className="project-header">
        <h2>{project.projectName}</h2>
        <span className="owner-badge">Project Lead: {project.ownerName}</span>
      </div>

      <div className="project-info">
        <div className="info-section">
          <h3>Project Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Location:</span>
              <span className="value">{project.location}</span>
            </div>
            <div className="info-item">
              <span className="label">Start Date:</span>
              <span className="value">{new Date(project.startDate).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="label">End Date:</span>
              <span className="value">{new Date(project.endDate).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="label">Expected Hours:</span>
              <span className="value">{project.hoursPerVolunteer} hours</span>
            </div>
          </div>
          <div className="description">
            <h4>Description:</h4>
            <p>{project.description}</p>
          </div>
        </div>

        <div className="info-section">
          <h3>Volunteer Spots</h3>
          <div className="volunteer-spots">
            <div className="spot-item">
              <span className="label">Scout Volunteers:</span>
              <span className="value">
                {scoutVolunteers.length} / {project.scoutVolunteersNeeded}
              </span>
            </div>
            <div className="spot-item">
              <span className="label">Parent Volunteers:</span>
              <span className="value">
                {parentVolunteers.length} / {project.parentVolunteersNeeded}
              </span>
            </div>
          </div>
        </div>
      </div>

      {!isOwner && !isRegistered && (
        <div className="action-section">
          <button className="register-btn" onClick={handleRegister}>
            Register for This Project
          </button>
        </div>
      )}

      {!isOwner && isRegistered && (
        <div className="action-section">
          <div className="registered-badge">✓ You are registered for this project</div>
          <button 
            className="action-btn"
            onClick={() => setShowHourSubmission(!showHourSubmission)}
          >
            {showHourSubmission ? 'Hide' : 'Submit'} Volunteer Hours
          </button>
          {showHourSubmission && (
            <HourSubmission 
              projectId={project.id}
              currentUser={currentUser}
              onSubmit={onSubmitHours}
            />
          )}
        </div>
      )}

      {isOwner && (
        <div className="owner-actions">
          <button 
            className="action-btn primary"
            onClick={() => setShowHourApproval(!showHourApproval)}
          >
            {showHourApproval ? 'Hide' : 'Review'} Hour Submissions
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => setShowEmailForm(!showEmailForm)}
          >
            {showEmailForm ? 'Hide' : 'Email'} All Volunteers
          </button>
          
          {showHourApproval && (
            <HourApproval 
              projectId={project.id}
              submissions={project.hourSubmissions || []}
              onApprove={onApproveHours}
            />
          )}
          
          {showEmailForm && (
            <EmailVolunteers 
              volunteers={project.volunteers || []}
              projectName={project.projectName}
              onSend={onSendEmail}
            />
          )}
        </div>
      )}

      <div className="volunteers-section">
        <h3>Registered Volunteers</h3>
        {project.volunteers && project.volunteers.length > 0 ? (
          <div className="volunteers-list">
            <div className="volunteer-category">
              <h4>Scout Volunteers ({scoutVolunteers.length})</h4>
              <ul>
                {scoutVolunteers.map((volunteer, index) => (
                  <li key={index}>
                    {volunteer.userName}
                    {!isOwner && <span className="email-hidden"> ({volunteer.userEmail})</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="volunteer-category">
              <h4>Parent Volunteers ({parentVolunteers.length})</h4>
              <ul>
                {parentVolunteers.map((volunteer, index) => (
                  <li key={index}>
                    {volunteer.userName}
                    {!isOwner && <span className="email-hidden"> ({volunteer.userEmail})</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="no-volunteers">No volunteers registered yet.</p>
        )}
      </div>

      <div className="approved-hours-section">
        <h3>Approved Volunteer Hours</h3>
        {approvedSubmissions.length > 0 ? (
          <table className="hours-table">
            <thead>
              <tr>
                <th>Volunteer</th>
                <th>Date Worked</th>
                <th>Hours</th>
                <th>Signature</th>
              </tr>
            </thead>
            <tbody>
              {approvedSubmissions.map((submission, index) => (
                <tr key={index}>
                  <td>{submission.userName}</td>
                  <td>{new Date(submission.dateWorked).toLocaleDateString()}</td>
                  <td>{submission.hours} hours</td>
                  <td className="signature">{submission.approverSignature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-hours">No approved hours yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
