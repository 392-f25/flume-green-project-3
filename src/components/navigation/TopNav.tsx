interface TopNavProps {
  currentView: 'eventList' | 'createEvent' | 'myProjects';
  onChangeView: (view: 'eventList' | 'createEvent' | 'myProjects') => void;
  userName?: string | null;
  userPhotoUrl?: string | null;
  onSignOut: () => Promise<void>;
}

const TopNav: React.FC<TopNavProps> = ({ currentView, onChangeView, userName, userPhotoUrl, onSignOut }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-gray-900">Eagle Project Manager</h1>

          <div className="flex items-center space-x-4">
            {(['eventList', 'createEvent', 'myProjects'] as const).map((view) => (
              <button
                key={view}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentView === view ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => onChangeView(view)}
              >
                {view === 'eventList' && 'All Projects'}
                {view === 'createEvent' && 'Create Project'}
                {view === 'myProjects' && 'My Projects'}
              </button>
            ))}

            <div className="flex items-center space-x-3 pl-4 border-l border-gray-300">
              {userPhotoUrl && (
                <img
                  src={userPhotoUrl}
                  alt={userName || 'User'}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm text-gray-700">{userName}</span>
              <button
                onClick={onSignOut}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;

