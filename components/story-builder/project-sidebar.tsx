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
import { Plus, Folder, Shell, Pencil, X } from "lucide-react"
import { storyboardService } from "@/lib/storyboard-service"
import type { Project } from "@/lib/storyboard-service"
import Link from "next/link"
import { EntityNameDialog } from "@/components/story-builder/entity-name-dialog"
import { ConfirmModal } from "@/components/ui/confirm-modal"

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
  const [isCreating, setIsCreating] = useState(false)
  
  // Edit project modal state
  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  
  // Delete project confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)

  // Fetch projects when component mounts
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true)
      setError(null)

      try {
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
      const versions = storyboardService.getVersions(projectId)
      
      if (versions.length > 0) {
        router.push(`/storybuilder/projects/${projectId}/version/${versions[0].id}`)
      } else {
        const newVersion = storyboardService.createVersion({
          projectId: projectId,
          name: "Version 1",
          description: "Initial version",
          thumbnail: "/placeholder.svg?height=150&width=200",
          scenes: []
        })
        
        router.push(`/storybuilder/projects/${projectId}/version/${newVersion.id}`)
      }
    } catch (err) {
      console.error("Error navigating to project:", err)
      alert("Error al navegar al proyecto. Por favor, inténtalo de nuevo.")
    }
  }

  const createNewProject = async (newProjectName: string) => {
    if (!newProjectName.trim()) return;
    
    setIsCreating(true);
    
    try {
      const newProject = storyboardService.createProject({
        name: newProjectName,
        description: `Proyecto: ${newProjectName}`,
        thumbnail: "/placeholder.svg?height=150&width=200",
      })
      
      const initialVersion = storyboardService.createVersion({
        projectId: newProject.id,
        name: "Version 1",
        description: "Initial version",
        thumbnail: "/placeholder.svg?height=150&width=200",
        scenes: []
      })
      
      setProjects([newProject, ...projects])
      
      // Close the modal before navigation
      setNewProjectModalOpen(false)
      
      router.push(`/storybuilder/projects/${newProject.id}/version/${initialVersion.id}`)
    } catch (err) {
      console.error("Error creating project:", err)
      alert("Error al crear el proyecto. Por favor, inténtalo de nuevo.")
    } finally {
      setIsCreating(false)
    }
  }
  
  const handleEditProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToEdit(project);
    setEditProjectModalOpen(true);
  }
  
  const handleDeleteProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setConfirmModalOpen(true);
  }
  
  const confirmDeleteProject = () => {
    if (!projectToDelete) return;
    
    try {
      const versions = storyboardService.getVersions(projectToDelete.id);
      versions.forEach(version => {
        // storyboardService.deleteVersion(version.id);
      });
      
      const updatedProjects = projects.filter(p => p.id !== projectToDelete.id);
      storyboardService.updateProjects(updatedProjects);
      
      setProjects(updatedProjects);
      
      if (selectedProject === projectToDelete.id) {
        if (updatedProjects.length > 0) {
          handleProjectClick(updatedProjects[0].id);
        } else {
          router.push('/storybuilder');
        }
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Error al eliminar el proyecto. Por favor, inténtalo de nuevo.");
    }
  }
  
  const saveProjectEdit = async (newName: string) => {
    if (!projectToEdit || !newName.trim()) return;
    
    setIsEditing(true);
    
    try {
      const updatedProject = storyboardService.updateProject(projectToEdit.id, {
        name: newName
      });
      
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      
      setEditProjectModalOpen(false);
      setProjectToEdit(null);
    } catch (err) {
      console.error("Error updating project:", err);
      alert("Error al actualizar el proyecto. Por favor, inténtalo de nuevo.");
    } finally {
      setIsEditing(false);
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
                      <div
                        onClick={() => handleProjectClick(project.id)}
                        className={`w-full px-3 py-2 rounded-md flex items-center justify-between text-left border cursor-pointer ${
                          selectedProject === project.id
                            ? "bg-purple-900/30 border-purple-500 text-white"
                            : "bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-800 hover:border-gray-600"
                        } transition-colors`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <Shell className="h-2 w-2 flex-shrink-0" />
                          <span className="truncate">{project.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={(e) => handleEditProject(project, e)}
                            className="p-1 rounded-sm hover:bg-gray-700 text-gray-400 hover:text-white"
                            aria-label="Edit project"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteProject(project, e)}
                            className="p-1 rounded-sm hover:bg-gray-700 text-gray-400 hover:text-white"
                            aria-label="Delete project"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <EntityNameDialog
        isOpen={newProjectModalOpen}
        onOpenChange={setNewProjectModalOpen}
        onCreateEntity={createNewProject}
        isCreating={isCreating}
        title="Crear nuevo proyecto"
        entityLabel="Nombre del proyecto"
        placeholder="Mi Proyecto"
        createButtonText="Crear"
        maxLength={30}
      />
      
      <EntityNameDialog
        isOpen={editProjectModalOpen}
        onOpenChange={setEditProjectModalOpen}
        onCreateEntity={saveProjectEdit}
        isCreating={isEditing}
        title="Editar nombre del proyecto"
        entityLabel="Nombre del proyecto"
        placeholder="Mi Proyecto"
        createButtonText="Guardar"
        initialValue={projectToEdit?.name}
        maxLength={30}
      />
      
      <ConfirmModal 
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDeleteProject}
        title="¿Eliminar proyecto?"
        message={`¿Estás seguro de que deseas eliminar el proyecto "${projectToDelete?.name}"? Esta acción no se puede deshacer.`}
      />
    </Sidebar>
  )
}

