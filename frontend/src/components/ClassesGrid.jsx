import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * ClassesGrid
 * Props:
 * - classesList: array de { name, description, image, slug }
 * - showReserve (optional): muestra botón reservar
 *
 * Uso:
 * <ClassesGrid classesList={classesInfo} />
 */
export default function ClassesGrid({ classesList = [], showReserve = true }) {
  const navigate = useNavigate();

  return (
    <section aria-labelledby="classes-title" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 id="classes-title" className="text-3xl md:text-4xl font-extrabold text-gray-800">Nuestras Clases</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3">Descubre nuestra variedad de clases diseñadas para todos los niveles.</p>
        </div>

        <div className="classes-grid">
          {classesList.map((item, idx) => (
            <article
              key={idx}
              className="class-card"
              role="article"
              aria-labelledby={`class-title-${idx}`}
            >
              <div
                className="class-image"
                style={{ backgroundImage: `url(${item.image})` }}
                aria-hidden="true"
              >
                <div className="image-overlay" />
              </div>

              <div className="card-content">
                <h3 id={`class-title-${idx}`} className="title text-2xl md:text-3xl font-extrabold mb-2">{item.name}</h3>
                <p className="excerpt text-sm md:text-base mb-6 opacity-95">{item.description}</p>

                <div className="flex items-center gap-4">
                  <Link
                    to={`/classes/${item.slug || idx}`}
                    className="link-more btn-outline inline-flex items-center gap-2"
                    aria-label={`Ver más sobre ${item.name}`}
                  >
                    <span aria-hidden>➜</span>
                    <span>Ver más</span>
                  </Link>

                  {showReserve && (
                    <button
                      onClick={() => navigate('/schedules')}
                      className="ml-auto btn-primary"
                      aria-label={`Reservar clase ${item.name}`}
                    >
                      Reservar
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
