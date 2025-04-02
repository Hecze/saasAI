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
import { Plus, Folder, Shell } from "lucide-react"
import { storyboardService } from "@/lib/storyboard-service"
import type { Project } from "@/lib/api"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  
  // New project modal state
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  // Fetch projects when component mounts
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true)
      setError(null)

      try {

        // Then get the projects (which may now include demo data)
        const projectsData = storyboardService.getProjects()
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
      // Get versions for this project
      const versions = storyboardService.getVersions(projectId)
      
      // If project has versions, navigate to the first one
      // Otherwise, we need to create a default version
      if (versions.length > 0) {
        router.push(`/storybuilder/projects/${projectId}/version/${versions[0].id}`)
      } else {
        // Create default version
        const newVersion = storyboardService.createVersion({
          projectId: projectId,
          name: "Version 1",
          description: "Initial version",
          thumbnail: "/placeholder.svg?height=150&width=200",
          scenes: []
        })
        
        // Navigate to the new version
        router.push(`/storybuilder/projects/${projectId}/version/${newVersion.id}`)
      }
    } catch (err) {
      console.error("Error navigating to project:", err)
      alert("Error al navegar al proyecto. Por favor, inténtalo de nuevo.")
    }
  }

  const createNewProject = async () => {
    if (!newProjectName.trim()) return;
    
    setIsCreating(true);
    
    try {
      // Create a new project with the user-provided name
      const newProject = storyboardService.createProject({
        name: newProjectName,
        description: `Proyecto: ${newProjectName}`,
        thumbnail: "/placeholder.svg?height=150&width=200",
      })
      
      // Create initial version for this project
      const initialVersion = storyboardService.createVersion({
        projectId: newProject.id,
        name: "Version 1",
        description: "Initial version",
        thumbnail: "/placeholder.svg?height=150&width=200",
        scenes: []
      })
      
      // Update local state
      setProjects([newProject, ...projects])
      
      // Close modal and reset form
      setNewProjectModalOpen(false)
      setNewProjectName("")
      
      // Navigate to the new project with its initial version
      router.push(`/storybuilder/projects/${newProject.id}/version/${initialVersion.id}`)
    } catch (err) {
      console.error("Error creating project:", err)
      alert("Error al crear el proyecto. Por favor, inténtalo de nuevo.")
    } finally {
      setIsCreating(false)
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
            <div className="flex items-center space-x-2">
            <Folder className="h-4 w-4 text-gray-400 " />
            <SidebarGroupLabel className="text-md">Proyectos</SidebarGroupLabel>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() => setNewProjectModalOpen(true)}
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
                        } transition-colors space-x-2`}
                      >
                        <Shell className="mr-2 h-2 w-2 flex-shrink-0 " />
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
      
      {/* New Project Creation Modal */}
      <Dialog open={newProjectModalOpen} onOpenChange={setNewProjectModalOpen}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Crear nuevo proyecto</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name" className="text-gray-300">Nombre del proyecto</Label>
              <Input 
                id="project-name"
                value={newProjectName} 
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Mi Proyecto" 
                maxLength={30}
                className="bg-gray-800 border-gray-700 focus:border-purple-500 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setNewProjectModalOpen(false)
                setNewProjectName("")
              }}
              className="border-gray-700 text-slate-700 hover:bg-slate-700 hover:text-gray-200 hover:border-gray-600"
            >
              Cancelar
            </Button>
            <Button
              onClick={createNewProject}
              disabled={!newProjectName.trim() || isCreating}
              className={`${!newProjectName.trim() || isCreating ? 
                'bg-purple-700/50 cursor-not-allowed' : 
                'bg-purple-600 hover:bg-purple-700'}`}
            >
              {isCreating ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}

