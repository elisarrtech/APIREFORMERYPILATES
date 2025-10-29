import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  BarChart3,
  FileText,
  DollarSign,
  QrCode,
  CheckCircle,
  X,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  Camera
} from 'lucide-react';
import jsQR from 'jsqr';
import api from '../../services/api';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [mySchedules, setMySchedules] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({});
  const [earnings, setEarnings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mi-horario');
  
  // QR Scanner
  const [scannerActive, setScannerActive] = useState(false);
  const [selectedScheduleForAttendance, setSelectedScheduleForAttendance] = useState(null);
  const [scannedStudentId, setScannedStudentId] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  // Notes
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({
    student_id: '',
    title: '',
    content: '',
    type: 'general'
  });

  useEffect(() => {
    loadDashboardData();
    return () => stopScanner();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const schedulesRes = await api.get('/schedules/my-schedules');
      setMySchedules(schedulesRes.data.data || []);

      try {
        const studentsRes = await api.get('/instructor/students');
        setStudents(studentsRes.data.data || []);
      } catch (error) {
        setStudents([]);
      }

      try {
        const statsRes = await api.get('/instructor/stats');
        setStats(statsRes.data.data || {});
      } catch (error) {
        setStats({});
      }

      try {
        const earningsRes = await api.get('/instructor/earnings');
        setEarnings(earningsRes.data.data || []);
      } catch (error) {
        setEarnings([]);
      }

      try {
        const notesRes = await api.get('/instructor/notes');
        setNotes(notesRes.data.data || []);
      } catch (error) {
        setNotes([]);
      }

    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

const scanQRCode = () => {
  if (!scannerActive || !videoRef.current) return;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
    canvas.height = videoRef.current.videoHeight;
    canvas.width = videoRef.current.videoWidth;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    
    if (code) {
      // ✅ QR DETECTADO
      setScannedStudentId(code.data);  // El ID del alumno
      stopScanner();
      
      // Registrar automáticamente
      handleManualStudentId({ preventDefault: () => {} });
    }
  }
  
  requestAnimationFrame(scanQRCode);
};

  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScannerActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('❌ Error al acceder a la cámara. Verifica los permisos.');
    }
  };

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setScannerActive(false);
  };

  const handleManualStudentId = async (e) => {
    e.preventDefault();
    if (!selectedScheduleForAttendance) {
      alert('⚠️ Primero selecciona una clase');
      return;
    }

    try {
      await api.post('/attendance/mark', {
        student_id: scannedStudentId,
        schedule_id: selectedScheduleForAttendance
      });
      
      setScanResult({
        success: true,
        message: '✅ Asistencia registrada correctamente',
        student_id: scannedStudentId
      });
      
      setScannedStudentId('');
      
      setTimeout(() => {
        setScanResult(null);
      }, 3000);
      
      loadDashboardData();
    } catch (error) {
      console.error('Error:', error);
      setScanResult({
        success: false,
        message: '❌ Error al registrar asistencia',
        error: error.response?.data?.message || 'Error desconocido'
      });
    }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    try {
      if (editingNote) {
        await api.put(`/instructor/notes/${editingNote.id}`, noteForm);
        alert('✅ Nota actualizada');
      } else {
        await api.post('/instructor/notes', noteForm);
        alert('✅ Nota creada');
      }
      setShowNoteForm(false);
      setEditingNote(null);
      setNoteForm({ student_id: '', title: '', content: '', type: 'general' });
      loadDashboardData();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al guardar nota');
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteForm({
      student_id: note.student_id,
      title: note.title,
      content: note.content,
      type: note.type
    });
    setShowNoteForm(true);
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('¿Estás seguro de eliminar esta nota?')) return;
    try {
      await api.delete(`/instructor/notes/${noteId}`);
      alert('✅ Nota eliminada');
      loadDashboardData();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al eliminar nota');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-sage-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="mb-8 bg-gradient-to-r from-sage-600 to-sage-700 rounded-2xl p-8 text-white shadow-xl">
            <h1 className="text-3xl font-bold mb-2">¡Bienvenido, {user?.full_name || 'Instructor Demo'}!</h1>
            <p className="text-sage-100">Panel de Instructor</p>
          </div>

          <div className="mb-8 bg-white rounded-2xl shadow-lg p-2 flex flex-wrap gap-2">
            {[
              { id: 'mi-horario', label: 'Mi Horario', icon: Calendar },
              { id: 'lista-alumnos', label: 'Lista de Alumnos', icon: Users },
              { id: 'pasar-lista', label: 'Pasar Lista (QR)', icon: QrCode },
              { id: 'notas', label: 'Notas', icon: FileText },
              { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 },
              { id: 'ingresos', label: 'Ingresos', icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-sage-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-sage-50 hover:text-sage-700'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* MI HORARIO */}
          {activeTab === 'mi-horario' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Calendar size={28} className="text-sage-600" />
                Mi Horario de Clases
              </h2>
              {mySchedules.length === 0 ? (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-12 text-center">
                  <Calendar size={64} className="mx-auto text-amber-500 mb-4" />
                  <p className="text-amber-900 font-bold text-xl mb-2">No tienes clases programadas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mySchedules.map((schedule) => (
                    <div key={schedule.id} className="bg-gradient-to-r from-sage-50 via-white to-sage-50 border-2 border-sage-200 rounded-xl p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-sage-500 to-sage-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {schedule.time.split(':')[0]}:{schedule.time.split(':')[1]}
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-800">{schedule.class_name}</h4>
                              <p className="text-sm text-gray-600">{formatDate(schedule.date)}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-sage-200">
                              <Clock size={16} className="text-sage-600" />
                              <span>{schedule.duration} min</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-sage-200">
                              <Users size={16} className="text-sage-600" />
                              <span>{schedule.reserved}/{schedule.capacity}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedScheduleForAttendance(schedule.id);
                            setActiveTab('pasar-lista');
                          }}
                          className="px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white font-bold rounded-xl flex items-center gap-2"
                        >
                          <QrCode size={18} />
                          Pasar Lista
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LISTA ALUMNOS */}
          {activeTab === 'lista-alumnos' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Users size={28} className="text-sage-600" />
                Lista de Alumnos
              </h2>
              {students.length === 0 ? (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-12 text-center">
                  <Users size={64} className="mx-auto text-blue-500 mb-4" />
                  <p className="text-blue-900 font-bold text-xl">No hay alumnos registrados</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student) => (
                    <div key={student.id} className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-4">
                      <h3 className="font-bold text-gray-800 mb-2">{student.full_name}</h3>
                      <p className="text-sm text-gray-600">{student.email}</p>
                      <p className="text-xs text-gray-500 mt-2">Clases: {student.classes_taken || 0}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PASAR LISTA QR */}
          {activeTab === 'pasar-lista' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <QrCode size={28} className="text-sage-600" />
                Pasar Lista con QR
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Selecciona la clase</label>
                <select
                  value={selectedScheduleForAttendance || ''}
                  onChange={(e) => setSelectedScheduleForAttendance(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 outline-none"
                >
                  <option value="">Selecciona una clase</option>
                  {mySchedules.map((schedule) => (
                    <option key={schedule.id} value={schedule.id}>
                      {schedule.class_name} - {formatDate(schedule.date)} - {schedule.time}
                    </option>
                  ))}
                </select>
              </div>

              {selectedScheduleForAttendance && (
                <>
                  <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-xl p-6 mb-6">
                    <div className="text-center mb-4">
                      <QrCode size={64} className="mx-auto text-purple-500 mb-3" />
                      <p className="text-purple-900 font-bold text-xl mb-2">Escáner QR</p>
                      <p className="text-purple-700 text-sm">Escanea el código QR del alumno</p>
                    </div>

                    {!scannerActive ? (
                      <button
                        onClick={startScanner}
                        className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                      >
                        <Camera size={20} />
                        Activar Escáner
                      </button>
                    ) : (
                      <>
                        <video ref={videoRef} autoPlay playsInline className="w-full h-64 bg-black rounded-xl mb-4" />
                        <button
                          onClick={stopScanner}
                          className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                        >
                          <X size={20} />
                          Detener Escáner
                        </button>
                      </>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Ingreso Manual</h3>
                    <form onSubmit={handleManualStudentId} className="space-y-4">
                      <input
                        type="text"
                        value={scannedStudentId}
                        onChange={(e) => setScannedStudentId(e.target.value)}
                        placeholder="ID del alumno"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 outline-none"
                      />
                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={20} />
                        Registrar Asistencia
                      </button>
                    </form>
                  </div>

                  {scanResult && (
                    <div className={`mt-6 p-4 rounded-xl border-2 ${scanResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center gap-3">
                        {scanResult.success ? <CheckCircle size={24} className="text-green-600" /> : <AlertCircle size={24} className="text-red-600" />}
                        <div>
                          <p className={`font-bold ${scanResult.success ? 'text-green-900' : 'text-red-900'}`}>{scanResult.message}</p>
                          {scanResult.student_id && <p className="text-sm text-gray-600">ID: {scanResult.student_id}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* NOTAS */}
          {activeTab === 'notas' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText size={28} className="text-sage-600" />
                  Notas y Observaciones
                </h2>
                <button
                  onClick={() => {
                    setShowNoteForm(true);
                    setEditingNote(null);
                    setNoteForm({ student_id: '', title: '', content: '', type: 'general' });
                  }}
                  className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white font-semibold rounded-lg flex items-center gap-2"
                >
                  <Plus size={18} />
                  Nueva Nota
                </button>
              </div>

              {showNoteForm && (
                <div className="mb-6 bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">{editingNote ? 'Editar Nota' : 'Nueva Nota'}</h3>
                  <form onSubmit={handleSaveNote} className="space-y-4">
                    <select
                      value={noteForm.student_id}
                      onChange={(e) => setNoteForm({ ...noteForm, student_id: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 outline-none"
                    >
                      <option value="">Selecciona un alumno</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>{student.full_name}</option>
                      ))}
                    </select>
                    <select
                      value={noteForm.type}
                      onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 outline-none"
                    >
                      <option value="general">General</option>
                      <option value="performance">Rendimiento</option>
                      <option value="behavior">Comportamiento</option>
                      <option value="progress">Progreso</option>
                    </select>
                    <input
                      type="text"
                      value={noteForm.title}
                      onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                      required
                      placeholder="Título"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 outline-none"
                    />
                    <textarea
                      value={noteForm.content}
                      onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                      required
                      rows="4"
                      placeholder="Contenido"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 outline-none resize-none"
                    />
                    <div className="flex gap-4">
                      <button type="submit" className="flex-1 px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2">
                        <Save size={18} />
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNoteForm(false);
                          setEditingNote(null);
                        }}
                        className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg flex items-center justify-center gap-2"
                      >
                        <X size={18} />
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {notes.length === 0 ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-12 text-center">
                  <FileText size={64} className="mx-auto text-green-500 mb-4" />
                  <p className="text-green-900 font-bold text-xl">No hay notas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-gradient-to-r from-green-50 to-white border-2 border-green-200 rounded-xl p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                            note.type === 'performance' ? 'bg-blue-100 text-blue-700' :
                            note.type === 'behavior' ? 'bg-purple-100 text-purple-700' :
                            note.type === 'progress' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {note.type}
                          </span>
                          <h4 className="text-lg font-bold text-gray-800 mt-2 mb-2">{note.title}</h4>
                          <p className="text-sm text-gray-600 mb-2"><strong>Alumno:</strong> {note.student_name}</p>
                          <p className="text-gray-700">{note.content}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ESTADÍSTICAS */}
          {activeTab === 'estadisticas' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart3 size={28} className="text-sage-600" />
                Estadísticas
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-blue-700 uppercase">Clases Totales</h3>
                    <Calendar size={20} className="text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-blue-900">{stats.total_classes || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-green-700 uppercase">Alumnos Activos</h3>
                    <Users size={20} className="text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-green-900">{stats.active_students || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-purple-700 uppercase">Asistencia</h3>
                    <CheckCircle size={20} className="text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold text-purple-900">{stats.attendance_rate || 0}%</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-amber-700 uppercase">Rating</h3>
                    <BarChart3 size={20} className="text-amber-500" />
                  </div>
                  <p className="text-3xl font-bold text-amber-900">{stats.rating || 0}/5</p>
                </div>
              </div>
            </div>
          )}

          {/* INGRESOS */}
          {activeTab === 'ingresos' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <DollarSign size={28} className="text-sage-600" />
                Mis Ingresos
              </h2>
              {earnings.length === 0 ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-12 text-center">
                  <DollarSign size={64} className="mx-auto text-green-500 mb-4" />
                  <p className="text-green-900 font-bold text-xl">No hay ingresos registrados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {earnings.map((earning, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-white border-2 border-green-200 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-800">{earning.description}</p>
                        <p className="text-sm text-gray-600">{formatDate(earning.date)}</p>
                      </div>
                      <p className="text-2xl font-bold text-green-700">${earning.amount}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InstructorDashboard;