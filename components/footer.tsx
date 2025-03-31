"use client"

import Link from "next/link"


export default function Footer() {


  return (
      <footer className="relative py-12 text-gray-300">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] to-[#080810] z-0"></div>
        <div className="container relative z-10 mx-auto px-4 max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">StoryToVideo</h3>
              <p className="text-sm text-gray-400">
                Plataforma de conversión de storyboards a videos animados impulsada por inteligencia artificial.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Contacto</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Soporte
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Ventas
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Prensa
                  </Link>
                </li>
              </ul>
              <div className="mt-4 flex gap-4">
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} StoryToVideo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
  )
}

