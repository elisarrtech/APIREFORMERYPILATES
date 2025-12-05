import React from 'react';

/**
 * Principles - simple grid of icons + titles
 */
export default function Principles() {
  const items = [
    { key: 'flow', title: 'flow', svg: (<svg viewBox="0 0 24 24" className="w-10 h-10" aria-hidden><path d="M2 12c4-6 8 6 14 0 4-4 6 4 8 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
    { key: 'centring', title: 'centring', svg: (<svg viewBox="0 0 24 24" className="w-10 h-10" aria-hidden><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>) },
    { key: 'breath', title: 'breath', svg: (<svg viewBox="0 0 24 24" className="w-10 h-10" aria-hidden><path d="M12 3v18M8 6c1.5 2 2 2 4 2s2.5 0 4-2" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>) },
    { key: 'concentration', title: 'concentration', svg: (<svg viewBox="0 0 24 24" className="w-10 h-10" aria-hidden><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" fill="none"/><circle cx="10" cy="12" r="0.9" fill="currentColor"/><circle cx="14" cy="12" r="0.9" fill="currentColor"/><circle cx="12" cy="16" r="0.9" fill="currentColor"/></svg>) },
    { key: 'control', title: 'control', svg: (<svg viewBox="0 0 24 24" className="w-10 h-10" aria-hidden><path d="M12 4v16M8 12c2-2 4-2 8 0" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>) },
    { key: 'precision', title: 'precisión', svg: (<svg viewBox="0 0 24 24" className="w-10 h-10" aria-hidden><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M6 12c2 0 2-2 6-2s4 2 6 2" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>) },
  ];

  return (
    <section aria-labelledby="principles-title" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="text-gray-600">En el que te ayudaremos a través del movimiento a conectar con tu centro, y lograr que el cuerpo y mente trabajen en sinergia para lograr cualquier reto de nuestra vida diaria.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {items.map(it => (
            <div key={it.key} className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full border border-[rgba(16,32,33,0.06)] w-16 h-16 flex items-center justify-center principle-icon">
                {it.svg}
              </div>
              <div className="mt-4 principle-title">{it.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
