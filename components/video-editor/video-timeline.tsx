"use client"

import { Button } from "@/components/ui/button"
import { ZoomIn, Wand2 } from "lucide-react"

/**
 * VideoTimeline Component
 *
 * Displays the timeline interface for the video editor with
 * video and audio tracks.
 */
export default function VideoTimeline() {
  return (
    <div>
      {/* Timeline Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-purple-400">Línea de Tiempo</h3>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-7 px-2 text-xs bg-gray-800 border-gray-700">
            <ZoomIn className="h-3.5 w-3.5 mr-1" /> Zoom
          </Button>
          <Button size="sm" variant="outline" className="h-7 px-2 text-xs bg-gray-800 border-gray-700">
            <Wand2 className="h-3.5 w-3.5 mr-1" /> Auto-ajustar
          </Button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="rounded-lg bg-gray-900/80 p-4 border border-gray-800">
        {/* Time Markers */}
        <div className="flex justify-between text-xs text-gray-500 mb-1 px-2">
          <span>00:00</span>
          <span>00:05</span>
          <span>00:10</span>
          <span>00:15</span>
        </div>

        {/* Timeline Tracks */}
        <div className="space-y-3">
          {/* Video Track */}
          <div className="flex items-center gap-3">
            <div className="w-20 text-xs text-gray-400">Video</div>
            <div className="flex-1 h-10 bg-gray-800 rounded-md relative">
              {/* Video Segments */}
              <div className="absolute inset-y-0 left-0 w-1/3 bg-purple-600/80 md:bg-gradient-to-r from-purple-600/80 to-indigo-600/80 rounded-md"></div>
              <div className="absolute inset-y-0 left-[66%] w-1/3 bg-purple-600/80 md:bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 rounded-md"></div>


            </div>
          </div>
          {/* Video Track */}
          <div className="flex items-center gap-3">
            <div className="w-20 text-xs text-gray-400">Video</div>
            <div className="flex-1 h-10 bg-gray-800 rounded-md relative">
              {/* Video Segments */}
              <div className="absolute inset-y-0 left-[33%] w-1/3 bg-purple-600/80 md:bg-gradient-to-r from-indigo-600/80 to-violet-600/80 rounded-md"></div>


            </div>
          </div>
          {/* Audio Track */}
          <div className="flex items-center gap-3">
            <div className="w-20 text-xs text-gray-400">Audio</div>
            <div className="flex-1 h-8 bg-gray-800 rounded-md relative">
              {/* Audio Waveform */}
              <div className="absolute inset-y-0 left-[10%] right-[10%] bg-blue-500/60 rounded-md flex items-center px-2">
                <div className="w-full h-3 bg-blue-900/60 rounded-sm overflow-hidden">
                  {/* Audio Waveform Simulation */}
                  <div className="w-full h-full flex items-center justify-around">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-0.5 bg-blue-400"
                        style={{
                          height: `${Math.sin(i * 0.5) * 50 + 50}%`,
                          opacity:"0.70637",
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

