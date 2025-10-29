import { useState, useEffect } from 'react'
import { useAuth } from "@context/AuthContext"; 
import { packagesService, reservationsService } from "@services/api";

const Dashboard = () => {
  const { user } = useAuth()
  const [packages, setPackages] = useState([])
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [pRes, rRes] = await Promise.all([
        packagesService.myPackages(),
        reservationsService.listMine(),
      ])
      setPackages(pRes.data.data || [])
      setReservations(rRes.data.data || [])
    } catch (err) {
      setError('Error al cargar los datos. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div><p className="mt-4 text-gray-600">Cargando...</p></div></div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-screen"><div className="text-center"><div className="text-red-500 text-xl mb-4">⚠️</div><p className="text-red-600">{error}</p><button onClick={fetchData} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Reintentar</button></div></div>
  )

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Bienvenido, {user?.full_name || 'Usuario'}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Paquetes */}
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mis Paquetes</h3>
              {packages.length === 0 ? (
                <div className="text-center py-8"><p className="text-gray-500">No tienes paquetes activos</p><button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Comprar Paquete</button></div>
              ) : (
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{pkg.package_name || pkg.package?.name || 'Paquete'}</h4>
                          <p className="text-sm text-gray-500">Estado: <span className={`font-medium ${pkg.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>{pkg.status}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-600">{pkg.remaining_classes || 0}</p>
                          <p className="text-xs text-gray-500">de {pkg.total_classes || 0} clases</p>
                        </div>
                      </div>
                      <div className="mt-2"><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${((pkg.remaining_classes || 0) / (pkg.total_classes || 1)) * 100}%` }}></div></div></div>
                      {pkg.expiry_date && <p className="text-xs text-gray-500 mt-2">Vence: {new Date(pkg.expiry_date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reservas */}
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Próximas Reservas</h3>
              {reservations.length === 0 ? (
                <div className="text-center py-8"><p className="text-gray-500">No tienes reservas pendientes</p><button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Ver Horarios</button></div>
              ) : (
                <div className="space-y-4">
                  {reservations.slice(0, 3).map((r) => (
                    <div key={r.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-gray-900">{r.schedule?.class_name || r.class_name || 'Clase'}</h4>
                      <p className="text-sm text-gray-500">Instructor: {r.schedule?.instructor_name || r.instructor_name || 'N/A'}</p>
                      {r.schedule?.start_time && <p className="text-sm text-gray-600 mt-1">📅 {new Date(r.schedule.start_time).toLocaleString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>}
                      <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${r.status === 'confirmed' ? 'bg-green-100 text-green-800' : r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{r.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats simples */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow"><div className="px-4 py-5 sm:p-6"><div className="flex items-center"><div className="flex-shrink-0 bg-primary-500 rounded-md p-3"><svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div><div className="ml-5 w-0 flex-1"><dl><dt className="text-sm font-medium text-gray-500 truncate">Total Reservas</dt><dd className="text-3xl font-semibold text-gray-900">{reservations.length}</dd></dl></div></div></div></div>
          <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow"><div className="px-4 py-5 sm:p-6"><div className="flex items-center"><div className="flex-shrink-0 bg-green-500 rounded-md p-3"><svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div className="ml-5 w-0 flex-1"><dl><dt className="text-sm font-medium text-gray-500 truncate">Paquetes Activos</dt><dd className="text-3xl font-semibold text-gray-900">{packages.filter((p) => p.status === 'active').length}</dd></dl></div></div></div></div>
          <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow"><div className="px-4 py-5 sm:p-6"><div className="flex items-center"><div className="flex-shrink-0 bg-blue-500 rounded-md p-3"><svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div><div className="ml-5 w-0 flex-1"><dl><dt className="text-sm font-medium text-gray-500 truncate">Clases Disponibles</dt><dd className="text-3xl font-semibold text-gray-900">{packages.reduce((acc, p) => acc + (p.remaining_classes || 0), 0)}</dd></dl></div></div></div></div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
