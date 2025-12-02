import './MyEvents.css';

const MyEvents = ({ projects, currentUser, onSelectProject, onSubmitHours }) => {
  // Filter projects where user is registered
  const myProjects = projects.filter(project => 
    project.volunteers?.some(v => v.userId === currentUser?.id)
  );

  const getMySubmissions = (project) => {
    return project.hourSubmissions?.filter(h => h.userId === currentUser?.id) || [];
  };

  const getTotalApprovedHours = (project) => {
    const submissions = getMySubmissions(project);
    return submissions
      .filter(s => s.status === 'approved')
      .reduce((total, s) => total + s.hours, 0);
  };

  const getPendingSubmissions = (project) => {
    const submissions = getMySubmissions(project);
    return submissions.filter(s => s.status === 'pending');
  };

  return (
    <div className="my-events-container">
      <h2>My Registered Projects</h2>
      
      {myProjects.length > 0 ? (
        <div className="my-events-grid">
          {myProjects.map((project) => {
            const mySubmissions = getMySubmissions(project);
            const approvedHours = getTotalApprovedHours(project);
            const pendingSubmissions = getPendingSubmissions(project);

            return (
              <div key={project.id} className="my-event-card">
                <div className="card-header">
                  <h3>{project.projectName}</h3>
                  <span className="project-lead">Lead: {project.ownerName}</span>
                </div>
                
                <div className="card-body">
                  <div className="info-item">
                    <span className="label">Location:</span>
                    <span className="value">{project.location}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">Dates:</span>
                    <span className="value">
                      {new Date(project.startDate).toLocaleDateString()} - {' '}
                      {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="hours-summary">
                    <div className="hours-stat approved">
                      <span className="stat-label">Approved Hours</span>
                      <span className="stat-value">{approvedHours}</span>
                    </div>
                    
                    <div className="hours-stat expected">
                      <span className="stat-label">Expected Hours</span>
                      <span className="stat-value">{project.hoursPerVolunteer}</span>
                    </div>
                  </div>
                  
                  {pendingSubmissions.length > 0 && (
                    <div className="pending-notice">
                      <span className="pending-icon">⏱</span>
                      {pendingSubmissions.length} submission{pendingSubmissions.length > 1 ? 's' : ''} pending approval
                    </div>
                  )}
                  
                  {mySubmissions.length > 0 && (
                    <div className="submissions-list">
                      <h4>My Submissions:</h4>
                      {mySubmissions.map((submission, index) => (
                        <div key={index} className={`submission-item ${submission.status}`}>
                          <span className="submission-date">
                            {new Date(submission.dateWorked).toLocaleDateString()}
                          </span>
                          <span className="submission-hours">{submission.hours}h</span>
                          <span className={`submission-status ${submission.status}`}>
                            {submission.status === 'approved' ? '✓ Approved' : '⏱ Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="card-actions">
                  <button 
                    className="view-details-btn"
                    onClick={() => onSelectProject(project.id)}
                  >
                    View Project Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-projects">
          <p>You haven't registered for any projects yet.</p>
          <p>Browse available projects to get started!</p>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
