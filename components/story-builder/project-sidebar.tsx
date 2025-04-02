"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, Folder } from "lucide-react"
import { fetchProjects } from "@/lib/api"
import type { Project } from "@/lib/api"
import Link from "next/link"

interface ProjectSidebarProps {
  pathname: string
}

export function ProjectSidebar({ pathname }: ProjectSidebarProps) {
  const router = useRouter()
  const { state } = useSidebar()

  // Extract project ID from pathname
  const projectIdMatch = pathname.match(/\/storybuilder\/projects\/([^/]+)/)
  const projectId = projectIdMatch ? projectIdMatch[1] : null

  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(projectId)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch projects when component mounts
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const projectsData = await fetchProjects()
        setProjects(projectsData)
      } catch (err) {
        console.error("Error loading projects:", err)
        setError("Error al cargar los proyectos")
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  // Update selected project when pathname changes
  useEffect(() => {
    if (projectId) {
      setSelectedProject(projectId)
    }
  }, [projectId])

  const handleProjectClick = async (projectId: string) => {
    setSelectedProject(projectId)

    try {
      // Navigate to the project page, which will handle fetching versions
      router.push(`/storybuilder/projects/${projectId}`)
    } catch (err) {
      console.error("Error navigating to project:", err)
      alert("Error al navegar al proyecto. Por favor, inténtalo de nuevo.")
    }
  }

  const createNewProject = async () => {
    try {
      // In a real app, this would create a new project in the database
      const newProject = {
        name: "Nuevo Proyecto",
        description: "Descripción del nuevo proyecto",
        thumbnail: "/placeholder.svg?height=150&width=200",
      }

      // Navigate to create project page or directly create and navigate
      router.push(`/storybuilder/projects/nuevo-proyecto`)
    } catch (err) {
      console.error("Error creating project:", err)
      alert("Error al crear el proyecto. Por favor, inténtalo de nuevo.")
    }
  }

  return (
    <Sidebar className="border-r border-gray-800">
      <SidebarHeader className="border-b border-gray-800 h-14 py-2">
        <div className="flex items-center justify-between px-4">
          <Link href="/main" className="text-lg font-semibold text-white">
        StoryBuilder AI
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Projects Section */}
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-2">
            <SidebarGroupLabel>Proyectos</SidebarGroupLabel>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={createNewProject}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                <div className="px-4 py-2 text-sm text-gray-400">Cargando proyectos...</div>
              ) : error ? (
                <div className="px-4 py-2 text-sm text-red-400">{error}</div>
              ) : projects.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-400">No hay proyectos</div>
              ) : (
                <div className="space-y-2 px-2">
                  {projects.map((project) => (
                    <div key={project.id} className="mb-2">
                      <button
                        onClick={() => handleProjectClick(project.id)}
                        className={`w-full px-3 py-2 rounded-md flex items-center text-left border ${
                          selectedProject === project.id
                            ? "bg-purple-900/30 border-purple-500 text-white"
                            : "bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-800 hover:border-gray-600"
                        } transition-colors`}
                      >
                        <Folder className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{project.name}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

