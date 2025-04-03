"use client"

import { useState, useEffect, use, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FileText, Save, Clock, Plus, Download, Share2, Play, Video, GripVertical, RefreshCw, MessageSquare, ImageIcon, Trash2 } from "lucide-react"
import { storyboardService } from "@/lib/storyboard-service"
import type { Version } from "@/lib/api"
import { DropdownSelector } from "@/components/story-builder/dropdown-selector"
import { ActionButton } from "@/components/story-builder/action-button"
import { EntityNameDialog } from "@/components/story-builder/entity-name-dialog"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { PreviewModal } from "@/components/story-builder/preview-modal"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

// Helper function to safely use params
function useParams<T>(params: T | Promise<T>): T {
  return params instanceof Promise ? use(params) : params;
}

export interface SceneProps {
  id: number
  title: string
  description: string
  dialogue: string
  image: string | null
  color: string
}

// Scene Card Component
const SceneCard = ({
  scene,
  index,
  scenes,
  updateScenes,
  onDeleteScene,
}: {
  scene: SceneProps
  index: number
  scenes: SceneProps[]
  updateScenes: (scenes: SceneProps[]) => void
  onDeleteScene: (id: number) => void
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)

      updateScenes(scenes.map((s) => (s.id === scene.id ? { ...s, image: imageUrl } : s)))
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateScenes(scenes.map((s) => (s.id === scene.id ? { ...s, title: e.target.value } : s)))
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateScenes(scenes.map((s) => (s.id === scene.id ? { ...s, description: e.target.value } : s)))
  }

  const handleDialogueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateScenes(scenes.map((s) => (s.id === scene.id ? { ...s, dialogue: e.target.value } : s)))
  }

  return (
    <div className="relative">
      {/* Delete button in top-right corner */}
      {scenes.length > 1 && (
        <button
          className="absolute top-2 right-2 z-20 bg-red-900/70 hover:bg-red-800 text-white p-1.5 rounded-full shadow-md"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDeleteScene(scene.id)
          }}
          aria-label="Eliminar escena"
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* Scene Image */}
      <div
        className={`relative h-72 ${
          scene.image
            ? "bg-gray-800/80"
            : "bg-gradient-to-br from-gray-800/80 to-gray-900/80"
        }`}
        onClick={(e) => {
          // Only trigger file input if not clicking on the delete button
          if (!(e.target as HTMLElement).closest("button")) {
            triggerFileInput()
          }
        }}
      >
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

        {scene.image ? (
          <Image src={scene.image || ""} alt={scene.title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="h-10 w-10 mb-2" />
            <p className="text-sm">Haz clic para subir</p>
          </div>
        )}

        {/* Scene number */}
        <div className="absolute top-2 left-10 bg-white text-black text-xs font-medium px-2 py-1 rounded">
          {index + 1}
        </div>
      </div>

      {/* Scene Info */}
      <div className="p-4">
        {/* Title */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-400 mb-1">Título</label>
          <input
            type="text"
            value={scene.title}
            onChange={handleTitleChange}
            className="w-full rounded border border-gray-700 bg-gray-800/60 p-2 text-sm text-gray-300 focus:border-purple-500 focus:outline-none focus:ring-0"
            placeholder="Título de la escena..."
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-gray-400">Descripción</label>
          </div>
          <textarea
            value={scene.description}
            onChange={handleDescriptionChange}
            placeholder="Describe lo que sucede en esta escena..."
            className="w-full min-h-[80px] rounded border border-gray-700 bg-gray-800/60 p-2 text-sm text-gray-300 focus:border-purple-500 focus:outline-none focus:ring-0"
          />
        </div>

        {/* Dialogue */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-gray-400">Diálogo</label>
          </div>
          <textarea
            value={scene.dialogue}
            onChange={handleDialogueChange}
            placeholder="Añade diálogos para los personajes..."
            className="w-full min-h-[80px] rounded border border-gray-700 bg-gray-800/60 p-2 text-sm text-gray-300 focus:border-purple-500 focus:outline-none focus:ring-0"
          />
        </div>
      </div>
    </div>
  )
}

export default function StoryboardEditor({ params }: { params: { projectId: string; versionID: string } | Promise<{ projectId: string; versionID: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  
  // Safely unwrap the params using our helper
  const unwrappedParams = useParams(params);
  const projectId = unwrappedParams.projectId;
  const versionId = unwrappedParams.versionID;

  const [project, setProject] = useState<any>(null)
  const [version, setVersion] = useState<Version | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showVersionsDropdown, setShowVersionsDropdown] = useState(false)
  const [versions, setVersions] = useState<Version[]>([])
  
  // New state for the modal
  const [newVersionModalOpen, setNewVersionModalOpen] = useState(false)
  
  // Scene management states
  const [scenes, setScenes] = useState<SceneProps[]>([])
  const [activeScene, setActiveScene] = useState<number>(1)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; sceneId: number | null }>({
    isOpen: false,
    sceneId: null,
  })

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Add a mounted state to handle hydration issues
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load data using our service
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        console.log(`Loading data for project: ${projectId}, version: ${versionId}`);
        
        // Get project from service
        const projectData = storyboardService.getProject(projectId)
        if (!projectData) {
          console.error(`Project not found: ${projectId}`);
          setError("Proyecto no encontrado")
          setIsLoading(false)
          return
        }
        console.log("Project data loaded:", projectData);
        setProject(projectData)

        // Get version from service
        const versionData = storyboardService.getVersion(versionId)
        if (!versionData) {
          console.error(`Version not found: ${versionId} in project: ${projectId}`)
          setError(`Versión no encontrada (ID: ${versionId})`)
          setIsLoading(false)
          return
        }
        
        console.log("Version data loaded:", versionData);
        
        // Ensure scenes array is initialized
        const versionWithScenes = {
          ...versionData,
          scenes: Array.isArray(versionData.scenes) ? versionData.scenes : []
        };
        
        setVersion(versionWithScenes)
        
        // Initialize scenes from version data
        if (versionWithScenes.scenes && versionWithScenes.scenes.length > 0) {
          setScenes(versionWithScenes.scenes)
          setActiveScene(versionWithScenes.scenes[0].id)
        } else {
          // Create a default scene if none exists
          const defaultScene = {
            id: 1,
            title: "Nueva escena",
            description: "",
            dialogue: "",
            image: null,
            color: "bg-purple-500",
          }
          setScenes([defaultScene])
          setActiveScene(1)
        }

        // Get all versions for this project
        const projectVersions = storyboardService.getVersions(projectId)
        setVersions(projectVersions)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Error al cargar los datos. Por favor, inténtalo de nuevo.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [projectId, versionId])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = () => {
      setShowVersionsDropdown(false)
    }

    if (showVersionsDropdown) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [showVersionsDropdown])

  // Function to create a new version
  const createNewVersion = async (newVersionName: string) => {
    if (!newVersionName.trim() || !version) return

    setIsSaving(true)
    try {
      // Create a new version based on current one
      const newVersion = storyboardService.createVersion({
        projectId,
        name: newVersionName,
        description: `Nueva versión: ${newVersionName}`,
        thumbnail: "/placeholder.svg?height=150&width=200",
        scenes: scenes || [],
      })
      
      // Update local state
      setVersions([newVersion, ...versions])

      // Reset form and close modal
      setNewVersionModalOpen(false)
      
      // Navigate to the new version
      router.push(`/storybuilder/projects/${projectId}/version/${newVersion.id}`)
    } catch (err) {
      console.error("Error creating version:", err)
      alert("Error al crear la versión. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSaving(false)
    }
  }

  // Function to save the current storyboard
  const saveStoryboard = () => {
    if (!version || isSaving) return
    
    setIsSaving(true)
    
    try {
      // Make sure we're explicitly passing the complete version object with the latest scenes
      const updatedVersion = storyboardService.updateVersion(version.id, {
        ...version,
        scenes: scenes
      });
      
      console.log("Version updated in localStorage:", updatedVersion);
      
      // Verify data was saved by re-fetching it
      const verifyVersion = storyboardService.getVersion(version.id);
      console.log("Verification - version from localStorage:", verifyVersion);
      console.log("Verification - saved scenes:", verifyVersion?.scenes);
      
      // Update local state
      setVersion(updatedVersion);
      setVersions(prev => prev.map(v => v.id === updatedVersion.id ? updatedVersion : v));
      
      // Show toast notification
      toast({
        title: "Guardado con éxito",
        description: "El storyboard ha sido guardado correctamente.",
        duration: 3000,
      });

    } catch (err) {
      console.error("Error saving storyboard:", err);
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar el storyboard. Inténtalo de nuevo.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  }

  // Scene management functions
  const updateScenes = (newScenes: SceneProps[]) => {
    setScenes(newScenes)
    console.log("Scenes updated:", newScenes)
  }

  const handleAddScene = () => {
    const newId = scenes.length > 0 ? Math.max(...scenes.map((scene) => scene.id)) + 1 : 1
    const colors = ["bg-purple-500", "bg-indigo-500", "bg-violet-500", "bg-fuchsia-500", "bg-pink-500"]
    const colorIndex = newId % colors.length

    const newScene: SceneProps = {
      id: newId,
      title: `Nueva escena`,
      description: "",
      dialogue: "",
      image: null,
      color: colors[colorIndex],
    }

    const updatedScenes = [...scenes, newScene]
    updateScenes(updatedScenes)
    setActiveScene(newId)
  }

  const openDeleteModal = (id: number) => {
    setConfirmModal({
      isOpen: true,
      sceneId: id,
    })
  }

  const handleDeleteScene = (id: number) => {
    const filteredScenes = scenes.filter((scene) => scene.id !== id)
    updateScenes(filteredScenes)

    if (activeScene === id && filteredScenes.length > 0) {
      setActiveScene(filteredScenes[0].id)
    }
  }

  // Functions to handle drag and drop
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) {
      return
    }

    const updatedScenes = arrayMove(
      scenes, 
      scenes.findIndex((item) => item.id === active.id), 
      scenes.findIndex((item) => item.id === over.id)
    )
    updateScenes(updatedScenes)
  }
  
  // Placeholder functions for future features
  const exportButtonHandler = () => {
    alert("Exportar: Función por implementar")
  }
  
  const shareButtonHandler = () => {
    alert("Compartir: Función por implementar")
  }
  
  // Add state for preview modal
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  
  // Update the preview button handler to open the modal
  const previewButtonHandler = () => {
    setPreviewModalOpen(true)
  }
  
  const convertToVideoHandler = () => {
    alert("Convertir a video: Función por implementar")
  }

  // Find the active scene for drag overlay
  const activeScene2 = activeId ? scenes.find((scene) => scene.id === activeId) : null
  const activeIndex = activeScene2 ? scenes.findIndex((scene) => scene.id === activeScene2.id) : -1

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md p-6 bg-gray-800/50 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={() => router.push("/storybuilder")}>Volver a proyectos</Button>
        </div>
      </div>
    )
  }

  if (!project || !version) {
    return <div>Cargando...</div>
  }

  return (
    <div className="flex flex-col h-full bg-app-bg">
      {/* Top Navigation Bar - Integrated directly into the page */}
      <header className="border-b border-gray-800 bg-gray-900 shadow-md w-full">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="font-medium text-white">{project?.name || 'Proyecto sin nombre'}</h1>
              <div className="flex items-center text-xs text-gray-400 space-x-2">
                <span className="flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  Storyboard
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Última edición: {version ? new Date(version.updatedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Version Selector */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowVersionsDropdown(!showVersionsDropdown)
                }}
                className="flex items-center space-x-2 text-gray-300 text-sm py-1 px-3 rounded-md border border-gray-700 hover:bg-gray-800"
              >
                <Clock className="h-4 w-4" />
                <span>Versión: {version?.name || 'N/A'}</span>
              </button>

              {/* Use the reusable dropdown component */}
              <DropdownSelector
                title="Seleccionar Versión"
                options={versions.map(v => ({ id: v.id, name: v.name }))}
                selectedId={versionId}
                onSelect={(id) => router.push(`/storybuilder/projects/${projectId}/version/${id}`)}
                onCreateNew={() => setNewVersionModalOpen(true)}
                createNewText="Crear nueva versión"
                open={showVersionsDropdown}
                onClose={() => setShowVersionsDropdown(false)}
              />
            </div>
            
            {/* Action buttons */}
            <ActionButton
              icon={Save}
              label="Guardar"
              onClick={saveStoryboard}
              isLoading={isSaving}
            />

            <ActionButton
              icon={Download}
              label="Exportar"
              onClick={exportButtonHandler}
            />

            <ActionButton
              icon={Share2}
              label="Compartir"
              onClick={shareButtonHandler}
            />

            <ActionButton
              icon={Play}
              label="Previsualizar"
              onClick={previewButtonHandler}
            />

            <Button
              onClick={convertToVideoHandler}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Video className="mr-2 h-4 w-4" />
              Convertir a video
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area - StoryBuilder integrated directly */}
      <div className="flex-1 overflow-auto p-4 bg-app-bg">
        {/* Confirmation Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, sceneId: null })}
          onConfirm={() => {
            if (confirmModal.sceneId !== null) {
              handleDeleteScene(confirmModal.sceneId)
            }
          }}
          title="Eliminar escena"
          message="¿Estás seguro de que deseas eliminar esta escena? Esta acción no se puede deshacer."
        />

        {/* StoryBuilder content */}
        {mounted && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <SortableContext items={scenes.map((scene) => scene.id)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {scenes.map((scene, index) => (
                  <div
                    key={scene.id}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-purple-500/20 shadow-glow-sm overflow-hidden"
                  >
                    <SceneCard
                      scene={scene}
                      index={index}
                      scenes={scenes}
                      updateScenes={updateScenes}
                      onDeleteScene={openDeleteModal}
                    />
                  </div>
                ))}

                {/* Add New Scene Card */}
                <button
                  onClick={handleAddScene}
                  className="bg-gray-900/90 rounded-lg shadow-glow-sm border border-dashed border-purple-500/30 flex items-center justify-center h-64 hover:bg-gray-800/90 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex flex-col items-center text-gray-400">
                    <Plus className="h-8 w-8 mb-2" />
                    <span>Añadir Escena</span>
                  </div>
                </button>
              </div>

              {/* Drag Overlay for improved visual feedback */}
              <DragOverlay>
                {activeId && activeScene2 && (
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-purple-500 shadow-glow-md overflow-hidden opacity-80">
                    <SceneCard
                      scene={activeScene2}
                      index={activeIndex}
                      scenes={scenes}
                      updateScenes={updateScenes}
                      onDeleteScene={openDeleteModal}
                    />
                  </div>
                )}
              </DragOverlay>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* New Version Creation Modal */}
      <EntityNameDialog
        isOpen={newVersionModalOpen}
        onOpenChange={setNewVersionModalOpen}
        onCreateEntity={createNewVersion}
        isCreating={isSaving}
        title="Crear nueva versión"
        entityLabel="Nombre de la versión"
        placeholder="Nueva versión"
        createButtonText="Crear"
        maxLength={20}
      />
      
      {/* Preview Modal */}
      <PreviewModal 
        isOpen={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
        scenes={scenes}
      />
    </div>
  )
}