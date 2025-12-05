import { useMemo, useState } from 'react';
import { NotificationItem } from '../../types/notifications';

interface TopNavProps {
  currentView: 'eventList' | 'createEvent' | 'myProjects' | 'volunteeringHistory';
  onChangeView: (view: 'eventList' | 'createEvent' | 'myProjects' | 'volunteeringHistory') => void;
  userName?: string | null;
  userPhotoUrl?: string | null;
  onSignOut: () => Promise<void>;
  notifications?: NotificationItem[];
  onMarkNotificationRead?: (id: string) => Promise<void> | void;
  onMarkAllNotificationsRead?: () => Promise<void> | void;
}

const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onChangeView,
  userName,
  userPhotoUrl,
  onSignOut,
  notifications = [],
  onMarkNotificationRead,
  onMarkAllNotificationsRead
}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-gray-900">Eagle Project Manager</h1>

          <div className="flex items-center space-x-4">
            {(['eventList', 'createEvent', 'myProjects', 'volunteeringHistory'] as const).map((view) => (
              <button
                key={view}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentView === view ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => onChangeView(view)}
              >
                {view === 'eventList' && 'All Projects'}
                {view === 'createEvent' && 'Create Project'}
                {view === 'myProjects' && 'My Projects'}
                {view === 'volunteeringHistory' && 'Volunteering History'}
              </button>
            ))}

            <div className="relative flex items-center space-x-3 pl-4 border-l border-gray-300">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen((prev) => !prev)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Notifications"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-900">Notifications</span>
                      {notifications.length > 0 && (
                        <button
                          type="button"
                          onClick={() => onMarkAllNotificationsRead?.()}
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">You’re all caught up.</div>
                      ) : (
                        notifications.map((item) => (
                          <div key={item.id} className={`px-4 py-3 ${item.read ? 'bg-white' : 'bg-primary-50'}`}>
                            <div className="flex items-start justify-between space-x-3">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                                <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{item.body}</p>
                                {item.eventName && (
                                  <p className="mt-1 text-xs text-gray-500">Event: {item.eventName}</p>
                                )}
                              </div>
                              {!item.read && (
                                <button
                                  type="button"
                                  onClick={() => onMarkNotificationRead?.(item.id)}
                                  className="text-xs text-primary-600 hover:text-primary-700"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

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

