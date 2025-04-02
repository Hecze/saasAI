"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { mockVersions } from "@/lib/mock-data"

export default function ProjectRedirect({ params }: { params: { projectId: string } }) {
  const router = useRouter()
  const { projectId } = React.use(params)

  useEffect(() => {
    try {
      // Buscar versiones para este proyecto
      const projectVersions = mockVersions.filter((v) => v.projectId === projectId)

      if (projectVersions.length > 0) {
        // Si hay versiones, redirigir a la primera
        const versionUrl = `/storybuilder/projects/${projectId}/version/${projectVersions[0].id}`
        console.log(`Redirecting to existing version: ${versionUrl}`)
        router.push(versionUrl)
      } else {
        // Si no hay versiones, crear una por defecto
        const newVersion = {
          id: `version-${Date.now()}`,
          projectId,
          name: "Versión inicial",
          description: "Versión inicial del storyboard",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          thumbnail: "/placeholder.svg?height=150&width=200",
          scenes: [],
        }

        // Agregar la nueva versión a mockVersions
        mockVersions.push(newVersion)

        // Redirigir a la nueva versión
        const newVersionUrl = `/storybuilder/projects/${projectId}/version/${newVersion.id}`
        console.log(`Creating and redirecting to new version: ${newVersionUrl}`)
        router.push(newVersionUrl)
      }
    } catch (error) {
      console.error("Error during redirection:", error)
      // Optionally provide fallback behavior here
    }
  }, [projectId, router])

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
      </div>
    </div>
  )
}

