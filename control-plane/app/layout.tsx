'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Image from "next/image";
import Link from "next/link";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <title>ReadCycle - Control Plane</title>
        <meta name="description" content="Panel administrativo centralizado de ReadCycle" />
      </head>
      <body className="min-h-full bg-background text-foreground font-sans antialiased flex flex-col">
        <ClerkProvider>
          {/* Header Navbar with Sign In */}
          <header className="h-16 flex items-center justify-between px-6 md:px-12 bg-white/60 backdrop-blur-md border-b border-brand-sand sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white p-1 shadow-sm border border-brand-sand/60">
                <Image
                  src="/LogoSinTexto.png"
                  alt="ReadCycle Icon"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <Link href="/" className="font-extrabold tracking-tight text-brand-forest text-base flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span>ReadCycle</span>
                <span className="text-brand-sage text-[10px] sm:text-xs font-semibold uppercase tracking-wider -mt-1 sm:mt-0">Control Plane</span>
              </Link>
            </div>

            {/* Authentication Buttons in the Header */}
            <div className="flex items-center gap-3">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="px-3.5 py-1.5 text-xs font-semibold text-brand-forest/70 hover:text-brand-sage transition-colors cursor-pointer">
                    Iniciar Sesión
                  </button>
                </SignInButton>
                
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-sage hover:bg-brand-forest transition-colors duration-200 cursor-pointer shadow-sm">
                    Registrarse
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-brand-sage/10 text-brand-sage text-[10px] font-semibold rounded-full border border-brand-sage/20">
                  <span className="w-1.5 h-1.5 bg-brand-sage rounded-full animate-pulse"></span>
                  Conectado
                </span>
                <div className="border-l border-brand-sand pl-3 h-8 flex items-center">
                  <UserButton />
                </div>
              </Show>
            </div>
          </header>

          {/* Children Pages */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
