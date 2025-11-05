import { useState, useCallback } from 'react';

/**
 * useModal - Custom Hook para gestión de modales
 * 
 * Características:
 * - API simple y consistente
 * - Gestión de datos del modal
 * - Performance optimizado con useCallback
 * - Type-safe ready
 * 
 * @returns {Object} Estado y funciones del modal
 * @property {boolean} isOpen - Estado del modal
 * @property {any} data - Datos asociados al modal
 * @property {Function} open - Abrir modal con datos opcionales
 * @property {Function} close - Cerrar modal y limpiar datos
 * @property {Function} toggle - Alternar estado del modal
 * 
 * @example
 * const modal = useModal();
 * modal.open({ id: 1, name: 'Test' });
 * modal.close();
 * 
 * @version 2.0.0
 * @author @elisarrtech
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);

  /**
   * Abre el modal con datos opcionales
   * @param {any} modalData - Datos a pasar al modal
   */
  const open = useCallback((modalData = null) => {
    console.log('🔓 [useModal] Abriendo modal con datos:', modalData);
    setData(modalData);
    setIsOpen(true);
  }, []);

  /**
   * Cierra el modal y limpia los datos
   */
  const close = useCallback(() => {
    console.log('🔒 [useModal] Cerrando modal');
    setIsOpen(false);
    setData(null);
  }, []);

  /**
   * Alterna el estado del modal
   */
  const toggle = useCallback(() => {
    console.log('🔄 [useModal] Alternando estado del modal');
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle
  };
};

// Export default para compatibilidad
export default useModal;