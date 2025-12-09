import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const getTypeIcon = (type) => {
    const icons = {
      info: '📌',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      promo: '🎉'
    };
    return icons[type] || '📌';
  };

  const getTypeBg = (type) => {
    const colors = {
      info: 'from-blue-50 to-blue-100 border-blue-200',
      success: 'from-green-50 to-green-100 border-green-200',
      warning: 'from-orange-50 to-orange-100 border-orange-200',
      error: 'from-red-50 to-red-100 border-red-200',
      promo: 'from-purple-50 to-purple-100 border-purple-200'
    };
    return colors[type] || 'from-gray-50 to-gray-100 border-gray-200';
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <div
      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-all cursor-pointer ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl flex-shrink-0">
          {getTypeIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-bold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
              {notification.title}
            </h4>
            {!notification.read && (
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(notification.created_at), { 
                addSuffix: true, 
                locale: es 
              })}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              className="text-xs text-red-500 hover:text-red-700 hover:underline"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;