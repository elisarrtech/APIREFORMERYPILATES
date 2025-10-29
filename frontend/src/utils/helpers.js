/**
 * Utilidades y funciones helper profesionales
 */

export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return new Date(dateString).toLocaleString('es-MX', defaultOptions);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
};

export const getStatusColor = (isActive) => {
  return isActive 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};

export const getRoleColor = (role) => {
  const colors = {
    admin: 'bg-purple-100 text-purple-800',
    instructor: 'bg-blue-100 text-blue-800',
    client: 'bg-green-100 text-green-800'
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};