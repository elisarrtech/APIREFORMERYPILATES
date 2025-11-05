import NotificationItem from './NotificationItem';

const NotificationDropdown = ({ 
  notifications, 
  unreadCount, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onDelete, 
  onRefresh,
  loading 
}) => {
  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border-2 border-gray-200 z-50 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b-2 border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-black text-gray-900">Notificaciones</h3>
          <button
            onClick={onRefresh}
            className="text-purple-600 hover:text-purple-700 p-1 rounded-lg hover:bg-purple-100 transition-all"
            title="Actualizar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {unreadCount} sin leer
            </span>
            <button
              onClick={onMarkAllAsRead}
              disabled={loading}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline disabled:opacity-50"
            >
              {loading ? 'Marcando...' : 'Marcar todas como leídas'}
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-gray-500 font-medium">No tienes notificaciones</p>
          </div>
        ) : (
          notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t-2 border-gray-100 bg-gray-50">
          <button className="w-full text-center text-sm font-bold text-purple-600 hover:text-purple-700 py-2 rounded-lg hover:bg-purple-50 transition-all">
            Ver todas las notificaciones
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;