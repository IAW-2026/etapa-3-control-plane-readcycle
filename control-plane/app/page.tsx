'use client';

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 text-center max-w-5xl mx-auto w-full">
      {/* Intro Pill */}
      <span className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-sage bg-brand-sage/10 rounded-full mb-6 border border-brand-sage/20 animate-pulse">
        Administración del Sistema
      </span>

      {/* Main Title */}
      <h1 className="text-4xl md:text-6xl font-black tracking-tight text-brand-forest leading-[1.15] max-w-3xl font-sans">
        Bienvenido a la consola <span className="text-brand-sage bg-brand-sage/10 px-3 py-1 rounded-2xl">Control Plane</span>
      </h1>

      {/* Description */}
      <p className="mt-6 text-sm md:text-base text-brand-forest/75 max-w-2xl leading-relaxed font-light">
        La consola administrativa central de ReadCycle te permite supervisar la disponibilidad de las aplicaciones del ecosistema, gestionar las cuentas de usuario de la comunidad y moderar reclamos en los intercambios de libros.
      </p>

      {/* Interactive Action Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm">
        <Link
          href="/dashboard"
          className="w-full py-4 bg-brand-sage hover:bg-brand-forest text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-colors duration-200 text-sm cursor-pointer flex items-center justify-center gap-2"
        >
          Avanzar al Panel de Administración
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
