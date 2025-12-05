// Corregido: quitado BrowserRouter import no usado y eliminado ruta duplicada /schedules
import { Routes, Route, Navigate } from 'react-router-dom';

// Context
import { AuthProvider } from '@context/AuthContext';
import { useAuth } from '@context/AuthContext';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import Schedules from './pages/Schedules';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';
import InstructorDashboard from './pages/instructor/InstructorDashboard';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            user?.role === 'admin' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : user?.role === 'client' ? (
              <Navigate to="/client/dashboard" replace />
            ) : user?.role === 'instructor' ? (
              <Navigate to="/instructor/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          ) : (
            <Login />
          )
        }
      />

      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />

      {/* Rutas Protegidas - Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Rutas Protegidas - Client */}
      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />

      {/* Instructor (admin + instructor pueden acceder) */}
      <Route
        path="/instructor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['instructor', 'admin']}>
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Schedules: protegida por defecto */}
      <Route
        path="/schedules"
        element={
          <ProtectedRoute>
            <Schedules />
          </ProtectedRoute>
        }
      />

      <Route path="/contact" element={<Contact />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Rutas de Error */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/**
 * App - Componente principal
 */
function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <AppRoutes />
        </main>

        <Footer />

        <WhatsAppButton />
      </div>
    </AuthProvider>
  );
}

export default App;
