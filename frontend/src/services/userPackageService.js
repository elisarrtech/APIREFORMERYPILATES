import api from './api';

/**
 * User Package Service
 * Gestión de paquetes del usuario
 * @version 1.0.0 - ÉLITE MUNDIAL
 * @author @elisarrtech
 */
class UserPackageService {
  constructor() {
    this.baseURL = '/user-packages';
  }

  /**
   * Obtiene los paquetes del usuario autenticado
   * @returns {Promise<Object>} Respuesta con lista de paquetes
   */
  async getMyPackages() {
    try {
      console.log('📦 [UserPackageService] Obteniendo mis paquetes...');
      const response = await api.get(`${this.baseURL}/my-packages`);
      console.log(`✅ [UserPackageService] ${response.data.data?.length || 0} paquetes obtenidos`);
      return response.data;
    } catch (error) {
      console.error('❌ [UserPackageService] Error obteniendo paquetes:', error);
      throw error;
    }
  }

  /**
   * Verifica si el usuario tiene paquetes activos con clases disponibles
   * @returns {Promise<boolean>} true si tiene paquetes activos
   */
  async hasActivePackages() {
    try {
      const response = await this.getMyPackages();
      const packages = response.data || [];
      
      // Verificar si hay al menos un paquete activo con clases disponibles
      const hasActive = packages.some(pkg => 
        pkg.remaining_classes > 0 && 
        pkg.status === 'active'
      );
      
      console.log(`📊 [UserPackageService] ¿Tiene paquetes activos? ${hasActive}`);
      return hasActive;
    } catch (error) {
      console.error('❌ [UserPackageService] Error verificando paquetes activos:', error);
      return false;
    }
  }

  /**
   * Compra un paquete
   * @param {number} packageId - ID del paquete a comprar
   * @returns {Promise<Object>} Respuesta de la compra
   */
  async purchasePackage(packageId) {
    try {
      console.log(`🛒 [UserPackageService] Comprando paquete ${packageId}...`);
      const response = await api.post(`${this.baseURL}/purchase`, { package_id: packageId });
      console.log('✅ [UserPackageService] Paquete comprado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ [UserPackageService] Error comprando paquete:', error);
      throw error;
    }
  }

  /**
   * Obtiene el historial de paquetes del usuario
   * @returns {Promise<Object>} Historial de paquetes
   */
  async getHistory() {
    try {
      console.log('📜 [UserPackageService] Obteniendo historial...');
      const response = await api.get(`${this.baseURL}/history`);
      console.log('✅ [UserPackageService] Historial obtenido');
      return response.data;
    } catch (error) {
      console.error('❌ [UserPackageService] Error obteniendo historial:', error);
      throw error;
    }
  }
}

const userPackageServiceInstance = new UserPackageService();
export default userPackageServiceInstance;