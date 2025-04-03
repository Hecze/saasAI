import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import { RefreshCw, ChevronRight, ChevronLeft, X, Repeat, MessageSquare, FileText, Play, Pause } from 'lucide-react'
import { SceneProps } from "@/lib/storyboard-service"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface SpeedOption {
  id: string
  label: string
  duration: number // in milliseconds
}

const speedOptions: SpeedOption[] = [
  { id: "very-slow", label: "Muy lento", duration: 12000 },
  { id: "slow", label: "Lento", duration: 8000 },
  { id: "normal", label: "Normal", duration: 5000 },
  { id: "fast", label: "Rápido", duration: 3000 },
  { id: "very-fast", label: "Muy rápido", duration: 1500 },
]

interface PreviewModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  scenes: SceneProps[]
}

export function PreviewModal({ isOpen, onOpenChange, scenes }: PreviewModalProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [selectedSpeed, setSelectedSpeed] = useState<SpeedOption>(speedOptions[2]) // Default to normal
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [animationDirection, setAnimationDirection] = useState<'next' | 'prev'>('next')
  const [isLoopEnabled, setIsLoopEnabled] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate total scenes and current scene for display
  const totalScenes = scenes.length
  const currentScene = scenes[currentSceneIndex]
  
  // Reset to first scene when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSceneIndex(0)
      setIsAutoPlaying(true)
    } else {
      // Clear any running timers when modal closes
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isOpen])

  // Handle auto-play functionality
  useEffect(() => {
    if (!isOpen || !isAutoPlaying) return
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    
    // Set timer for next scene
    timerRef.current = setTimeout(() => {
      if (currentSceneIndex < totalScenes - 1) {
        goToNextScene()
      } else {
        // If we're at the end
        if (isLoopEnabled) {
          // Return to the first scene if loop is enabled
          restartPreview()
        } else {
          // Just stop playback
          setIsAutoPlaying(false)
        }
      }
    }, selectedSpeed.duration)
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isOpen, currentSceneIndex, isAutoPlaying, selectedSpeed, totalScenes, isLoopEnabled])

  // Navigation functions
  const goToNextScene = () => {
    if (currentSceneIndex < totalScenes - 1) {
      setAnimationDirection('next')
      setCurrentSceneIndex(prev => prev + 1)
    }
  }
  
  const goToPrevScene = () => {
    if (currentSceneIndex > 0) {
      setAnimationDirection('prev')
      setCurrentSceneIndex(prev => prev - 1)
    }
  }
  
  const restartPreview = () => {
    setAnimationDirection('prev')
    setCurrentSceneIndex(0)
    setIsAutoPlaying(true)
  }
  
  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }
  
  const changeSpeed = (speedOption: SpeedOption) => {
    setSelectedSpeed(speedOption)
  }
  
  const handleLoopToggle = () => {
    setIsLoopEnabled(!isLoopEnabled)
  }

  if (!scenes.length) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[85vh] max-h-[85vh] flex flex-col p-0 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden gap-0">
        <DialogHeader className="px-6 py-3.5 border-b border-purple-500/30 bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-between shadow-sm">
          <DialogTitle className="text-lg font-medium text-slate-100 opacity-90">
            Previsualización del storyboard
          </DialogTitle>
          <DialogClose className="absolute top-1 right-3 h-8 w-8 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white transition-colors border border-purple-500/30 shadow-glow-sm">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden relative">
          {/* Scene preview area */}
          <div className="absolute inset-0 flex items-center justify-center">
            {scenes.map((scene, index) => (
              <div
                key={scene.id}
                className={`
                  absolute w-full h-full transition-all duration-700 ease-in-out
                  ${index === currentSceneIndex ? 'opacity-100 z-10 translate-x-0 scale-100' : 'opacity-0 z-0'} 
                  ${index === currentSceneIndex - 1 && animationDirection === 'next' ? 'opacity-0 -translate-x-full scale-95' : ''}
                  ${index === currentSceneIndex + 1 && animationDirection === 'prev' ? 'opacity-0 translate-x-full scale-95' : ''}
                `}
              >
                <div className="h-full flex flex-col">
                  {/* Scene image with navigation arrows positioned at the center */}
                  <div className="relative h-[50%] bg-slate-950 flex items-center justify-center">
                    {scene.image ? (
                      <Image 
                        src={scene.image || "/placeholder.svg"} 
                        alt={scene.title} 
                        fill 
                        className="object-contain"
                      />
                    ) : (
                      <div className="text-slate-500">Sin imagen</div>
                    )}
                    
                    {/* Scene number indicator */}
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm border border-purple-500/30 shadow-glow-sm">
                      Escena {index + 1} de {totalScenes}
                    </div>
                  </div>
                  
                  {/* Scene information - reduced padding and spacing for better fit */}
                  <div className="p-4 bg-slate-900 flex-1 overflow-y-auto">
                    <h3 className="text-lg font-semibold text-white mb-3 pb-1 border-b border-purple-500/20">{scene.title}</h3>
                    
                    <div className="space-y-3 max-h-[calc(40vh-4rem)] overflow-y-auto pr-1">
                      {scene.description && (
                        <div className="p-2 bg-black/40 rounded-lg border-l-2 border-purple-500/30">
                          <div className="flex items-center mb-1">
                            <FileText className="h-4 w-4 text-purple-200 mr-2" />
                            <h4 className="text-sm font-medium text-white">Descripción</h4>
                          </div>
                          <p className="text-slate-200 text-sm leading-relaxed">{scene.description}</p>
                        </div>
                      )}
                      
                      {scene.dialogue && (
                        <div className="p-2 bg-black/40 rounded-lg border-l-2 border-indigo-500/30">
                          <div className="flex items-center mb-1">
                            <MessageSquare className="h-4 w-4 text-indigo-200 mr-2" />
                            <h4 className="text-sm font-medium text-white">Diálogo</h4>
                          </div>
                          <p className="text-slate-200 text-sm italic leading-relaxed">{scene.dialogue}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Navigation buttons positioned centered on the sides of the image */}
            <button
              onClick={goToPrevScene}
              disabled={currentSceneIndex === 0}
              className="absolute left-4 top-[22%] -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full z-20 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-purple-400/40 shadow-glow-sm"
              aria-label="Escena anterior"
            >
              <ChevronLeft size={28} />
            </button>
            
            <button
              onClick={goToNextScene}
              disabled={currentSceneIndex === totalScenes - 1}
              className="absolute right-4 top-[22%] -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full z-20 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-purple-400/40 shadow-glow-sm"
              aria-label="Siguiente escena"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
        
        {/* Controls bar - optimized for single row with consistent button heights */}
        <div className="p-3 border-t border-purple-500/30 bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={toggleAutoPlay}
              className={isAutoPlaying 
                ? "bg-slate-700 hover:bg-slate-600 text-white h-9 border border-purple-500/30 px-3" 
                : "bg-slate-800 hover:bg-slate-700 text-white h-9 border border-purple-500/30 px-3"
              }
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-1.5" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1.5" />
                  <span>Reproducir</span>
                </>
              )}
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={restartPreview}
              className="flex items-center bg-slate-800 hover:bg-slate-700 text-white h-9 border border-purple-500/30"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              <span>Reiniciar</span>
            </Button>
            
            {/* Loop toggle with height matching other buttons */}
            <div className="flex items-center bg-black/40 rounded-md px-3 h-9 border border-purple-500/30 shadow-glow-sm">
              <Switch
                id="loop-mode"
                checked={isLoopEnabled}
                onCheckedChange={handleLoopToggle}
                className="data-[state=checked]:bg-slate-600"
              />
              <Label htmlFor="loop-mode" className="flex items-center text-sm cursor-pointer ml-2 text-white">
                <Repeat className="h-4 w-4 mr-1.5" />
                <span>Bucle</span>
              </Label>
            </div>
          </div>
          
          {/* Speed selector with gradient buttons preserved */}
          <div className="flex items-center">
            <span className="text-white text-sm mr-2 font-medium">Velocidad:</span>
            <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-md border border-purple-500/30 shadow-glow-sm">
              {speedOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedSpeed.id === option.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => changeSpeed(option)}
                  className={`text-xs ${
                    selectedSpeed.id === option.id 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white' 
                      : 'text-white hover:bg-black/60'
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
