import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * ClassesGrid - responsive grid with image background, overlay and CTAs
 * Props:
 * - classesList: array [{ name, description, image, slug }]
 * - showReserve: boolean (default true)
 */
export default function ClassesGrid({ classesList = [], showReserve = true }) {
  const navigate = useNavigate();

  return (
    <section aria-labelledby="classes-title" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 id="classes-title" className="text-3xl md:text-4xl font-extrabold text-[var(--text-dark)]">Nuestras Clases</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3">Descubre nuestra variedad de clases diseñadas para todos los niveles.</p>
        </div>

        <div className="classes-grid" role="list">
          {classesList.map((item, idx) => (
            <article key={idx} className="class-card" role="listitem" tabIndex={0} aria-labelledby={`class-title-${idx}`}>
              <div className="class-image" style={{ backgroundImage: `url(${item.image})` }} aria-hidden />
              <div className="image-overlay" aria-hidden />

              <div className="card-content">
                <h3 id={`class-title-${idx}`} className="title">{item.name}</h3>
                <p className="excerpt">{item.description}</p>

                <div className="card-cta-row">
                  <Link to={`/classes/${item.slug || idx}`} className="link-more" aria-label={`Ver más sobre ${item.name}`}>
                    <span aria-hidden>➜</span><span>Ver más</span>
                  </Link>

                  {showReserve && (
                    <button onClick={() => navigate('/schedules')} className="btn btn-primary ml-auto" aria-label={`Reservar ${item.name}`}>
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
