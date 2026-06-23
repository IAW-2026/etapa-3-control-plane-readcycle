'use client';

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-brand-sage/20 border-t-brand-sage rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-brand-forest/60 tracking-wider uppercase">Cargando credenciales...</p>
      </div>
    );
  }

  const roles = (user?.publicMetadata?.roles || []) as string[];
  const isAdmin = roles.some(role => role.toUpperCase() === "ADMIN");

  if (!isAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-xl mx-auto w-full">
        {/* Ícono de escudo de advertencia */}
        <div className="p-4 bg-brand-clay/10 text-brand-clay rounded-3xl border border-brand-clay/20 mb-6 shadow-sm animate-pulse-slow">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
          </svg>
        </div>

        {/* Título de restricción */}
        <h1 className="text-2xl font-extrabold text-brand-forest tracking-tight font-sans">
          Acceso Restringido
        </h1>

        {/* Descripción de permisos insuficientes */}
        <p className="mt-3 text-sm text-brand-forest/70 leading-relaxed font-light">
          Tu cuenta de usuario no cuenta con el rol de Administrador (`ADMIN`) requerido para visualizar o realizar acciones dentro de la consola administrativa.
        </p>

        {/* Botón de retorno al inicio */}
        <Link
          href="/"
          className="mt-8 px-6 py-3 bg-brand-sage hover:bg-brand-forest text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la Página de Inicio
        </Link>
      </div>
    );
  }
  return <>{children}</>;
}
