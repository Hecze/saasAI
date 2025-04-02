"use client"

import { useState, useEffect, use, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText, Save, Clock, Plus, Download, Share2, Play, Video } from "lucide-react"
import StoryBuilder from "@/components/story-builder/story-builder"
import { storyboardService } from "@/lib/storyboard-service"
import type { Version } from "@/lib/api"
import { DropdownSelector } from "@/components/story-builder/dropdown-selector"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

// Helper function to safely use params
function useParams<T>(params: T | Promise<T>): T {
  return params instanceof Promise ? use(params) : params;
}

// TopNavigationBar component
function TopNavigationBar({ 
  project, 
  version, 
  versions,
  versionId, 
  projectId,
  isSaving,
  showVersionsDropdown,
  setShowVersionsDropdown,
  openNewVersionModal,
  saveStoryboard,
  router
}: { 
  project: any;
  version: Version;
  versions: Version[];
  versionId: string;
  projectId: string;
  isSaving: boolean;
  saveMessage: string;
  showVersionsDropdown: boolean;
  setShowVersionsDropdown: (show: boolean) => void;
  openNewVersionModal: () => void;
  saveStoryboard: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  return (
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
              onCreateNew={openNewVersionModal}
              createNewText="Crear nueva versión"
              open={showVersionsDropdown}
              onClose={() => setShowVersionsDropdown(false)}
            />
          </div>
          
          {/* Action buttons */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={saveStoryboard}
                  disabled={isSaving}
                  variant="outline"
                  size="icon"
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300 h-9 w-9"
                >
                  {isSaving ? (
                    <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Guardar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline" 
                  size="icon"
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300 h-9 w-9"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Exportar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline" 
                  size="icon"
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300 h-9 w-9"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Compartir</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline" 
                  size="icon"
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300 h-9 w-9"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Previsualizar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            <Video className="mr-2 h-4 w-4" />
            Convertir a video
          </Button>
        </div>
      </div>
    </header>
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
  const [saveMessage, setSaveMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showVersionsDropdown, setShowVersionsDropdown] = useState(false)
  const [newVersionName, setNewVersionName] = useState("")
  const [versions, setVersions] = useState<Version[]>([])
  
  // New state for the modal
  const [newVersionModalOpen, setNewVersionModalOpen] = useState(false)

  // Add a ref to access StoryBuilder methods
  const storyBuilderRef = useRef<any>(null);

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
        console.log("Version scenes:", versionData.scenes);
        
        // Ensure scenes array is initialized
        const versionWithScenes = {
          ...versionData,
          scenes: Array.isArray(versionData.scenes) ? versionData.scenes : []
        };
        
        setVersion(versionWithScenes)

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

  const createNewVersion = async () => {
    if (!newVersionName.trim() || !version) return

    setIsSaving(true)
    try {
      // Create a new version based on current one
      const newVersion = storyboardService.createVersion({
        projectId,
        name: newVersionName,
        description: `Nueva versión: ${newVersionName}`,
        thumbnail: "/placeholder.svg?height=150&width=200",
        scenes: version.scenes || [],
      })
      
      // Update local state
      setVersions([newVersion, ...versions])

      // Reset form and close modal
      setNewVersionName("")
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

  const saveStoryboard = () => {
    if (!version || isSaving) return
    
    setIsSaving(true)
    
    // Get the latest scenes directly from the StoryBuilder component if available
    let currentScenes = version.scenes;
    
    // Check if the ref has a getCurrentScenes method (we'll need to add this to StoryBuilder)
    if (storyBuilderRef.current && typeof storyBuilderRef.current.getCurrentScenes === 'function') {
      console.log("Getting latest scenes from StoryBuilder component");
      currentScenes = storyBuilderRef.current.getCurrentScenes();
    } else {
      console.log("StoryBuilder ref not available, using version state scenes");
    }
    
    console.log("Saving storyboard with scenes:", currentScenes);

    try {
      // Make sure we're explicitly passing the complete version object with the latest scenes
      const updatedVersion = storyboardService.updateVersion(version.id, {
        ...version,
        scenes: currentScenes
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

  // Handle scene updates from the StoryBuilder component
  const handleScenesUpdate = (updatedScenes: any[]) => {
    if (version) {
      console.log("Scene update received from StoryBuilder:", updatedScenes);
      
      // Deep clone to ensure we have fresh references
      const updatedScenesClone = JSON.parse(JSON.stringify(updatedScenes));
      
      // Create a new version object with the updated scenes
      const updatedVersion = {
        ...version,
        scenes: updatedScenesClone,
      };
      
      // Update the local state with the new version
      setVersion(updatedVersion);
      
      // Debug: Log the current version state after update
      console.log("Version state after scene update:", updatedVersion);
    }
  }

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
      {/* Use the TopNavigationBar component */}
      <TopNavigationBar 
        project={project}
        version={version}
        versions={versions}
        versionId={versionId}
        projectId={projectId}
        isSaving={isSaving}
        showVersionsDropdown={showVersionsDropdown}
        setShowVersionsDropdown={setShowVersionsDropdown}
        openNewVersionModal={() => setNewVersionModalOpen(true)}
        saveStoryboard={saveStoryboard}
        router={router}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-4 bg-app-bg">
        <StoryBuilder 
          ref={storyBuilderRef}
          initialScenes={version.scenes || []} 
          projectId={projectId} 
          versionId={versionId} 
          onScenesUpdate={handleScenesUpdate}
          key={`storybuilder-${versionId}`} // Add a key to force re-render when version changes
        />
      </div>

      {/* New Version Creation Modal */}
      <Dialog open={newVersionModalOpen} onOpenChange={setNewVersionModalOpen}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Crear nueva versión</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="version-name" className="text-gray-300">Nombre de la versión</Label>
              <Input 
                id="version-name"
                value={newVersionName} 
                onChange={(e) => setNewVersionName(e.target.value)}
                placeholder="Nueva versión" 
                maxLength={20}
                className="bg-gray-800 border-gray-700 focus:border-purple-500 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setNewVersionModalOpen(false)
                setNewVersionName("")
              }}
              className="border-gray-700 text-slate-700 hover:bg-slate-700 hover:text-gray-200 hover:border-gray-600"
            >
              Cancelar
            </Button>
            <Button
              onClick={createNewVersion}
              disabled={!newVersionName.trim() || isSaving}
              className={`${!newVersionName.trim() || isSaving ? 
                'bg-purple-700/50 cursor-not-allowed' : 
                'bg-purple-600 hover:bg-purple-700'}`}
            >
              {isSaving ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}