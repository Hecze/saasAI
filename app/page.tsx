"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Sparkles,
  ArrowRight,
  Play,
  Share2,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pen,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import TypewriterEffect from "@/components/typewriter-effect"
import SwitchSelector from "@/components/ui/switch-selector"
import VideoEditor from "@/components/video-editor/video-editor"
import StoryBuilder from "@/components/story-builder"
import BenefitCard from "@/components/ui/benefit-card"
import { useState, useRef, useEffect } from "react"

export default function Home() {
  // State variables
  const [inputValue, setInputValue] = useState("")
  const [inputFocused, setInputFocused] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isSliding, setIsSliding] = useState(false)
  const [slideDirection, setSlideDirection] = useState("right")
  const [isVideoHovered, setIsVideoHovered] = useState(false)
  const [isPromptMode, setIsPromptMode] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [inputAreaHeight, setInputAreaHeight] = useState("auto")

  // Refs
  const demoRef = useRef<HTMLDivElement | null>(null)
  const pricingRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const promptInputRef = useRef<HTMLFormElement | null>(null)
  const uploadAreaRef = useRef<HTMLDivElement | null>(null)

  // Effect to update the input area height based on current mode
  useEffect(() => {
    if (isPromptMode && promptInputRef.current) {
      setInputAreaHeight(`${promptInputRef.current.offsetHeight}px`)
    } else if (!isPromptMode && uploadAreaRef.current) {
      setInputAreaHeight(`${uploadAreaRef.current.offsetHeight}px`)
    }
  }, [isPromptMode])

  /**
   * Handles drag over event for file upload area
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  /**
   * Handles file drop event
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle the file upload logic here
      console.log("File dropped:", e.dataTransfer.files[0])
    }
  }

  /**
   * Handles file selection from input
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Handle the file upload logic here
      console.log("File selected:", e.target.files[0])
    }
  }

  /**
   * Handles form submission
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (demoRef.current) {
      demoRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }


  /**
   * Handles input mode change (prompt vs upload)
   */
  const handleInputModeChange = (selected: boolean): void => {
    setIsPromptMode(selected)
  }

  /**
   * Testimonial data
   */
  const testimonials = [
    {
      name: "Ana Martínez",
      position: "Directora de Marketing, AgenciaCreativa",
      text: "Desde que utilizamos StoryToVideo, hemos reducido nuestros costos de producción en un 70% y acelerado nuestro tiempo de entrega. Nuestros clientes están encantados con los resultados y la calidad de los videos.",
    },
    {
      name: "Luis Gómez",
      position: "Productor Audiovisual, EstudioX",
      text: "La capacidad de intervenir en cada fase del proceso es lo que hace que esta herramienta sea tan poderosa. Puedo mantener el control creativo mientras la IA hace el trabajo pesado. ¡Una combinación perfecta!",
    },
    {
      name: "María Rodríguez",
      position: "CEO, StartupTech",
      text: "Hemos integrado StoryToVideo en nuestro flujo de trabajo para crear contenido educativo. La velocidad con la que podemos producir videos de calidad nos ha permitido escalar nuestro contenido como nunca antes.",
    },
    {
      name: "Carlos Sánchez",
      position: "Director de Contenido, RetailPro",
      text: "La flexibilidad para editar cada escena y personalizar los estilos nos ha permitido mantener nuestra identidad de marca en todos nuestros videos promocionales. Una herramienta indispensable.",
    },
  ]

  /**
   * Changes the displayed testimonials
   */
  type TestimonialDirection = "right" | "left";

  /**
   * Changes the displayed testimonials
   */
  const changeTestimonial = (direction: TestimonialDirection): void => {
    setIsSliding(true)
    setSlideDirection(direction)

    setTimeout(() => {
      if (direction === "right") {
        setCurrentTestimonial((prev) => (prev + 2 >= testimonials.length ? 0 : prev + 2))
      } else {
        setCurrentTestimonial((prev) =>
          prev - 2 < 0 ? testimonials.length - (testimonials.length % 2 === 0 ? 2 : 1) : prev - 2,
        )
      }
      setIsSliding(false)
    }, 300)
  }

  /**
   * Handles input change for the prompt input
   */

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value)
  }

  return (
    <div className="flex flex-col min-h-screen w-screen bg-[#0a0a12]">


      {/* Hero Section */}
      <section className="relative w-full pt-28 text-white">
        <div className="absolute inset-0 md:bg-gradient-to-b from-purple-900/20 via-indigo-900/10 to-[#0a0a12] z-0"></div>
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full">
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

            {/* Glowing orbs */}
            <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full md:bg-purple-600/20 blur-3xl"></div>
            <div className="absolute top-1/3 right-1/3 h-64 w-64 rounded-full md:bg-indigo-600/20 blur-3xl"></div>
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center max-w-5xl">
          <div className="inline-block rounded-full bg-indigo-950 md:bg-gradient-to-r from-purple-600/20 to-indigo-600/20 px-4 py-1 text-sm font-medium text-purple-300 backdrop-blur-md mb-6">
            TRANSFORMA TUS IDEAS CON IA
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-white md:bg-gradient-to-r from-white via-purple-200 to-indigo-200">
            De Storyboard a Video con IA Generativa
          </h1>
          <h2 className="mx-auto mb-10 max-w-3xl text-xl text-gray-300 md:text-2xl">
            Convierte tus bocetos en videos animados profesionales con nuestra plataforma de IA. Control creativo total,
            sin conocimientos técnicos.
          </h2>

          {/* Input/Upload Switch and Form */}
            <div className="mx-auto mb-16 max-w-3xl">
            {/* Using the reusable SwitchSelector component */}
            <SwitchSelector
              option1Label="Subir Storyboard"
              option2Label="Escribir Prompt"
              option1Icon={<Upload className="h-5 w-5" />}
              option2Icon={<Pen className="h-5 w-5" />}
              defaultSelected={isPromptMode}
              onChange={handleInputModeChange}
            />

            {/* Added margin-top to create more separation */}
            <div className="mt-8">
              {/* Container with fixed height and transition */}
              <div
              className="md:transition-height md:duration-200 md:ease-in-out overflow-hidden"
              style={{ height: inputAreaHeight }}
              >
                {isPromptMode ? (
                <form
                ref={promptInputRef}
                onSubmit={handleSubmit}
                className="rounded-xl bg-gray-900/60 p-2 backdrop-blur-sm border border-purple-500/20 md:shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                >
                <div className="flex flex-col sm:flex-row">
                  <div className="flex-1 relative">
                  <Input
                  className="h-12 flex-1 border-0 bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  />
                  <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                  <TypewriterEffect isVisible={!inputFocused && !inputValue} />
                  </div>
                  </div>
                  <div className="flex mt-2 sm:mt-0 gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-12 w-12 border-0 bg-transparent hover:bg-transparent peer"
                    type="button"
                  >
                    <Sparkles className="text-gray-400 hover:text-white hover:opacity-100 opacity-60 transition-all duration-200" />
                  </Button>

                  <Button
                  type="submit"
                  size="icon"
                  className="h-12 w-12 md:bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 md:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  >
                  <ArrowRight className="h-5 w-5" />
                  </Button>
                  </div>
                </div>
                </form>
                ) : (
                <div
                ref={uploadAreaRef}
                className={`rounded-xl bg-gray-900/60 p-10 md:py-24 md:backdrop-blur-sm border-2 border-dashed ${
                  isDragging ? "border-purple-500 bg-gray-900/80" : "border-gray-600"
                } transition-colors duration-200 md:shadow-[0_0_15px_rgba(139,92,246,0.15)] text-center`}
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                >
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gray-800/80 flex items-center justify-center">
                  <Upload className="h-7 w-7 text-purple-400" />
                  </div>
                  <div className="my-2">
                  <p className="text-white font-medium text-lg">Arrastra y suelta tu storyboard</p>
                  <p className="text-gray-400 text-sm mt-2">o haz clic para seleccionar un archivo</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Formatos soportados: JPG, PNG, PDF</p>
                </div>
                </div>
                )}
              </div>
            </div>
            </div>


        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="relative py-20 text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-[#0f0f1a] to-[#0a0a12] z-0"></div>
        <div className="container relative z-10 mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block rounded-full bg-indigo-950 md:bg-gradient-to-r from-purple-600/20 to-indigo-600/20 px-4 py-1 text-sm font-medium text-purple-300 backdrop-blur-md mb-4">
              PROCESO SIMPLE
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-white md:bg-gradient-to-r from-white via-purple-200 to-indigo-200">
              Así Funciona Nuestra Plataforma
            </h2>
          </div>

          {/* Storyboard to Video Flow */}
          <div className="mt-24 relative">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-24">
              {/* Step 1: Hand-drawn Storyboard */}
                <div className="flex flex-col items-center lg:self-end">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 md:bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                <span className="text-xl font-bold">1</span>
                </div>
                <div className="relative w-80 aspect-video rounded-xl overflow-hidden border-2 border-purple-500/30">
                {/* Using the new storyboard image */}
                <Image
                src="/images/storyboard_boceto.png"
                alt="Storyboard boceto"
                width={400}
                height={225}
                className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-4">
                <span className="text-white font-medium">Sube tu boceto</span>
                </div>
                </div>
                </div>

                {/* Arrow - Only visible on mobile */}
                <div className="transform rotate-90 lg:hidden my-2">
                <ArrowRight className="h-8 w-8 text-purple-500" />
                </div>

                {/* Step 2: AI-Enhanced Storyboard */}
                <div className="flex flex-col items-center lg:self-start lg:-mt-12">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 md:bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                <span className="text-xl font-bold">2</span>
                </div>
                <div className="relative">
                {/* Main image (in front) */}
                <div className="relative z-20 w-72 rounded-xl overflow-hidden border-2 border-purple-500/50 md:shadow-[0_0_25px_rgba(139,92,246,0.3)]">
                <Image
                src="/images/storyboardIA_2.png"
                alt="Storyboard IA mejorado"
                width={350}
                height={350}
                className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-4">
                <span className="text-white font-medium">IA mejora el storyboard</span>
                </div>
                </div>

                {/* Background images - reduced size in desktop view */}
                {/* Left card */}
                <div className="absolute lg:top-8 lg:-left-12 -top-16 left-1/2 transform -translate-x-1/2 lg:translate-x-0 lg:h-32 lg:w-32 w-48 h-48 z-10 rounded-xl overflow-hidden border border-purple-500/20 blur-[2px]">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <Image
                src="/images/storyboardIA_1.png"
                alt="Storyboard IA frame 1"
                width={250}
                height={250}
                className="object-cover w-full h-full"
                />
                </div>

                {/* Right card */}
                <div className="absolute top-16 lg:top-8 lg:-right-12 -top-16 right-1/2 transform translate-x-1/2 lg:translate-x-0 lg:h-32 lg:w-32 w-48 h-48 z-10 rounded-xl overflow-hidden border border-purple-500/20 blur-[2px]">
                  <div className="absolute inset-0 bg-black/40 z-10"></div>
                  <Image
                    src="/images/storyboardIA_3.png"
                    alt="Storyboard IA frame 3"
                    width={250}
                    height={250}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              </div>

              {/* Arrow - Only visible on mobile */}
              <div className="transform rotate-90 lg:hidden w-8 my-20 mb-4">
                <ArrowRight className="h-8 w-8 text-purple-500" />
              </div>

              {/* Step 3: Final Video */}
              <div className="flex flex-col items-center lg:self-end">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 md:bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                  <span className="text-xl font-bold">3</span>
                </div>
                <div
                  className="relative w-80 aspect-video rounded-xl overflow-hidden border-2 border-purple-500/30 cursor-pointer bg-black"
                  onMouseEnter={() => setIsVideoHovered(true)}
                  onMouseLeave={() => setIsVideoHovered(false)}
                >
                    <div className="flex items-center justify-center h-full">
                    <Image
                      src={isVideoHovered ? "/animation.gif" : "/pre_animation.png"}
                      alt="Video final"
                      width={400}
                      height={225}
                      className="object-contain max-h-full"
                    />
                    </div>
                  <div
                    className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
                      isVideoHovered ? "opacity-80" : "opacity-50"
                    }`}
                  >
                    <Play className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-4">
                    <span className="text-white font-medium">Video animado final</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-12 md:grid-cols-3 mt-24 md:mt-8">
            <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-purple-500/10 md:shadow-[0_0_15px_rgba(139,92,246,0.1)] backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 md:bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Sube tu Storyboard</h3>
              <p className="text-gray-300">
              Carga tus bocetos dibujados a mano o describe tu escena en texto. Define el estilo visual (animado, realista, cómic) y la paleta de colores que deseas.               
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-purple-500/10 md:shadow-[0_0_15px_rgba(139,92,246,0.1)] backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 md:bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Edita con StoryBuilder AI</h3>
              <p className="text-gray-300">
              la IA convierte tus bocetos en arte profesional según tu configuración. Luego, edita diálogos, ajusta escenas y reorganiza tomas con drag-and-drop. Controla cada detalle de tu historia antes de animar.                </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-purple-500/10 md:shadow-[0_0_15px_rgba(139,92,246,0.1)] backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 md:bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Genera tu Video</h3>
              <p className="text-gray-300">
                Convierte tu storyboard en un video animado con nuestro editor inteligente. Controla duración, transiciones y añade audio generado por IA.              
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Demo Section */}
      <section ref={demoRef} id="features" className="relative py-20 text-white">
        <div className="absolute inset-0 md:bg-gradient-to-b from-[#0a0a12] via-[#0f0f1a] to-[#0a0a12] z-0"></div>
        <div className="container relative z-10 mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block rounded-full bg-indigo-950 md:bg-gradient-to-r from-purple-600/20 to-indigo-600/20 px-4 py-1 text-sm font-medium text-purple-300 backdrop-blur-md mb-4">
              EDITA Y MEJORA
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-white md:bg-gradient-to-r from-white via-purple-200 to-indigo-200">
              Pre-visualiza tu Historia
            </h2>
            <p className="mx-auto mt-4 mb-12 max-w-3xl text-center text-gray-300">
              Nuestra interfaz intuitiva te permite editar cada aspecto de tu storyboard antes de generar el video
              final. Control creativo total con la potencia de la IA.
            </p>
          </div>

          <div className="mx-auto max-w-6xl">
            {/* Using our StoryBuilder component instead of hardcoded interface */}
            <StoryBuilder />
          </div>
        </div>
      </section>

      {/* Video Editor Interface Section */}
      <section className="relative py-20 text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-[#0f0f1a] to-[#0a0a12] z-0"></div>
        <div className="container relative z-10 mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block rounded-full bg-indigo-950 md:bg-gradient-to-r from-purple-600/20 to-indigo-600/20 px-4 py-1 text-sm font-medium text-purple-300 backdrop-blur-md mb-4">
              EDICIÓN AVANZADA
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-white md:bg-gradient-to-r from-white via-purple-200 to-indigo-200">
              Generación de Video con IA
            </h2>
            <p className="mx-auto mt-4 mb-12 max-w-3xl text-center text-gray-300">
              Ajusta cada detalle de tu video con nuestro editor intuitivo potenciado por IA. Sincroniza audio, añade
              efectos y perfecciona la duración de cada escena.
            </p>
          </div>

          <div className="mx-auto max-w-6xl">
            {/* Using the refactored VideoEditor component */}
            <VideoEditor />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-[#0f0f1a] to-[#0a0a12] z-0"></div>
        <div className="container relative z-10 mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block rounded-full bg-indigo-950 md:bg-gradient-to-r from-purple-600/20 to-indigo-600/20 px-4 py-1 text-sm font-medium text-purple-300 backdrop-blur-md mb-4">
              VENTAJAS
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-white md:bg-gradient-to-r from-white via-purple-200 to-indigo-200">
              Beneficios Clave de Nuestra Plataforma
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <BenefitCard 
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                  />
                </svg>
              }
              title="Reducción de costos"
              description="Elimina la necesidad de contratar actores, animadores y equipo de producción. Reduce drásticamente los costos de producción audiovisual."
            />

            <BenefitCard 
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              }
              title="Control creativo total"
              description='Sistema "human-in-the-loop" que te permite intervenir en cada fase del proceso, evitando interpretaciones erróneas de la IA y manteniendo tu visión creativa.'
            />

            <BenefitCard 
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
              }
              title="Velocidad de producción"
              description="Reduce el tiempo de producción de semanas a horas. Genera videos de alta calidad en una fracción del tiempo que tomaría con métodos tradicionales."
            />

            <BenefitCard 
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              title="Sin conocimientos técnicos"
              description="Interfaz intuitiva diseñada para usuarios sin experiencia en animación o producción de video. Crea contenido profesional sin curva de aprendizaje."
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative pb-20 text-white">
        <div className="absolute inset-0  md:bg-gradient-to-b from-[#0a0a12] via-[#0f0f1a] to-[#0a0a12] z-0"></div>
        <div className="container relative z-10 mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-block rounded-full bg-indigo-950 md:bg-gradient-to-r from-purple-600/20 to-indigo-600/20 px-4 py-1 text-sm font-medium text-purple-300 backdrop-blur-md mb-4">
              PREGUNTAS
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-white md:bg-gradient-to-r from-white via-purple-200 to-indigo-200">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-gray-800">
                <AccordionTrigger className="text-left text-white py-4">
                  ¿Necesito tener habilidades de dibujo para usar la plataforma?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  No, no necesitas habilidades de dibujo. Puedes subir bocetos simples o incluso generar un storyboard
                  mediante un prompt de texto. Nuestra IA se encarga de transformar tus ideas en imágenes profesionales.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b border-gray-800">
                <AccordionTrigger className="text-left text-white py-4">
                  ¿Cómo funciona el sistema de créditos?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Cada acción en la plataforma consume una cantidad específica de créditos: subir un storyboard (1
                  crédito), modificarlo (1 crédito), generar un video (7 créditos), añadir efectos de sonido (1 crédito)
                  o generar diálogos (2 créditos). Los créditos se renuevan mensualmente según tu plan.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b border-gray-800">
                <AccordionTrigger className="text-left text-white py-4">
                  ¿Qué formatos de video puedo exportar?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Puedes exportar tus videos en formatos estándar como MP4, MOV y WebM. Ofrecemos diferentes
                  resoluciones según tu plan de suscripción, desde 720p en el plan Básico hasta 4K en el plan
                  Empresarial.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-gray-800">
                <AccordionTrigger className="text-left text-white py-4">
                  ¿Puedo usar los videos para fines comerciales?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Sí, todos los videos generados en nuestra plataforma te pertenecen y puedes utilizarlos para fines
                  comerciales. Ofrecemos licencias específicas para uso empresarial en nuestros planes Profesional y
                  Empresarial.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>


    </div>
  )
}

