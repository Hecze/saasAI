"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Play,
  Download,
  Share2,
  Upload,
  Plus,
  X,
  Copy,
  Minus,

  GripVertical
} from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SceneProps {
  id: number
  title: string
  description: string
  dialogue: string
  image: string | null
  color: string
}

// Create an auto-resizing textarea component
interface AutoExpandingTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  maxHeight?: string;
}

const AutoExpandingTextarea = ({ value, onChange, placeholder, className, maxHeight = "240px" }: AutoExpandingTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      
      // Set the height to scrollHeight to expand the textarea
      const newHeight = Math.min(
        textareaRef.current.scrollHeight,
        parseInt(maxHeight)
      );
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value, maxHeight]);
  
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      style={{ 
        resize: 'none',
        overflowY: textareaRef.current && textareaRef.current.scrollHeight > parseInt(maxHeight) ? 'auto' : 'hidden'
      }}
    />
  );
};

// Sortable Scene Item Component
const SortableSceneItem = ({ 
  scene, 
  index, 
  activeScene, 
  setActiveScene, 
  scenes, 
  handleDeleteScene 
}: { 
  scene: SceneProps; 
  index: number; 
  activeScene: number; 
  setActiveScene: (id: number) => void; 
  scenes: SceneProps[]; 
  handleDeleteScene: (id: number) => void; 
}) => {
  // Fix for hydration error - use useEffect to ensure client-side only rendering of drag attributes
  const [mounted, setMounted] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: scene.id });

  useEffect(() => {
    setMounted(true);
  }, []);

  const style = mounted ? {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  } : {};

  const getSceneDisplayName = (index: number, title: string) => {
    return `Escena ${index + 1}: ${title}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded border ${activeScene === scene.id ? 'border-purple-500' : 'border-gray-700'} bg-gray-800/80 p-3 relative cursor-pointer hover:border-gray-600 transition-colors mb-3`}
      onClick={() => setActiveScene(scene.id)}
      {...(mounted ? attributes : {})}
    >
      <div className="flex items-center gap-2">
        {mounted && (
          <div {...listeners} className="cursor-grab p-1 hover:bg-gray-700 rounded">
            <GripVertical size={14} className="text-gray-500" />
          </div>
        )}
        <div className={`h-3 w-3 rounded-full ${scene.color}`}></div>
        <span className="w-full text-sm text-gray-300 truncate">
          {getSceneDisplayName(index, scene.title)}
        </span>
        {scenes.length > 1 && (
          <button 
            className="text-gray-500 hover:text-gray-300" 
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteScene(scene.id);
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

const StoryBuilder = () => {
  // State for managing scenes
  const [scenes, setScenes] = useState<SceneProps[]>([
    {
      id: 1,
      title: "Niño recibe regalo",
      description: "Un niño sonriente abre una caja de regalo colorida en su cumpleaños mientras sus padres observan con anticipación.",
      dialogue: 'Niño: "¡No puedo esperar para ver qué es!" Padres: "Esperamos que te guste, cariño."',
      image: "/images/storyboardIA_1.png",
      color: "bg-purple-500"
    },
    {
      id: 2,
      title: "Robot emerge del regalo",
      description: "Un pequeño robot amigable con luces brillantes emerge de la caja de regalo, sorprendiendo a todos los presentes.",
      dialogue: 'Robot: "¡Hola! Soy tu nuevo amigo." Niño: "¡Wow! ¡Un robot!"',
      image: "/images/storyboardIA_2.png",
      color: "bg-indigo-500"
    },
    {
      id: 3,
      title: "Niño sorprendido",
      description: "El niño mira con asombro al robot mientras éste despliega pequeñas alas y flota brevemente sobre la mesa.",
      dialogue: 'Niño: "¡Puede volar!" Robot: "¡Tengo muchas más sorpresas para ti!"',
      image: "/images/storyboardIA_3.png",
      color: "bg-violet-500"
    },
  ])
  
  const [activeScene, setActiveScene] = useState<number>(1)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  
  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px of movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Add a mounted state to handle hydration issues
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Function to handle adding a new scene
  const handleAddScene = () => {
    const newId = scenes.length > 0 ? Math.max(...scenes.map(scene => scene.id)) + 1 : 1
    const colors = ["bg-purple-500", "bg-indigo-500", "bg-violet-500", "bg-blue-500", "bg-teal-500"]
    const colorIndex = newId % colors.length
    
    const newScene: SceneProps = {
      id: newId,
      title: `Nueva escena`,
      description: "",
      dialogue: "",
      image: null,
      color: colors[colorIndex]
    }
    
    setScenes([...scenes, newScene])
    setActiveScene(newId)
  }
  
  // Function to handle scene description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedScenes = scenes.map(scene => 
      scene.id === activeScene ? { ...scene, description: e.target.value } : scene
    )
    setScenes(updatedScenes)
  }
  
  // Function to handle scene dialogue change
  const handleDialogueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedScenes = scenes.map(scene => 
      scene.id === activeScene ? { ...scene, dialogue: e.target.value } : scene
    )
    setScenes(updatedScenes)
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
      
      const updatedScenes = scenes.map(scene => 
        scene.id === activeScene ? { ...scene, image: imageUrl } : scene
      )
      setScenes(updatedScenes)
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)
      
      const updatedScenes = scenes.map(scene => 
        scene.id === activeScene ? { ...scene, image: imageUrl } : scene
      )
      setScenes(updatedScenes)
    }
  }
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  // Function to get the active scene
  const getActiveScene = () => {
    return scenes.find(scene => scene.id === activeScene) || scenes[0]
  }
  
  // Function to handle scene title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedScenes = scenes.map(scene => 
      scene.id === activeScene ? { ...scene, title: e.target.value } : scene
    )
    setScenes(updatedScenes)
  }
  
  // Function to delete a scene
  const handleDeleteScene = (id: number) => {
    const filteredScenes = scenes.filter(scene => scene.id !== id)
    setScenes(filteredScenes)
    
    // If the active scene was deleted, set the first scene as active
    if (activeScene === id && filteredScenes.length > 0) {
      setActiveScene(filteredScenes[0].id)
    }
  }
  
  // Function to handle drag end for reordering scenes
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }
    
    setScenes((items) => {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      return arrayMove(items, oldIndex, newIndex);
    });
  }
  
  
  return (
    <div className="overflow-hidden rounded-xl bg-gray-800 md:bg-gradient-to-br from-gray-900 to-gray-800 p-2 md:p-6 border border-purple-500/20 shadow-[0_0_25px_rgba(139,92,246,0.15)]">
      {/* Top level controls */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3 px-1">
        <div>
          <h3 className="font-bold text-lg text-white">StoryBuilder AI</h3>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 bg-gray-800 border-gray-700 hover:bg-gray-700"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 bg-gray-800 border-gray-700 hover:bg-gray-700"
          >
            <Copy className="h-4 w-4" /> 
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 bg-gray-800 border-gray-700 hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        {/* Scene list panel */}
        <div className="rounded-lg bg-gray-900/80 mx-auto p-3 sm:p-4 text-white border border-purple-500/10 backdrop-blur-sm">
          <h3 className="mb-4 font-semibold text-purple-400">Escenas</h3>
          
          {mounted && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={scenes.map(scene => scene.id)}
                strategy={verticalListSortingStrategy}
              >
                {scenes.map((scene, index) => (
                  <SortableSceneItem 
                    key={scene.id}
                    scene={scene}
                    index={index}
                    activeScene={activeScene}
                    setActiveScene={setActiveScene}
                    scenes={scenes}
                    handleDeleteScene={handleDeleteScene}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          
          <Button
            variant="outline"
            className="w-full mt-4 bg-purple-600 md:bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 border-0"
            onClick={handleAddScene}
          >
            <Plus className="mr-2 h-4 w-4" />
            Añadir Escena
          </Button>
        </div>

        {/* Scene editor panel */}
        <div className="md:col-span-2 rounded-lg bg-gray-900/80 p-4 text-white border border-purple-500/10 backdrop-blur-sm">
          {scenes.length > 0 ? (
            <>
              {/* Title editor - now only for the custom title part */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-400 mb-1">Título</h4>
                <input
                  className="w-full rounded border border-gray-700 bg-gray-800/60 p-2 text-sm text-gray-300 focus:border-purple-500 focus:outline-none focus:ring-0"
                  value={getActiveScene()?.title || ""}
                  onChange={handleTitleChange}
                  placeholder="Título de la escena..."
                />
              </div>
              
              {/* Image area with drag and drop */}
              <div 
                className={`relative h-[200px] w-full overflow-hidden rounded ${
                  isDragging ? 'bg-gray-700/80 border-purple-500' : 'bg-gray-800/80 border-gray-700/50'
                } border mb-4 transition-colors cursor-pointer`}
                onClick={triggerFileInput}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
                
                {getActiveScene()?.image ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={getActiveScene()?.image || ""}
                      alt={getActiveScene()?.title || ""}
                      width={200}
                      height={200}
                      className="h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <Upload className="h-10 w-10 mb-2" />
                    <p className="text-sm">Arrastra una imagen o haz clic para subir</p>
                  </div>
                )}
              </div>

              {/* Editable description and dialogue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Descripción</h4>
                  <AutoExpandingTextarea
                    value={getActiveScene()?.description || ""}
                    onChange={handleDescriptionChange}
                    placeholder="Describe lo que sucede en esta escena..."
                    className="w-full min-h-[100px] sm:min-h-[80px] rounded border border-gray-700 bg-gray-800/60 p-2 text-sm text-gray-300 focus:border-purple-500 focus:outline-none focus:ring-0"
                    maxHeight="240px"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Diálogo</h4>
                  <AutoExpandingTextarea
                    value={getActiveScene()?.dialogue || ""}
                    onChange={handleDialogueChange}
                    placeholder="Añade diálogos para los personajes..."
                    className="w-full min-h-[100px] sm:min-h-[80px] rounded border border-gray-700 bg-gray-800/60 p-2 text-sm text-gray-300 focus:border-purple-500 focus:outline-none focus:ring-0"
                    maxHeight="240px"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">No hay escenas. Añade una para comenzar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StoryBuilder
