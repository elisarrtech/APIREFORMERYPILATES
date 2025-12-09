import { useState, useEffect, useCallback } from 'react';
import adminService from '../services/adminService';

/**
 * useAdminData - Custom Hook para gestión de datos administrativos
 * 
 * Características:
 * - Carga paralela optimizada con Promise.allSettled
 * - Manejo robusto de errores
 * - Estado centralizado
 * - Refetch bajo demanda
 * - Performance optimizado con useCallback
 * 
 * @returns {Object} Estado y funciones del dashboard
 * @property {Object} stats - Estadísticas del sistema
 * @property {Array} users - Lista de usuarios
 * @property {Array} instructors - Lista de instructores
 * @property {Array} packages - Lista de paquetes
 * @property {Array} classes - Lista de clases
 * @property {Array} schedules - Lista de horarios
 * @property {boolean} loading - Estado de carga
 * @property {string|null} error - Mensaje de error
 * @property {Function} refetch - Función para recargar datos
 * 
 * @example
 * const { stats, users, loading, refetch } = useAdminData();
 * 
 * @version 2.0.0
 * @author @elisarrtech
 */
export const useAdminData = () => {
  // ==================== ESTADO INICIAL ====================
  const [state, setState] = useState({
    stats: null,
    users: [],
    instructors: [],
    packages: [],
    classes: [],
    schedules: [],
    loading: true,
    error: null
  });

  // ==================== FUNCIÓN DE CARGA DE DATOS ====================
  /**
   * Carga todos los datos del dashboard de forma paralela
   * Utiliza Promise.allSettled para no fallar si alguna petición falla
   */
  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null 
      }));
      
      console.log('🚀 [useAdminData] Iniciando carga de datos...');
      
      // Carga paralela de todos los datos
      const data = await adminService.fetchAllData();
      
      console.log('✅ [useAdminData] Datos cargados exitosamente:', {
        stats: !!data.stats,
        users: data.users.length,
        instructors: data.instructors.length,
        packages: data.packages.length,
        classes: data.classes.length,
        schedules: data.schedules.length
      });
      
      setState(prev => ({
        ...prev,
        ...data,
        loading: false,
        error: null
      }));
      
    } catch (error) {
      console.error('❌ [useAdminData] Error crítico al cargar datos:', error);
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al cargar los datos del dashboard'
      }));
    }
  }, []);

  // ==================== EFECTO DE INICIALIZACIÓN ====================
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ==================== RETORNO DEL HOOK ====================
  return {
    // Datos
    stats: state.stats,
    users: state.users,
    instructors: state.instructors,
    packages: state.packages,
    classes: state.classes,
    schedules: state.schedules,
    
    // Estados
    loading: state.loading,
    error: state.error,
    
    // Acciones
    refetch: fetchData
  };
};

// Export default para compatibilidad
export default useAdminData;