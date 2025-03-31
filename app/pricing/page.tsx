'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';

// Reusable PricingCard component
type PricingFeature = {
  text: string;
};

type PricingCardProps = {
  name: string;
  price: string;
  features: PricingFeature[];
  isPopular?: boolean;
  buttonText?: string;
};

const CheckIcon = () => (
  <svg
    className="h-6 w-6 flex-shrink-0 text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

const PricingCard = ({ name, price, features, isPopular = false, buttonText = "Comenzar Ahora" }: PricingCardProps) => (
  <div className={`rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 border ${isPopular ? 'border-purple-500/30 shadow-[0_0_25px_rgba(139,92,246,0.2)]' : 'border-purple-500/10 shadow-[0_0_15px_rgba(139,92,246,0.1)]'} backdrop-blur-sm relative`}>
    {isPopular && (
      <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white text-sm font-medium">
        Más Popular
      </div>
    )}
    <div className="mb-4 text-center">
      <h3 className="text-xl font-semibold text-white">{name}</h3>
      <div className="mt-4 flex items-baseline justify-center">
        <span className="text-5xl font-extrabold tracking-tight text-white">{price}</span>
        <span className="ml-1 text-xl font-normal text-gray-400">/mes</span>
      </div>
    </div>
    <ul className="mt-6 space-y-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <CheckIcon />
          <span className="ml-3 text-gray-300">{feature.text}</span>
        </li>
      ))}
    </ul>
    <div className="mt-8">
      <Button className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 ${isPopular ? 'shadow-[0_0_15px_rgba(139,92,246,0.3)]' : ''}`}>
        {buttonText}
      </Button>
    </div>
  </div>
);

export default function PricingPage() {
  const pricingRef = useRef<HTMLElement>(null);

  // Define pricing plans with updated features
  const basicPlan = {
    name: "Básico",
    price: "$29",
    features: [
      { text: "Hasta 5 videos por mes" },
      { text: "Creación básica de storyboards" },
      { text: "Generación de video en HD (720p)" },
      { text: "Biblioteca de efectos de sonido básicos" },
      { text: "Exportación en MP4" }
    ]
  };

  const proPlan = {
    name: "Profesional",
    price: "$59",
    features: [
      { text: "Hasta 15 videos por mes" },
      { text: "Editor avanzado de storyboards" },
      { text: "Generación de video en Full HD (1080p)" },
      { text: "Biblioteca completa de efectos sonoros" },
      { text: "Generador de diálogos y guiones" }
    ]
  };

  const enterprisePlan = {
    name: "Empresarial",
    price: "$99",
    features: [
      { text: "Videos ilimitados" },
      { text: "Todas las herramientas premium" },
      { text: "Resolución 4K Ultra HD" },
      { text: "Voces personalizables de calidad profesional" },
      { text: "Soporte técnico prioritario 24/7" }
    ]
  };

  return (
    <section id="pricing" ref={pricingRef} className="relative min-h-screen pt-24 xl:pt-0 flex items-center text-white">
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
            Elige el plan que mejor se adapte a tus necesidades de creación de videos. Todos los planes incluyen acceso a nuestra plataforma de storyboard a video.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 lg:mt-20">
          <PricingCard {...basicPlan} />
          <PricingCard {...proPlan} isPopular={true} />
          <PricingCard {...enterprisePlan} />
        </div>
      </div>
    </section>
  );
}