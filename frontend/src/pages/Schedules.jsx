import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Schedules = () => {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [showReserveModal, setShowReserveModal] = useState(false)

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/v1/reservations/schedules')
      
      // Filtrar solo los horarios de esta semana
      const now = new Date()
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay())) // Domingo
      const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 7)) // Próximo domingo
      
      const thisWeekSchedules = response.data.data.filter(schedule => {
        const scheduleDate = new Date(schedule.start_time)
        return scheduleDate >= weekStart && scheduleDate < weekEnd
      })
      
      setSchedules(thisWeekSchedules)
    } catch (error) {
      console.error('Error fetching schedules:', error)
      setError('Error al cargar horarios')
    } finally {
      setLoading(false)
    }
  }

  const handleReserve = async (scheduleId) => {
    try {
      setError('')
      setSuccess('')
      
      await axios.post('http://localhost:5000/api/v1/reservations/reserve', {
        schedule_id: scheduleId
      })
      
      setSuccess('Reserva realizada exitosamente')
      setShowReserveModal(false)
      setSelectedSchedule(null)
      fetchSchedules()
    } catch (error) {
      setError(error.response?.data?.message || 'Error al realizar reserva')
    }
  }

  const groupSchedulesByDay = () => {
    const grouped = {}
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    
    schedules.forEach(schedule => {
      const date = new Date(schedule.start_time)
      const dayName = days[date.getDay()]
      const dateKey = date.toISOString().split('T')[0]
      const key = `${dayName} ${date.getDate()}/${date.getMonth() + 1}`
      
      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push(schedule)
    })
    
    return grouped
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const groupedSchedules = groupSchedulesByDay()

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Horarios de Esta Semana
        </h1>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {Object.keys(groupedSchedules).length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">No hay horarios disponibles esta semana</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSchedules).map(([day, daySchedules]) => (
              <div key={day} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="bg-primary-600 px-6 py-3">
                  <h2 className="text-xl font-bold text-white">{day}</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {schedule.class_name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600 mb-4">
                          <p>
                            <span className="font-medium">Hora:</span>{' '}
                            {new Date(schedule.start_time).toLocaleTimeString('es-MX', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p>
                            <span className="font-medium">Instructor:</span>{' '}
                            {schedule.instructor_name}
                          </p>
                          <p>
                            <span className="font-medium">Cupos:</span>{' '}
                            {schedule.available_spots} / {schedule.max_capacity}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedSchedule(schedule)
                            setShowReserveModal(true)
                          }}
                          disabled={schedule.is_full}
                          className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
                            schedule.is_full
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-primary-600 hover:bg-primary-700 text-white'
                          }`}
                        >
                          {schedule.is_full ? 'Lleno' : 'Reservar'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Confirmar Reserva */}
        {showReserveModal && selectedSchedule && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Confirmar Reserva
                </h3>
                <div className="space-y-2 mb-6">
                  <p><strong>Clase:</strong> {selectedSchedule.class_name}</p>
                  <p><strong>Instructor:</strong> {selectedSchedule.instructor_name}</p>
                  <p>
                    <strong>Fecha y Hora:</strong>{' '}
                    {new Date(selectedSchedule.start_time).toLocaleString('es-MX', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p><strong>Duración:</strong> {selectedSchedule.duration} minutos</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReserve(selectedSchedule.id)}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => {
                      setShowReserveModal(false)
                      setSelectedSchedule(null)
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Schedules