import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Users, 
  Package, 
  Dumbbell, 
  Calendar, 
  BarChart3, 
  Bell, 
  Menu, 
  X,
  LogOut,
  Shield
} from 'lucide-react';

/**
 * Admin Layout - Reformery Pilates Studio
 * @version 3.0.0 - SAGE COLORS
 * @author @elisarrtech
 */
const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { name: 'Usuarios', path: '/admin/users', icon: Users },
    { name: 'Paquetes', path: '/admin/packages', icon: Package },
    { name: 'Clases', path: '/admin/classes', icon: Dumbbell },
    { name: 'Horarios', path: '/admin/schedules', icon: Calendar },
    { name: 'Estadísticas', path: '/admin/statistics', icon: BarChart3 },
    { name: 'Notificaciones', path: '/admin/notifications', icon: Bell },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-sage-50">
      {/* Navbar - SAGE GREEN */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-sage-600 to-sage-700 text-white shadow-xl z-50">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-sage-700 rounded-lg transition-colors duration-200"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏋️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">REFORMERY</h1>
                <p className="text-xs text-sage-100 uppercase tracking-widest">Pilates Studio</p>
              </div>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* User info */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">Hola,</p>
                <p className="text-lg font-bold">{user?.full_name || 'Admin'}</p>
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-lg flex items-center gap-2">
                <Shield size={16} />
                <span className="text-xs font-semibold uppercase tracking-wide">Admin</span>
              </div>
            </div>

            {/* Dashboard Button */}
            <Link
              to="/admin/dashboard"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all duration-200"
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar - SAGE GREEN */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-gradient-to-b from-sage-700 to-sage-800 text-white shadow-2xl z-40 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full overflow-y-auto custom-scrollbar">
          <div className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-white text-sage-700 shadow-lg font-bold'
                      : 'text-sage-100 hover:bg-sage-600 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;