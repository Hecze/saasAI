'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button'; // Assuming Button is from a UI library or components folder



export default function PricingPage() {
    const pricingRef = useRef<HTMLElement>(null);

    return (
        <section id="pricing" ref={pricingRef} className="relative py-20 text-white">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-[#0f0f1a] to-[#0a0a12] z-0"></div>
            <div className="container relative z-10 mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12">
                    <div className="inline-block rounded-full bg-gradient-to-r from-purple-600/20 to-indigo-600/20 px-4 py-1 text-sm font-medium text-purple-300 backdrop-blur-md mb-4">
                        PLANES
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-indigo-200">
                        Planes de Suscripción
                    </h2>
                    <p className="mx-auto mt-4 max-w-3xl text-center text-gray-300">
                        Sistema flexible de créditos que te permite pagar solo por lo que necesitas. Cada acción consume una
                        cantidad específica de créditos.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-purple-500/10 shadow-[0_0_15px_rgba(139,92,246,0.1)] backdrop-blur-sm">
                        <div className="mb-4 text-center">
                            <h3 className="text-xl font-semibold text-white">Básico</h3>
                            <div className="mt-4 flex items-baseline justify-center">
                                <span className="text-5xl font-extrabold tracking-tight text-white">$29</span>
                                <span className="ml-1 text-xl font-normal text-gray-400">/mes</span>
                            </div>
                            <p className="mt-2 text-sm text-gray-400">50 créditos mensuales</p>
                        </div>
                        <ul className="mt-6 space-y-4">
                            <li className="flex items-start">
                                <svg
                                    className="h-6 w-6 flex-shrink-0 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3 text-gray-300">Subir storyboard: 1 crédito</span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    className="h-6 w-6 flex-shrink-0 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3 text-gray-300">Modificar storyboard: 1 crédito</span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    className="h-6 w-6 flex-shrink-0 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3 text-gray-300">Generar video: 7 créditos</span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    className="h-6 w-6 flex-shrink-0 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3 text-gray-300">Efectos de sonido: 1 crédito</span>
                            </li>
                        </ul>
                        <div className="mt-8">
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0">
                                Comenzar Ahora
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-purple-500/30 shadow-[0_0_25px_rgba(139,92,246,0.2)] backdrop-blur-sm relative">
                        <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white text-sm font-medium">
                            Más Popular
                        </div>
                        <div className="mb-4 text-center">
                            <h3 className="text-xl font-semibold text-white">Profesional</h3>
                            <div className="mt-4 flex items-baseline justify-center">
                                <span className="text-5xl font-extrabold tracking-tight text-white">$59</span>
                                <span className="ml-1 text-xl font-normal text-gray-400">/mes</span>
                            </div>
                            <p className="mt-2 text-sm text-gray-400">150 créditos mensuales</p>
                        </div>
                        <ul className="mt-6 space-y-4">
                            <li className="flex items-start">
                                <svg
                                    className="h-6 w-6 flex-shrink-0 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3 text-gray-300">Todo lo del plan Básico</span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    className="h-6 w-6 flex-shrink-0 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3 text-gray-300">Generar diálogos: 2 créditos</span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    className="h-6 w-6 flex-shrink-0 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3 text-gray-300">Estilos visuales avanzados</span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    className="h-6 w-6 flex-shrink-0 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3 text-gray-300">Resolución hasta 1080p</span>
                            </li>
                        </ul>
                        <div className="mt-8">
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                                Comenzar Ahora
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-purple-500/10 shadow-[0_0_15px_rgba(139,92,246,0.1)] backdrop-blur-sm">
                        <div className="mb-4 text-center">
                            <h3 className="text-xl font-semibold text-white">Empresarial</h3>
                            <div className="mt-4 flex items-baseline justify-center">
                                <span className="text-5xl font-extrabold tracking-tight text-white">$99</span>
                                <span className="ml-1 text-xl font-normal text-gray-400">/mes</span>
                            </div>
                            <p className="mt-2 text-sm text-gray-400">500 créditos mensuales</p>
                        </div>
                        <ul className="mt-6 space-y-4">
                            <li className="flex items-start">
                                <svg
                                    className="h-6 w-6 flex-shrink-0 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3 text-gray-300">Todo lo del plan Profesional</span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    className="h-6 w-6 flex-shrink-0 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3 text-gray-300">Resolución hasta 4K</span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    className="h-6 w-6 flex-shrink-0 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3 text-gray-300">Voces premium personalizables</span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    className="h-6 w-6 flex-shrink-0 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="ml-3 text-gray-300">Soporte prioritario</span>
                            </li>
                        </ul>
                        <div className="mt-8">
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0">
                                Comenzar Ahora
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}