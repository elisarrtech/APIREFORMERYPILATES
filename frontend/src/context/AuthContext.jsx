import React, { createContext, useState, useContext } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'https://your-railway-backend-url'; // setea en Netlify la variable REACT_APP_API_URL

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // login espera la respuesta del backend tal como tu frontend (success, user, access_token, refresh_token)
  const login = async (email, password, remember = false) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Credenciales inválidas' };
      }

      // Guardar tokens (puedes cambiar aquí a cookies httpOnly si adaptas backend)
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      setUser(data.user);

      return { success: true, user: data.user };
    } catch (err) {
      console.error('Auth login error', err);
      return { success: false, message: 'Error de conexión' };
    }
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        return;
      }
      // Si tu backend espera el refresh token como Bearer en Authorization
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refresh}`
        }
      });
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
