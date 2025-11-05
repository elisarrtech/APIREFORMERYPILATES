import { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import { FileText, FileDown } from 'lucide-react';

/**
 * AdvancedStatistics - Dashboard de Estadísticas Avanzadas
 * 
 * Features:
 * - Alumnos activos/inactivos
 * - Clases por instructor
 * - Asistencias por clase
 * - Asistencias por instructor
 * - Popularidad de paquetes
 * - Gráficos de progreso
 * - Exportar estadísticas PDF/CSV
 * - UI profesional y responsiva
 * 
 * @version 2.1.0
 * @author @elisarrtech
 */
const AdvancedStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAdvancedStatistics();
      console.log('📊 [AdvancedStatistics] Datos recibidos:', data);
      setStats(data);
    } catch (err) {
      console.error('❌ [AdvancedStatistics] Error:', err);
      setError('Error al cargar estadísticas. Intenta recargar la página.');
    } finally {
      setLoading(false);
    }
  };

  // ----------- EXPORT FUNCTIONS -------------
  // Export CSV
  const handleExportCSV = () => {
    if (!stats) return;
    const rows = [
      ['Sección', 'Nombre', 'Valor'],
      // Alumnos
      ...(stats.students_status
        ? [
            ['Alumnos', 'Activos', stats.students_status.active],
            ['Alumnos', 'Inactivos', stats.students_status.inactive],
            ['Alumnos', 'Total', stats.students_status.total],
          ]
        : []),
      // Clases por instructor
      ...(stats.classes_by_instructor
        ? stats.classes_by_instructor.map(item => [
            'Clases por Instructor',
            item.instructor_name,
            item.total_classes,
          ])
        : []),
      // Asistencias por clase
      ...(stats.reservations_by_class
        ? stats.reservations_by_class.map(item => [
            'Asistencias por Clase',
            item.class_name,
            `${item.attendance_percentage}%`,
          ])
        : []),
      // Asistencias por instructor
      ...(stats.reservations_by_instructor
        ? stats.reservations_by_instructor.map(item => [
            'Asistencias por Instructor',
            item.instructor_name,
            `${item.attendance_percentage}%`,
          ])
        : []),
      // Popularidad de paquetes
      ...(stats.package_purchases
        ? stats.package_purchases.map(item => [
            'Paquetes',
            item.package_name,
            item.total_purchases,
          ])
        : []),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map(e => e.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'estadisticas_avanzadas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF
  const handleExportPDF = async () => {
    if (!stats) return;
    // Lazy load jsPDF
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18);
    doc.text('Estadísticas Avanzadas', 20, y);
    y += 10;

    doc.setFontSize(12);
    // Alumnos
    if (stats.students_status) {
      doc.text(`Alumnos Activos: ${stats.students_status.active}`, 20, y);
      y += 7;
      doc.text(`Alumnos Inactivos: ${stats.students_status.inactive}`, 20, y);
      y += 7;
      doc.text(`Total Alumnos: ${stats.students_status.total}`, 20, y);
      y += 10;
    }
    // Clases por instructor
    if (stats.classes_by_instructor) {
      doc.text('Clases por Instructor:', 20, y);
      y += 8;
      stats.classes_by_instructor.forEach(item => {
        doc.text(`${item.instructor_name}: ${item.total_classes} clases`, 25, y);
        y += 6;
      });
      y += 4;
    }
    // Asistencias por clase
    if (stats.reservations_by_class) {
      doc.text('Asistencias por Clase:', 20, y);
      y += 8;
      stats.reservations_by_class.forEach(item => {
        doc.text(
          `${item.class_name}: ${item.attendance_percentage}% (${item.total_attended}/${item.total_reservations})`,
          25,
          y
        );
        y += 6;
      });
      y += 4;
    }
    // Asistencias por instructor
    if (stats.reservations_by_instructor) {
      doc.text('Asistencias por Instructor:', 20, y);
      y += 8;
      stats.reservations_by_instructor.forEach(item => {
        doc.text(
          `${item.instructor_name}: ${item.attendance_percentage}% (${item.total_attended}/${item.total_reservations})`,
          25,
          y
        );
        y += 6;
      });
      y += 4;
    }
    // Popularidad de paquetes
    if (stats.package_purchases) {
      doc.text('Popularidad de Paquetes:', 20, y);
      y += 8;
      stats.package_purchases.forEach(item => {
        doc.text(`${item.package_name}: ${item.total_purchases} compras`, 25, y);
        y += 6;
      });
      y += 4;
    }
    doc.save('estadisticas_avanzadas.pdf');
  };

  // ----------- END EXPORT FUNCTIONS -------------

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-700">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Error al cargar estadísticas</h3>
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={loadStatistics}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
        <p className="text-yellow-700 font-bold">No hay datos de estadísticas disponibles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Export buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Estadísticas Avanzadas
          </h2>
          <p className="text-gray-600 mt-1 font-medium">Análisis detallado del sistema</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white font-semibold rounded-lg flex items-center gap-2"
          >
            <FileDown size={18} />
            Exportar CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white font-semibold rounded-lg flex items-center gap-2"
          >
            <FileText size={18} />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Alumnos Activos/Inactivos */}
      {stats.students_status && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Alumnos Activos</h3>
                <p className="text-5xl font-black">{stats.students_status.active}</p>
              </div>
              <div className="text-6xl opacity-50">✅</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Alumnos Inactivos</h3>
                <p className="text-5xl font-black">{stats.students_status.inactive}</p>
              </div>
              <div className="text-6xl opacity-50">❌</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Total Alumnos</h3>
                <p className="text-5xl font-black">{stats.students_status.total}</p>
              </div>
              <div className="text-6xl opacity-50">👥</div>
            </div>
          </div>
        </div>
      )}

      {/* Clases por Instructor */}
      {stats.classes_by_instructor && stats.classes_by_instructor.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
          <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">🏋️</span>
            Clases por Instructor
          </h3>
          <div className="space-y-3">
            {stats.classes_by_instructor.map(item => (
              <div key={item.instructor_id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">{item.instructor_name}</span>
                </div>
                <span className="text-3xl font-black text-blue-600">{item.total_classes} clases</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-3xl">🏋️</span>
            Clases por Instructor
          </h3>
          <p className="text-blue-700 font-medium">No hay clases programadas aún.</p>
        </div>
      )}

      {/* Asistencias por Clase */}
      {stats.reservations_by_class && stats.reservations_by_class.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
          <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">📈</span>
            Asistencias por Clase
          </h3>
          <div className="space-y-4">
            {stats.reservations_by_class.map(item => (
              <div key={item.class_id} className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-900 text-lg">{item.class_name}</span>
                  <span className="text-2xl font-black text-purple-600">{item.attendance_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-700 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${item.attendance_percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  {item.total_attended} asistencias de {item.total_reservations} reservas
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
          <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-3xl">📈</span>
            Asistencias por Clase
          </h3>
          <p className="text-purple-700 font-medium">No hay reservas registradas aún.</p>
        </div>
      )}

      {/* Asistencias por Instructor */}
      {stats.reservations_by_instructor && stats.reservations_by_instructor.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100">
          <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">📊</span>
            Asistencias por Instructor
          </h3>
          <div className="space-y-4">
            {stats.reservations_by_instructor.map(item => (
              <div key={item.instructor_id} className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-900 text-lg">{item.instructor_name}</span>
                  <span className="text-2xl font-black text-green-600">{item.attendance_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-700 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${item.attendance_percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  {item.total_attended} asistencias de {item.total_reservations} reservas
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-3xl">📊</span>
            Asistencias por Instructor
          </h3>
          <p className="text-green-700 font-medium">No hay asistencias registradas aún.</p>
        </div>
      )}

      {/* Popularidad de Paquetes */}
      {stats.package_purchases && stats.package_purchases.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-100">
          <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">📦</span>
            Popularidad de Paquetes
          </h3>
          <div className="space-y-3">
            {stats.package_purchases.map(item => (
              <div key={item.package_id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">{item.package_name}</span>
                </div>
                <span className="text-3xl font-black text-orange-600">{item.total_purchases} compras</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
          <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-3xl">📦</span>
            Popularidad de Paquetes
          </h3>
          <p className="text-orange-700 font-medium">No hay paquetes asignados aún.</p>
        </div>
      )}

      {/* Botón de recarga */}
      <div className="flex justify-center pt-6">
        <button
          onClick={loadStatistics}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar Estadísticas
        </button>
      </div>
    </div>
  );
};

export default AdvancedStatistics;