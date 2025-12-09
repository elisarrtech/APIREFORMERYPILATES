import { useState, useEffect } from 'react';
import api from '../../services/api';

/**
 * NotificationsManagement - Panel Admin para Envío de Notificaciones
 * @version 1.0.0 - ÉLITE MUNDIAL
 * @author @elisarrtech
 */
const NotificationsManagement = () => {
  const [sendType, setSendType] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('client');
  const [notificationType, setNotificationType] = useState('info');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [users, setUsers] = useState([]);
  const [preview, setPreview] = useState(null);
  const [sending, setSending] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 5000);
  };

  const handlePreview = async () => {
    try {
      const response = await api.post('/admin/notifications/preview', {
        type: sendType,
        user_ids: selectedUsers,
        role: selectedRole
      });
      
      if (response.data.success) {
        setPreview(response.data.data);
        showNotification('success', `Se enviará a ${response.data.data.count} usuarios`);
      }
    } catch (error) {
      console.error('Error preview:', error);
      showNotification('error', 'Error al generar vista previa');
    }
  };

  const handleSend = async () => {
    if (!title.trim()) {
      showNotification('error', 'El título es requerido');
      return;
    }

    if (!message.trim()) {
      showNotification('error', 'El mensaje es requerido');
      return;
    }

    if (sendType === 'specific' && selectedUsers.length === 0) {
      showNotification('error', 'Selecciona al menos un usuario');
      return;
    }

    const count = preview?.count || 0;
    if (!confirm(`¿Enviar notificación "${title}" a ${count} usuarios?`)) {
      return;
    }

    setSending(true);
    try {
      const response = await api.post('/admin/notifications/send', {
        type: sendType,
        user_ids: selectedUsers,
        role: selectedRole,
        notification_type: notificationType,
        title: title.trim(),
        message: message.trim(),
        link: link.trim() || null
      });

      if (response.data.success) {
        showNotification('success', `✅ ${response.data.data.count} notificaciones enviadas exitosamente`);
        setTitle('');
        setMessage('');
        setLink('');
        setPreview(null);
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error('Error sending:', error);
      showNotification('error', error.response?.data?.message || 'Error al enviar notificaciones');
    } finally {
      setSending(false);
    }
  };

  const notificationTypes = [
    { value: 'info', label: '📌 Info', color: 'blue', bg: 'bg-blue-500' },
    { value: 'success', label: '✅ Éxito', color: 'green', bg: 'bg-green-500' },
    { value: 'warning', label: '⚠️ Alerta', color: 'orange', bg: 'bg-orange-500' },
    { value: 'error', label: '❌ Error', color: 'red', bg: 'bg-red-500' },
    { value: 'promo', label: '🎉 Promo', color: 'purple', bg: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      {notification.message && (
        <div className={`p-4 rounded-xl shadow-lg border-l-4 ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-500 text-green-800' 
            : 'bg-red-50 border-red-500 text-red-800'
        }`}>
          <div className="flex items-center justify-between">
            <p className="font-bold">{notification.message}</p>
            <button onClick={() => setNotification({ type: '', message: '' })}>✕</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-purple-100">
        <div className="mb-8">
          <h2 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
            <span className="text-5xl">📨</span>
            Enviar Notificaciones
          </h2>
          <p className="text-gray-600 text-lg">
            Envía notificaciones personalizadas a tus usuarios
          </p>
        </div>

        {/* Tipo de Envío */}
        <div className="mb-8">
          <label className="block text-sm font-black text-gray-900 mb-3">
            📬 DESTINATARIOS
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: 'all', label: 'Todos', icon: '👥' },
              { value: 'role', label: 'Por Rol', icon: '🎯' },
              { value: 'specific', label: 'Específicos', icon: '✅' }
            ].map(type => (
              <button
                key={type.value}
                onClick={() => { setSendType(type.value); setPreview(null); }}
                className={`p-6 rounded-xl font-bold transition-all border-2 ${
                  sendType === type.value
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                <div className="text-4xl mb-2">{type.icon}</div>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {sendType === 'role' && (
          <div className="mb-8">
            <select
              value={selectedRole}
              onChange={(e) => { setSelectedRole(e.target.value); setPreview(null); }}
              className="w-full p-4 border-2 rounded-xl font-bold"
            >
              <option value="client">👤 Clientes</option>
              <option value="instructor">🏋️ Instructores</option>
              <option value="admin">👑 Admins</option>
            </select>
          </div>
        )}

        {sendType === 'specific' && (
          <div className="mb-8">
            <select
              multiple
              value={selectedUsers}
              onChange={(e) => {
                setSelectedUsers(Array.from(e.target.selectedOptions, opt => parseInt(opt.value)));
                setPreview(null);
              }}
              className="w-full p-4 border-2 rounded-xl"
              style={{ minHeight: '200px' }}
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.full_name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-8">
          <label className="block text-sm font-black text-gray-900 mb-3">
            🎨 TIPO DE NOTIFICACIÓN
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {notificationTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setNotificationType(type.value)}
                className={`p-4 rounded-xl font-bold ${
                  notificationType === type.value
                    ? `${type.bg} text-white`
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-black text-gray-900 mb-2">
            TÍTULO *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Nueva Promoción 50% OFF"
            className="w-full p-4 border-2 rounded-xl font-bold"
            maxLength={100}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-black text-gray-900 mb-2">
            MENSAJE *
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe el mensaje..."
            rows={6}
            className="w-full p-4 border-2 rounded-xl"
            maxLength={500}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-black text-gray-900 mb-2">
            LINK (opcional)
          </label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Ej: /packages"
            className="w-full p-4 border-2 rounded-xl"
          />
        </div>

        {preview && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <p className="font-bold text-blue-900">
              📊 Se enviará a: {preview.count} usuarios
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handlePreview}
            disabled={sending}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-4 rounded-xl font-bold"
          >
            👁️ Vista Previa
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !title || !message}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold disabled:opacity-50"
          >
            {sending ? '⏳ Enviando...' : '📨 Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsManagement;