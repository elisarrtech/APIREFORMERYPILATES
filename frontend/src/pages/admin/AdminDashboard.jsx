import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    users: { total: 0, clients: 0, instructors: 0, active: 0 },
    packages: { total: 0, active: 0, assigned: 0 },
    classes: { total: 0, active: 0 },
    schedules: { total: 0, scheduled: 0, cancelled: 0, completed: 0 },
    reservations: { total: 0, confirmed: 0, cancelled: 0 }
  })
  const [users, setUsers] = useState([])
  const [packages, setPackages] = useState([])
  const [classes, setClasses] = useState([])
  const [instructors, setInstructors] = useState([])
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  
  // Modals
  const [showCreatePackageModal, setShowCreatePackageModal] = useState(false)
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [showCreateScheduleModal, setShowCreateScheduleModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [showEditPackageModal, setShowEditPackageModal] = useState(false)
  
  // Formularios
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [newPackage, setNewPackage] = useState({
    name: '',
    description: '',
    total_classes: '',
    validity_days: 30,
    price: '',
    active: true
  })
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'client',
    active: true
  })
  const [newSchedule, setNewSchedule] = useState({
    pilates_class_id: '',
    instructor_id: '',
    start_time: '',
    end_time: '',
    max_capacity: 10,
    notes: ''
  })

  useEffect(() => {
    fetchAdminData()
  }, [])

