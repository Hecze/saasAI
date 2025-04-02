"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, Download, Share2, Plus, GripVertical, RefreshCw, MessageSquare, ImageIcon, Trash2 } from "lucide-react"
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
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Add a confirmation modal component
interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full shadow-lg">
        <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  )
}

export interface SceneProps {
  id: number
  title: string
  description: string
  dialogue: string
  image: string | null
  color: string
}

// Create an auto-resizing textarea component
interface AutoExpandingTextareaProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  className?: string
  maxHeight?: string
}

const AutoExpandingTextarea = ({
  value,
  onChange,
  placeholder,
  className,
  maxHeight = "240px",
}: AutoExpandingTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto"

      // Set the height to scrollHeight to expand the textarea
      const newHeight = Math.min(textareaRef.current.scrollHeight, Number.parseInt(maxHeight))
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [value, maxHeight])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      style={{
        resize: "none",
        overflowY:
          textareaRef.current && textareaRef.current.scrollHeight > Number.parseInt(maxHeight) ? "auto" : "hidden",
      }}
    />
  )
}

// Sortable Scene Item Component
const SortableSceneItem = ({
  scene,
  index,
  activeScene,
  setActiveScene,
  scenes,
  onDeleteScene,
}: {
  scene: SceneProps
  index: number
  activeScene: number
  setActiveScene: (id: number) => void
  scenes: SceneProps[]
  onDeleteScene: (id: number) => void
}) => {
  // Fix for hydration error - use useEffect to ensure client-side only rendering of drag attributes
  const [mounted, setMounted] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: scene.id })

  useEffect(() => {
    setMounted(true)
  }, [])

  const style = mounted
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
      }
    : {}

  const getSceneDisplayName = (index: number, title: string) => {
    return `Escena ${index + 1}: ${title}`
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-md border ${activeScene === scene.id ? "border-purple-500 bg-purple-900/20" : "border-gray-700 bg-gray-800/80"} p-3 relative cursor-pointer hover:border-purple-400 transition-colors mb-3`}
      onClick={() => setActiveScene(scene.id)}
      {...(mounted ? attributes : {})}
    >
      <div className="flex items-center gap-2">
        {mounted && (
          <div {...listeners} className="cursor-grab p-1 hover:bg-gray-700 rounded">
            <GripVertical size={14} className="text-gray-400" />
          </div>
        )}
        <div className={`h-3 w-3 rounded-full ${scene.color}`}></div>
        <span className="w-full text-sm text-gray-300 truncate">{getSceneDisplayName(index, scene.title)}</span>

        {/* Delete button */}
        {scenes.length > 1 && (
          <button
            className="text-gray-500 hover:text-red-400 p-1 rounded-full hover:bg-gray-700/50"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteScene(scene.id)
            }}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

// Scene Card Component
const SceneCard = ({
  scene,
  index,
  scenes,
  setScenes,
  onDeleteScene,
}: {
  scene: SceneProps
  index: number
  scenes: SceneProps[]
  setScenes: React.Dispatch<React.SetStateAction<SceneProps[]>>
  onDeleteScene: (id: number) => void
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: scene.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
    zIndex: isSortableDragging ? 10 : 1,
  }

  // Functions to handle drag and drop for images
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const imageUrl = URL.createObjectURL(file)

      setScenes(scenes.map((s) => (s.id === scene.id ? { ...s, image: imageUrl } : s)))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)

      setScenes(scenes.map((s) => (s.id === scene.id ? { ...s, image: imageUrl } : s)))
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScenes(scenes.map((s) => (s.id === scene.id ? { ...s, title: e.target.value } : s)))
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScenes(scenes.map((s) => (s.id === scene.id ? { ...s, description: e.target.value } : s)))
  }

  const handleDialogueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScenes(scenes.map((s) => (s.id === scene.id ? { ...s, dialogue: e.target.value } : s)))
  }

  // Function to generate AI content (placeholder for future implementation)
  const generateAIContent = (type: "description" | "dialogue" | "image") => {
    // This would be replaced with actual AI generation in the future
    const loadingMessages = {
      description: "Generando descripción con IA...",
      dialogue: "Creando diálogos con IA...",
      image: "Generando imagen con IA...",
    }

    alert(`${loadingMessages[type]} (Funcionalidad a implementar)`)
  }

  return (
    <div ref={setNodeRef} style={style} className="relative" {...attributes}>
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
          isDragging
            ? "bg-purple-900/30 border-purple-500"
            : scene.image
              ? "bg-gray-800/80"
              : "bg-gradient-to-br from-gray-800/80 to-gray-900/80"
        }`}
        onClick={(e) => {
          // Only trigger file input if not clicking on the delete button
          if (!(e.target as HTMLElement).closest("button")) {
            triggerFileInput()
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

        {scene.image ? (
          <Image src={scene.image || ""} alt={scene.title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="h-10 w-10 mb-2" />
            <p className="text-sm">Arrastra una imagen o haz clic para subir</p>
          </div>
        )}

        {/* Drag handle */}
        <div
          {...listeners}
          className="absolute top-2 left-2 cursor-grab p-1 bg-gray-900/70 hover:bg-gray-900 rounded-md"
        >
          <GripVertical size={16} className="text-gray-400" />
        </div>

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
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
              onClick={() => generateAIContent("description")}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Generar
            </Button>
          </div>
          <AutoExpandingTextarea
            value={scene.description}
            onChange={handleDescriptionChange}
            placeholder="Describe lo que sucede en esta escena..."
            className="w-full min-h-[80px] rounded border border-gray-700 bg-gray-800/60 p-2 text-sm text-gray-300 focus:border-purple-500 focus:outline-none focus:ring-0"
            maxHeight="120px"
          />
        </div>

        {/* Dialogue */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-gray-400">Diálogo</label>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
              onClick={() => generateAIContent("dialogue")}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Generar
            </Button>
          </div>
          <AutoExpandingTextarea
            value={scene.dialogue}
            onChange={handleDialogueChange}
            placeholder="Añade diálogos para los personajes..."
            className="w-full min-h-[80px] rounded border border-gray-700 bg-gray-800/60 p-2 text-sm text-gray-300 focus:border-purple-500 focus:outline-none focus:ring-0"
            maxHeight="120px"
          />
        </div>
      </div>
    </div>
  )
}

interface StoryBuilderProps {
  initialScenes?: SceneProps[]
  projectId: string
  versionId: string
}

const StoryBuilder = ({ initialScenes, projectId, versionId }: StoryBuilderProps) => {
  // State for managing scenes
  const [scenes, setScenes] = useState<SceneProps[]>(
    initialScenes || [
      {
        id: 1,
        title: "Niño recibe regalo",
        description:
          "Un niño sonriente abre una caja de regalo colorida en su cumpleaños mientras sus padres observan con anticipación.",
        dialogue: 'Niño: "¡No puedo esperar para ver qué es!" Padres: "Esperamos que te guste, cariño."',
        image: "/placeholder.svg?height=200&width=200",
        color: "bg-purple-500",
      },
      {
        id: 2,
        title: "Robot emerge del regalo",
        description:
          "Un pequeño robot amigable con luces brillantes emerge de la caja de regalo, sorprendiendo a todos los presentes.",
        dialogue: 'Robot: "¡Hola! Soy tu nuevo amigo." Niño: "¡Wow! ¡Un robot!"',
        image: "/placeholder.svg?height=200&width=200",
        color: "bg-indigo-500",
      },
      {
        id: 3,
        title: "Niño sorprendido",
        description:
          "El niño mira con asombro al robot mientras éste despliega pequeñas alas y flota brevemente sobre la mesa.",
        dialogue: 'Niño: "¡Puede volar!" Robot: "¡Tengo muchas más sorpresas para ti!"',
        image: "/placeholder.svg?height=200&width=200",
        color: "bg-violet-500",
      },
    ],
  )

  const [activeScene, setActiveScene] = useState<number>(scenes.length > 0 ? scenes[0].id : 1)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; sceneId: number | null }>({
    isOpen: false,
    sceneId: null,
  })

  // Update scenes when initialScenes changes (e.g., when switching projects)
  useEffect(() => {
    if (initialScenes && initialScenes.length > 0) {
      setScenes(initialScenes)
      setActiveScene(initialScenes[0].id)
    } else if (initialScenes && initialScenes.length === 0) {
      // If there are no scenes, create a default one
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
  }, [initialScenes, projectId, versionId])

  // Set up sensors for drag and drop with lower activation constraint for better responsiveness
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reduced from 5px to 3px for quicker activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Add a mounted state to handle hydration issues
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Function to handle adding a new scene
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

    setScenes([...scenes, newScene])
    setActiveScene(newId)
  }

  // Function to open delete confirmation modal
  const openDeleteModal = (id: number) => {
    setConfirmModal({
      isOpen: true,
      sceneId: id,
    })
  }

  // Function to delete a scene
  const handleDeleteScene = (id: number) => {
    const filteredScenes = scenes.filter((scene) => scene.id !== id)
    setScenes(filteredScenes)

    // If the active scene was deleted, set the first scene as active
    if (activeScene === id && filteredScenes.length > 0) {
      setActiveScene(filteredScenes[0].id)
    }
  }

  // Function to handle drag start
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  // Function to handle drag end for reordering scenes
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) {
      return
    }

    setScenes((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      return arrayMove(items, oldIndex, newIndex)
    })
  }

  // Function to generate AI content (placeholder for future implementation)
  const generateAIContent = (type: "description" | "dialogue" | "image") => {
    // This would be replaced with actual AI generation in the future
    const loadingMessages = {
      description: "Generando descripción con IA...",
      dialogue: "Creando diálogos con IA...",
      image: "Generando imagen con IA...",
    }

    alert(`${loadingMessages[type]} (Funcionalidad a implementar)`)
  }

  // Find the active scene for drag overlay
  const activeScene2 = activeId ? scenes.find((scene) => scene.id === activeId) : null
  const activeIndex = activeScene2 ? scenes.findIndex((scene) => scene.id === activeScene2.id) : -1

  return (
    <div className="w-full h-full overflow-auto p-4 bg-app-bg">
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

      {/* Main content - Grid of scenes */}
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
                    setScenes={setScenes}
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
                    setScenes={setScenes}
                    onDeleteScene={openDeleteModal}
                  />
                </div>
              )}
            </DragOverlay>
          </SortableContext>
        </DndContext>
      )}


    </div>
  )
}

export default StoryBuilder

