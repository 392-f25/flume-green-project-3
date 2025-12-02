import { useState } from 'react';
import './App.css';
import Login from './components/Login';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import ProjectDetails from './components/ProjectDetails';
import MyEvents from './components/MyEvents';

const App = () => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  
  // Navigation state
  const [currentView, setCurrentView] = useState('browse'); // browse, myEvents, createProject, projectDetails
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  
  // Data state (will be replaced with Firebase later)
  const [projects, setProjects] = useState([]);

  // Handler for user login
  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentView('browse');
  };

  // Handler for user logout
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('browse');
    setSelectedProjectId(null);
  };

  // Handler for creating a new project
  const handleProjectCreate = (newProject) => {
    setProjects(prev => [...prev, newProject]);
    setCurrentView('browse');
  };

  // Handler for registering for a project
  const handleRegister = (projectId, registration) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          volunteers: [...(project.volunteers || []), registration]
        };
      }
      return project;
    }));
    alert('Successfully registered for project!');
  };

  // Handler for submitting volunteer hours
  const handleSubmitHours = (projectId, submission) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          hourSubmissions: [...(project.hourSubmissions || []), submission]
        };
      }
      return project;
    }));
  };

  // Handler for approving hours
  const handleApproveHours = (projectId, approvedSubmission) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          hourSubmissions: project.hourSubmissions.map(submission => 
            submission.id === approvedSubmission.id ? approvedSubmission : submission
          )
        };
      }
      return project;
    }));
    alert('Hours approved successfully!');
  };

  // Handler for sending emails (placeholder)
  const handleSendEmail = (emailData) => {
    console.log('Email would be sent:', emailData);
    // You'll implement actual email sending with Firebase later
  };

  // Handler for selecting a project to view details
  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    setCurrentView('projectDetails');
  };

  // Get the currently selected project
  const getSelectedProject = () => {
    return projects.find(p => p.id === selectedProjectId);
  };

  // If not logged in, show login page
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <nav className="app-nav">
        <div className="nav-header">
          <h1>Eagle Scout Project Tracker</h1>
          <div className="user-info">
            <span className="user-name">{currentUser.displayName}</span>
            <span className="user-role">({currentUser.role})</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <div className="nav-buttons">
          <button 
            className={currentView === 'browse' || currentView === 'projectDetails' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('browse')}
          >
            Browse Projects
          </button>
          <button 
            className={currentView === 'myEvents' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('myEvents')}
          >
            My Projects
          </button>
          <button 
            className={currentView === 'createProject' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('createProject')}
          >
            Create Project
          </button>
        </div>
      </nav>

      <main className="app-main">
        {currentView === 'browse' && (
          <EventList 
            projects={projects}
            onSelectProject={handleSelectProject}
          />
        )}

        {currentView === 'myEvents' && (
          <MyEvents 
            projects={projects}
            currentUser={currentUser}
            onSelectProject={handleSelectProject}
            onSubmitHours={handleSubmitHours}
          />
        )}

        {currentView === 'createProject' && (
          <EventForm 
            currentUser={currentUser}
            onEventCreate={handleProjectCreate} 
          />
        )}

        {currentView === 'projectDetails' && getSelectedProject() && (
          <ProjectDetails 
            project={getSelectedProject()}
            currentUser={currentUser}
            onRegister={handleRegister}
            onSubmitHours={handleSubmitHours}
            onApproveHours={handleApproveHours}
            onSendEmail={handleSendEmail}
            onBack={() => setCurrentView('browse')}
          />
        )}
      </main>
    </div>
  );
};

export default App;
