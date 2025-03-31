"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Mic, Music, Wand2 } from "lucide-react"

/**
 * VideoEditorSidebar Component
 *
 * Displays AI tools and options for the video editor.
 */
export default function VideoEditorSidebar() {
  return (
    <div className="rounded-lg bg-gray-900/80 p-4 border border-gray-800">
      <h3 className="text-sm font-medium text-purple-400 mb-3">Herramientas de IA</h3>
      <div className="space-y-2">
        {/* Enhance Quality Tool */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-left bg-gray-800 border-gray-700 hover:bg-gray-700"
        >
          <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
          <span>Mejorar calidad</span>
        </Button>

        {/* Generate Dialogues Tool */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-left bg-gray-800 border-gray-700 hover:bg-gray-700"
        >
          <Mic className="h-4 w-4 mr-2 text-purple-400" />
          <span>Generar diálogos</span>
        </Button>

        {/* Add Music Tool */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-left bg-gray-800 border-gray-700 hover:bg-gray-700"
        >
          <Music className="h-4 w-4 mr-2 text-purple-400" />
          <span>Añadir música</span>
        </Button>

        {/* Auto Effects Tool */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-left bg-gray-800 border-gray-700 hover:bg-gray-700"
        >
          <Wand2 className="h-4 w-4 mr-2 text-purple-400" />
          <span>Efectos automáticos</span>
        </Button>
      </div>
    </div>
  )
}

