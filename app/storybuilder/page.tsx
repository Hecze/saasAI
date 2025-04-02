"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { mockProjects } from "@/lib/mock-data"

export default function StoryboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir al primer proyecto si existe, o mostrar un mensaje de bienvenida
    if (mockProjects.length > 0) {
      router.push(`/storybuilder/projects/${mockProjects[0].id}`)
    }
  }, [router])

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md p-8">
        <h1 className="text-2xl font-bold text-white mb-4">StoryBuilder AI</h1>
        <p className="text-gray-400">Selecciona un proyecto del panel lateral o crea uno nuevo para comenzar.</p>
      </div>
    </div>
  )
}

