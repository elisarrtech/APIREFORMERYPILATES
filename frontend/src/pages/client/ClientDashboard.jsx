
/**
 * Client Dashboard - Panel Principal del Cliente
 * Autor: @elisarrtech con Elite AI Architect
 * Código de Élite Mundial - Production Ready
 * 
 * Funcionalidades:
 * - Información del paquete activo
 * - Alertas de clases y expiración
 * - Calendario semanal de reservas
 * - Próximas clases
 * - Estadísticas personales
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { reservationsService } from '@services/api';
import { 
  FaCalendarAlt, 
  FaDumbbell, 
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaChartLine,
  FaSpinner
} from 'react-icons/fa';
import { 
  formatDate, 
  formatTime, 
  getDaysUntil,
  getRelativeTime 
} from '@utils/dateUtils';
import WeeklyCalendar from '@components/WeeklyCalendar';
import LoadingSpinner from '@components/LoadingSpinner';

const ClientDashboard = () => {
  const { user } = useAuth();
  
  // Estado
  const [loading, setLoading] = useState(true);
  const [packageStatus, setPackageStatus] = useState(null);
  const [myReservations, setMyReservations] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /**
   * Cargar datos del dashboard
   */
  useEffect(() => {
    loadDashboardData();
  }, [refreshTrigger]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [packageRes, reservationsRes] = await Promise.all([
        reservationsService.getPackageStatus(),
        reservationsService.getMyReservations('confirmed')
      ]);

      setPackageStatus(packageRes.data.data);
      setMyReservations(reservationsRes.data.data || []);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Trigger para refrescar datos después de una acción
   */
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Cargando tu dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Bienvenido, {user?.full_name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Panel de cliente - FitnessClub
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <span className="inline-flex items-center px-4 py-2 rounded-lg bg-green-100 text-green-800 text-sm font-medium">
                <FaCheckCircle className="mr-2" />
                Cliente Activo
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estado del Paquete */}
        <PackageStatusCard 
          packageStatus={packageStatus} 
          onRefresh={handleRefresh}
        />

        {/* Próximas Clases */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-primary-500" />
            Mis Próximas Clases
          </h2>
          
          {myReservations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myReservations.slice(0, 6).map((reservation) => (
                <ReservationCard 
                  key={reservation.id} 
                  reservation={reservation}
                  onRefresh={handleRefresh}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FaCalendarAlt className="mx-auto text-gray-400 text-4xl mb-4" />
              <p className="text-gray-600">No tienes reservas próximas</p>
              <p className="text-sm text-gray-500 mt-2">
                Reserva tu primera clase en el calendario de abajo
              </p>
            </div>
          )}
        </div>

        {/* Calendario Semanal */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaDumbbell className="text-primary-500" />
            Calendario de Clases
          </h2>
          <WeeklyCalendar onReservationChange={handleRefresh} />
        </div>
      </div>
    </div>
  );
};

/**
 * Card de Estado del Paquete
 */
const PackageStatusCard = ({ packageStatus, onRefresh }) => {
  if (!packageStatus?.has_active_package) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
        <div className="flex items-start">
          <FaExclamationTriangle className="text-red-500 text-2xl mt-1" />
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-bold text-red-800">
              No tienes un paquete activo
            </h3>
            <p className="text-red-700 mt-1">
              Contacta al administrador para adquirir un paquete y comenzar a reservar clases.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { 
    package_name,
    total_classes,
    used_classes,
    remaining_classes,
    days_until_expiry,
    alerts 
  } = packageStatus;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header del paquete */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-bold">{package_name}</h3>
            <p className="text-primary-100 text-sm">Tu paquete activo</p>
          </div>
          <FaDumbbell className="text-white text-3xl opacity-80" />
        </div>
      </div>

      {/* Estadísticas del paquete */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Clases Disponibles */}
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">
              {remaining_classes}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Disponibles
            </div>
          </div>

          {/* Clases Usadas */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">
              {used_classes}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Usadas
            </div>
          </div>

          {/* Días Restantes */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">
              {days_until_expiry}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Días restantes
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso</span>
            <span>{Math.round((used_classes / total_classes) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-primary-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(used_classes / total_classes) * 100}%` }}
            />
          </div>
        </div>

        {/* Alertas */}
        {alerts && alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, idx) => (
              <div 
                key={idx}
                className={`
                  flex items-start gap-3 p-3 rounded-lg
                  ${alert.type === 'danger' ? 'bg-red-50 border border-red-200' : ''}
                  ${alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : ''}
                  ${alert.type === 'info' ? 'bg-blue-50 border border-blue-200' : ''}
                `}
              >
                <FaExclamationTriangle 
                  className={`
                    text-lg mt-0.5
                    ${alert.type === 'danger' ? 'text-red-500' : ''}
                    ${alert.type === 'warning' ? 'text-yellow-500' : ''}
                    ${alert.type === 'info' ? 'text-blue-500' : ''}
                  `}
                />
                <p className={`
                  text-sm flex-1
                  ${alert.type === 'danger' ? 'text-red-800' : ''}
                  ${alert.type === 'warning' ? 'text-yellow-800' : ''}
                  ${alert.type === 'info' ? 'text-blue-800' : ''}
                `}>
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Card de Reserva Individual
 */
const ReservationCard = ({ reservation, onRefresh }) => {
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) {
      return;
    }

    setCancelling(true);
    try {
      await reservationsService.cancelReservation(reservation.id);
      onRefresh();
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      alert(error.response?.data?.errors?.[0] || 'Error al cancelar la reserva');
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = reservation.can_cancel;
  const hoursUntil = getRelativeTime(reservation.start_time);

  return (
    <div 
      className="bg-white rounded-lg shadow hover:shadow-md transition p-5 border-l-4"
      style={{ borderColor: reservation.class_color }}
    >
      {/* Nombre de la clase */}
      <h3 className="font-bold text-lg text-gray-800 mb-2">
        {reservation.class_name}
      </h3>

      {/* Instructor */}
      <p className="text-sm text-gray-600 mb-3">
        👨‍🏫 {reservation.instructor_name}
      </p>

      {/* Fecha y hora */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaCalendarAlt className="text-primary-500" />
          <span>{formatDate(reservation.start_time, 'PPP')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaClock className="text-primary-500" />
          <span>
            {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
          </span>
        </div>
      </div>

      {/* Tiempo relativo */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          {hoursUntil}
        </span>
      </div>

      {/* Botón cancelar */}
      {canCancel && (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className={`
            w-full py-2 px-4 rounded-lg font-medium transition
            ${cancelling
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-500 text-white hover:bg-red-600'
            }
          `}
        >
          {cancelling ? (
            <span className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" />
              Cancelando...
            </span>
          ) : (
            'Cancelar Reserva'
          )}
        </button>
      )}
      
      {!canCancel && (
        <div className="text-xs text-gray-500 text-center">
          No se puede cancelar con menos de 2 horas de anticipación
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;

