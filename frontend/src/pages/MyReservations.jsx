import { useState, useEffect } from 'react'
import { reservationsService } from "@services/api"; // ✅ CAMBIO

const MyReservations = () => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchReservations() }, [])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await reservationsService.listMine()
      setReservations(data.data || [])
    } catch (e) {
      setError('Error al cargar las reservas. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelReservation = async (id) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return
    try {
      await reservationsService.cancel(id)
      fetchReservations()
      alert('Reserva cancelada exitosamente')
    } catch (e) {
      alert('Error al cancelar la reserva. Por favor, intenta de nuevo.')
    }
  }

  const filtered = reservations.filter((r) => {
    if (filter === 'all') return true
    const now = new Date()
    const dt = new Date(r.schedule?.start_time || r.start_time)
    if (filter === 'upcoming') return dt >= now && r.status !== 'cancelled'
    if (filter === 'past') return dt < now || r.status === 'cancelled'
    return true
  })

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div><p className="mt-4 text-gray-600">Cargando reservas...</p></div></div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-screen"><div className="text-center"><div className="text-red-500 text-xl mb-4">⚠️</div><p className="text-red-600">{error}</p><button onClick={fetchReservations} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Reintentar</button></div></div>
  )

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
          <button onClick={fetchReservations} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Actualizar
          </button>
        </div>

        <div className="mb-6 flex space-x-4">
          {['all','upcoming','past'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-md ${filter === f ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              {f === 'all' ? `Todas (${reservations.length})` : f === 'upcoming' ? 'Próximas' : 'Pasadas'}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <p className="text-gray-500 text-lg mb-4">{filter === 'all' ? 'No tienes reservas' : filter === 'upcoming' ? 'No tienes reservas próximas' : 'No tienes reservas pasadas'}</p>
            <button onClick={() => (window.location.href = '/schedules')} className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700">Ver Horarios Disponibles</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filtered.map((r) => (
              <div key={r.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{r.schedule?.class_name || r.class_name || 'Clase'}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Instructor: {r.schedule?.instructor_name || r.instructor_name || 'N/A'}
                      </p>
                      {r.schedule?.start_time && (
                        <p className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {new Date(r.schedule.start_time).toLocaleString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${r.status === 'confirmed' ? 'bg-green-100 text-green-800' : r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : r.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {r.status === 'confirmed' ? '✅ Confirmada' : r.status === 'pending' ? '⏳ Pendiente' : r.status === 'cancelled' ? '❌ Cancelada' : r.status}
                    </span>
                    {r.status === 'confirmed' && (
                      <button onClick={() => handleCancelReservation(r.id)} className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">Cancelar Reserva</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyReservations
