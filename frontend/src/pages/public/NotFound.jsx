
/**
 * Not Found Page - Página 404
 * Autor: @elisarrtech con Elite AI Architect
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="text-center">
        <FaExclamationTriangle className="text-8xl text-yellow-500 mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Página no encontrada</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition"
        >
          <FaHome />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
```
