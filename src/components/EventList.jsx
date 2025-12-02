import './EventList.css';

const EventList = ({ projects, onSelectProject }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="event-list-container">
      <h2>Eagle Scout Project Opportunities</h2>
      <p className="subtitle">Browse and register for volunteer opportunities</p>
      
      {projects && projects.length > 0 ? (
        <div className="events-grid">
          {projects.map((project) => {
            const scoutVolunteers = project.volunteers?.filter(v => v.role === 'scout') || [];
            const parentVolunteers = project.volunteers?.filter(v => v.role === 'parent') || [];
            
            return (
              <div key={project.id} className="event-card">
                <div className="event-header">
                  <h3>{project.projectName}</h3>
                  <span className="project-lead">Lead: {project.ownerName}</span>
                </div>
                
                <div className="event-details">
                  <div className="detail-item">
                    <span className="label">Location:</span>
                    <span className="value">{project.location}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Start:</span>
                    <span className="value">{formatDate(project.startDate)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">End:</span>
                    <span className="value">{formatDate(project.endDate)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Expected Hours:</span>
                    <span className="value">{project.hoursPerVolunteer} hours</span>
                  </div>
                  
                  <div className="volunteer-needs">
                    <div className="need-item">
                      <span className="need-label">Scouts:</span>
                      <span className="need-value">
                        {scoutVolunteers.length}/{project.scoutVolunteersNeeded}
                      </span>
                    </div>
                    <div className="need-item">
                      <span className="need-label">Parents:</span>
                      <span className="need-value">
                        {parentVolunteers.length}/{project.parentVolunteersNeeded}
                      </span>
                    </div>
                  </div>
                  
                  <div className="detail-item description">
                    <span className="label">Description:</span>
                    <p className="value">{project.description}</p>
                  </div>
                </div>
                
                <div className="event-actions">
                  <button 
                    className="action-btn primary"
                    onClick={() => onSelectProject(project.id)}
                  >
                    View Details & Register
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-events">
          <p>No Eagle Scout projects have been posted yet.</p>
          <p>Check back soon for new volunteer opportunities!</p>
        </div>
      )}
    </div>
  );
};

export default EventList;