const fetchAdminData = async () => {
  try {
    setLoading(true)
    setError('') // Limpiar error anterior
    
    // Obtener estadísticas
    try {
      const statsResponse = await axios.get('http://localhost:5000/api/v1/admin-reformery/statistics')
      setStats(statsResponse.data.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }

    // Obtener usuarios
    try {
      const usersResponse = await axios.get('http://localhost:5000/api/v1/admin-reformery/users')
      setUsers(usersResponse.data.data)
    } catch (err) {
      console.error('Error fetching users:', err)
    }

    // Obtener instructores
    try {
      const instructorsResponse = await axios.get('http://localhost:5000/api/v1/admin-reformery/users?role=instructor')
      setInstructors(instructorsResponse.data.data)
    } catch (err) {
      console.error('Error fetching instructors:', err)
    }

    // Obtener paquetes
    try {
      const packagesResponse = await axios.get('http://localhost:5000/api/v1/admin-reformery/packages')
      setPackages(packagesResponse.data.data)
    } catch (err) {
      console.error('Error fetching packages:', err)
    }

    // Obtener clases - CORREGIDO
    try {
      const classesResponse = await axios.get('/api/v1/admin-reformery/classes', config);
      setClasses(classesResponse.data.data || [])
      
    } catch (err) {
      console.error('Error fetching classes:', err)
      setClasses([]) // Array vacío si falla
    }

    // Obtener horarios
    try {
      const schedulesResponse = await axios.get('/api/v1/admin-reformery/schedules', config);
      setSchedules(schedulesResponse.data.data)
    } catch (err) {
      console.error('Error fetching schedules:', err)
    }

  } catch (error) {
    console.error('Error general fetching admin data:', error)
    setError('Error al cargar algunos datos del administrador')
  } finally {
    setLoading(false)
  }
}

  // ============================================================================
  // CREAR PAQUETE
  // ============================================================================
  
  const handleCreatePackage = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setSuccess('')

      await axios.post('http://localhost:5000/api/v1/admin-reformery/packages', newPackage)

      setSuccess('Paquete creado exitosamente')
      setShowCreatePackageModal(false)
      setNewPackage({
        name: '',
        description: '',
        total_classes: '',
        validity_days: 30,
        price: '',
        active: true
      })
      fetchAdminData()
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear paquete')
    }
  }

  // ============================================================================
  // EDITAR PAQUETE
  // ============================================================================
  
  const handleEditPackage = (pkg) => {
    setSelectedPackage(pkg)
    setNewPackage({
      name: pkg.name,
      description: pkg.description,
      total_classes: pkg.total_classes,
      validity_days: pkg.validity_days,
      price: pkg.price,
      active: pkg.active
    })
    setShowEditPackageModal(true)
  }

  const handleUpdatePackage = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setSuccess('')

      await axios.put(`http://localhost:5000/api/v1/admin-reformery/packages/${selectedPackage.id}`, newPackage)

      setSuccess('Paquete actualizado exitosamente')
      setShowEditPackageModal(false)
      setSelectedPackage(null)
      setNewPackage({
        name: '',
        description: '',
        total_classes: '',
        validity_days: 30,
        price: '',
        active: true
      })
      fetchAdminData()
    } catch (error) {
      setError(error.response?.data?.message || 'Error al actualizar paquete')
    }
  }

  // ============================================================================
  // DESACTIVAR PAQUETE
  // ============================================================================
  
  const handleTogglePackageStatus = async (pkg) => {
    if (!window.confirm(`¿Estás seguro de ${pkg.active ? 'desactivar' : 'activar'} este paquete?`)) {
      return
    }

    try {
      setError('')
      setSuccess('')

      await axios.put(`http://localhost:5000/api/v1/admin-reformery/packages/${pkg.id}`, {
        active: !pkg.active
      })

      setSuccess(`Paquete ${pkg.active ? 'desactivado' : 'activado'} exitosamente`)
      fetchAdminData()
    } catch (error) {
      setError(error.response?.data?.message || 'Error al cambiar estado del paquete')
    }
  }

  // ============================================================================
  // CREAR USUARIO
  // ============================================================================
  
  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setSuccess('')

      await axios.post('http://localhost:5000/api/v1/auth/register', newUser)

      setSuccess('Usuario creado exitosamente')
      setShowCreateUserModal(false)
      setNewUser({
        full_name: '',
        email: '',
        password: '',
        role: 'client',
        active: true
      })
      fetchAdminData()
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear usuario')
    }
  }

  // ============================================================================
  // EDITAR USUARIO
  // ============================================================================
  
  const handleEditUser = (user) => {
    setSelectedUser(user)
    setNewUser({
      full_name: user.full_name,
      email: user.email,
      password: '',
      role: user.role,
      active: user.active
    })
    setShowEditUserModal(true)
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setSuccess('')

      const updateData = {
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        active: newUser.active
      }

      await axios.put(`http://localhost:5000/api/v1/admin-reformery/users/${selectedUser.id}`, updateData)

      setSuccess('Usuario actualizado exitosamente')
      setShowEditUserModal(false)
      setSelectedUser(null)
      setNewUser({
        full_name: '',
        email: '',
        password: '',
        role: 'client',
        active: true
      })
      fetchAdminData()
    } catch (error) {
      setError(error.response?.data?.message || 'Error al actualizar usuario')
    }
  }

  // ============================================================================
  // DESACTIVAR USUARIO
  // ============================================================================
  
  const handleToggleUserStatus = async (user) => {
    if (!window.confirm(`¿Estás seguro de ${user.active ? 'desactivar' : 'activar'} este usuario?`)) {
      return
    }

    try {
      setError('')
      setSuccess('')

      await axios.put(`http://localhost:5000/api/v1/admin-reformery/users/${user.id}`, {
        active: !user.active
      })

      setSuccess(`Usuario ${user.active ? 'desactivado' : 'activado'} exitosamente`)
      fetchAdminData()
    } catch (error) {
      setError(error.response?.data?.message || 'Error al cambiar estado del usuario')
    }
  }

  // ============================================================================
  // CREAR HORARIO
  // ============================================================================
  
  const handleCreateSchedule = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setSuccess('')

      await axios.post('http://localhost:5000/api/v1/admin-reformery/schedules', newSchedule)

      setSuccess('Horario creado exitosamente')
      setShowCreateScheduleModal(false)
      setNewSchedule({
        pilates_class_id: '',
        instructor_id: '',
        start_time: '',
        end_time: '',
        max_capacity: 10,
        notes: ''
      })
      fetchAdminData()
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear horario')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Panel de Administración REFORMERY
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

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Usuarios
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`${
                activeTab === 'packages'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Paquetes
            </button>
            <button
              onClick={() => setActiveTab('schedules')}
              className={`${
                activeTab === 'schedules'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Horarios
            </button>
          </nav>
        </div>

             {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Usuarios */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Usuarios
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {stats.users.total}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paquetes Activos */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Paquetes Activos
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {stats.packages.assigned}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clases Programadas */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Clases Programadas
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {stats.schedules.scheduled}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reservas Confirmadas */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Reservas Confirmadas
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {stats.reservations.confirmed}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalles Adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Usuarios por Rol */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Usuarios por Rol</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Clientes:</span>
                    <span className="text-sm font-semibold">{stats.users.clients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Instructores:</span>
                    <span className="text-sm font-semibold">{stats.users.instructors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Activos:</span>
                    <span className="text-sm font-semibold">{stats.users.active}</span>
                  </div>
                </div>
              </div>

              {/* Paquetes */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paquetes</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Paquetes:</span>
                    <span className="text-sm font-semibold">{stats.packages.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Activos:</span>
                    <span className="text-sm font-semibold">{stats.packages.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Asignados:</span>
                    <span className="text-sm font-semibold">{stats.packages.assigned}</span>
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Horarios</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Programados:</span>
                    <span className="text-sm font-semibold">{stats.schedules.scheduled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cancelados:</span>
                    <span className="text-sm font-semibold">{stats.schedules.cancelled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completados:</span>
                    <span className="text-sm font-semibold">{stats.schedules.completed}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
              <button
                onClick={() => setShowCreateUserModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                + Crear Usuario
              </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.full_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'instructor' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user)}
                            className={user.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                          >
                            {user.active ? 'Desactivar' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Paquetes REFORMERY</h2>
              <button
                onClick={() => setShowCreatePackageModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                + Crear Paquete
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {pkg.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {pkg.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Clases:</span>
                      <span className="font-semibold">{pkg.total_classes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Vigencia:</span>
                      <span className="font-semibold">{pkg.validity_days} días</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Precio:</span>
                      <span className="font-semibold text-primary-600">${pkg.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`font-semibold ${pkg.active ? 'text-green-600' : 'text-red-600'}`}>
                        {pkg.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditPackage(pkg)}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleTogglePackageStatus(pkg)}
                      className={`flex-1 ${
                        pkg.active
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors`}
                    >
                      {pkg.active ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedules Tab */}
        {activeTab === 'schedules' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Horarios</h2>
              <button
                onClick={() => setShowCreateScheduleModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                + Crear Horario
              </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clase
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Instructor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha/Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cupo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {schedules.slice(0, 20).map((schedule) => (
                      <tr key={schedule.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {schedule.class_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {schedule.instructor_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(schedule.start_time).toLocaleString('es-MX', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {schedule.available_spots} / {schedule.max_capacity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            schedule.is_full ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {schedule.is_full ? 'Lleno' : 'Disponible'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-4">
                            Editar
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Cancelar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

               {/* ============================================================================ */}
        {/* MODAL: CREAR PAQUETE */}
        {/* ============================================================================ */}
        
        {showCreatePackageModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Crear Nuevo Paquete
                </h3>
                <form onSubmit={handleCreatePackage}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Paquete
                      </label>
                      <input
                        type="text"
                        required
                        value={newPackage.name}
                        onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Ej: PAQUETE 1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        value={newPackage.description}
                        onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows="3"
                        placeholder="Descripción del paquete"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total de Clases
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newPackage.total_classes}
                        onChange={(e) => setNewPackage({ ...newPackage, total_classes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Ej: 5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vigencia (días)
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newPackage.validity_days}
                        onChange={(e) => setNewPackage({ ...newPackage, validity_days: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Ej: 30"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio ($)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={newPackage.price}
                        onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Ej: 150.00"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPackage.active}
                        onChange={(e) => setNewPackage({ ...newPackage, active: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Paquete Activo
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Crear Paquete
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreatePackageModal(false)
                        setNewPackage({
                          name: '',
                          description: '',
                          total_classes: '',
                          validity_days: 30,
                          price: '',
                          active: true
                        })
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================================ */}
        {/* MODAL: EDITAR PAQUETE */}
        {/* ============================================================================ */}
        
        {showEditPackageModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Editar Paquete
                </h3>
                <form onSubmit={handleUpdatePackage}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Paquete
                      </label>
                      <input
                        type="text"
                        required
                        value={newPackage.name}
                        onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        value={newPackage.description}
                        onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total de Clases
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newPackage.total_classes}
                        onChange={(e) => setNewPackage({ ...newPackage, total_classes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vigencia (días)
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newPackage.validity_days}
                        onChange={(e) => setNewPackage({ ...newPackage, validity_days: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio ($)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={newPackage.price}
                        onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPackage.active}
                        onChange={(e) => setNewPackage({ ...newPackage, active: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Paquete Activo
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Actualizar Paquete
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditPackageModal(false)
                        setSelectedPackage(null)
                        setNewPackage({
                          name: '',
                          description: '',
                          total_classes: '',
                          validity_days: 30,
                          price: '',
                          active: true
                        })
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================================ */}
        {/* MODAL: CREAR USUARIO */}
        {/* ============================================================================ */}
        
        {showCreateUserModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Crear Nuevo Usuario
                </h3>
                <form onSubmit={handleCreateUser}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={newUser.full_name}
                        onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="usuario@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        required
                        minLength="6"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="client">Cliente</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newUser.active}
                        onChange={(e) => setNewUser({ ...newUser, active: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Usuario Activo
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Crear Usuario
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateUserModal(false)
                        setNewUser({
                          full_name: '',
                          email: '',
                          password: '',
                          role: 'client',
                          active: true
                        })
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================================ */}
        {/* MODAL: EDITAR USUARIO */}
        {/* ============================================================================ */}
        
        {showEditUserModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Editar Usuario
                </h3>
                <form onSubmit={handleUpdateUser}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={newUser.full_name}
                        onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="client">Cliente</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newUser.active}
                        onChange={(e) => setNewUser({ ...newUser, active: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Usuario Activo
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Actualizar Usuario
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditUserModal(false)
                        setSelectedUser(null)
                        setNewUser({
                          full_name: '',
                          email: '',
                          password: '',
                          role: 'client',
                          active: true
                        })
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================================ */}
        {/* MODAL: CREAR HORARIO */}
        {/* ============================================================================ */}
        
        {showCreateScheduleModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Crear Nuevo Horario
                </h3>
                <form onSubmit={handleCreateSchedule}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Clase
                      </label>
                      <select
                        required
                        value={newSchedule.pilates_class_id}
                        onChange={(e) => setNewSchedule({ ...newSchedule, pilates_class_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Seleccionar clase...</option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instructor
                      </label>
                      <select
                        required
                        value={newSchedule.instructor_id}
                        onChange={(e) => setNewSchedule({ ...newSchedule, instructor_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Seleccionar instructor...</option>
                        {instructors.map((instructor) => (
                          <option key={instructor.id} value={instructor.id}>
                            {instructor.full_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha y Hora de Inicio
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={newSchedule.start_time}
                        onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha y Hora de Fin
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={newSchedule.end_time}
                        onChange={(e) => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacidad Máxima
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="50"
                        value={newSchedule.max_capacity}
                        onChange={(e) => setNewSchedule({ ...newSchedule, max_capacity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Ej: 10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas (opcional)
                      </label>
                      <textarea
                        value={newSchedule.notes}
                        onChange={(e) => setNewSchedule({ ...newSchedule, notes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows="2"
                        placeholder="Notas adicionales..."
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Crear Horario
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateScheduleModal(false)
                        setNewSchedule({
                          pilates_class_id: '',
                          instructor_id: '',
                          start_time: '',
                          end_time: '',
                          max_capacity: 10,
                          notes: ''
                        })
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard