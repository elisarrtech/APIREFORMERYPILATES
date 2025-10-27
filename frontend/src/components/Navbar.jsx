import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return null
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/dashboard" className="text-2xl font-bold text-primary-600">
            FitnessClub
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/schedules"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Horarios
            </Link>
            <Link
              to="/my-reservations"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Mis Reservas
            </Link>
            <Link
              to="/profile"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
