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
    <nav className="navbar shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
            <span className="text-orange-600">OL-LIN</span>
            <span className="text-gray-700 italic text-sm font-normal ml-1">Estudio Fitness</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/schedules"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Horarios
            </Link>
            <Link
              to="/my-reservations"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Mis Reservas
            </Link>
            <Link
              to="/profile"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="btn-primary px-4 py-2 text-sm"
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

