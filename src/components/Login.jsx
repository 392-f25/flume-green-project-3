import { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'scout' // scout, parent, or leader
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
    
    // Mock user object - you'll replace this with Firebase Auth later
    const user = {
      id: Date.now().toString(),
      email: formData.email,
      displayName: isSignUp ? formData.displayName : formData.email.split('@')[0],
      role: formData.role
    };

    // Call parent login handler
    if (onLogin) {
      onLogin(user);
    }

    // Reset form
    setFormData({
      email: '',
      password: '',
      displayName: '',
      role: 'scout'
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Eagle Scout Project Tracker</h1>
          <p className="login-subtitle">Manage and track volunteer hours for Eagle Scout projects</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="displayName">Display Name *</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </div>
          )}

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

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength="6"
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="role">I am a: *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="scout">Scout</option>
                <option value="parent">Parent Volunteer</option>
                <option value="leader">Troop Leader</option>
              </select>
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          <p className="toggle-mode">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              className="link-btn"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
