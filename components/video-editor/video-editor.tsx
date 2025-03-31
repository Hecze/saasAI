"use client"

import Image from "next/image"
import { useState } from "react"
import { Download, SkipBack, SkipForward, Plus, Play, Sparkle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import VideoEditorSidebar from "./video-editor-sidebar"
import VideoTimeline from "./video-timeline"

/**
 * VideoEditor Component
 *
 * A comprehensive video editor interface with AI-powered tools,
 * timeline controls, and export options.
 */
export default function VideoEditor() {
  // State for scene duration slider
  const [duration, setDuration] = useState("3")

  return (
    <div className="overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-purple-500/20 shadow-[0_0_25px_rgba(139,92,246,0.15)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left sidebar - Tools */}
        <div className="lg:col-span-3 flex flex-col h-full gap-4">
          {/* AI Tools Section */}
          <div className="flex-1">
            <VideoEditorSidebar />
          </div>

          {/* Clip Library Section - Only visible on larger screens */}
          <div className="rounded-lg bg-gray-900/80 p-4 border border-gray-800 hidden lg:flex flex-col h-[300px]">
            <h3 className="text-sm font-medium text-purple-400 mb-3">Fotogramas</h3>
            <div className="grid grid-cols-2 gap-2 overflow-y-auto">
              <div className="aspect-video bg-gray-800 rounded-md overflow-hidden">
                <Image
                  src="/images/storyboardIA_1.png"
                  alt="Clip 1"
                  width={100}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-video bg-gray-800 rounded-md overflow-hidden">
                <Image
                  src="/images/storyboardIA_2.png"
                  alt="Clip 2"
                  width={100}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-video bg-gray-800 rounded-md overflow-hidden">
                <Image
                  src="/images/storyboardIA_3.png"
                  alt="Clip 3"
                  width={100}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-video bg-gray-800 rounded-md overflow-hidden flex items-center justify-center">
                <Plus className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main content - Video preview and timeline */}
        <div className="lg:col-span-6 flex flex-col h-full gap-4">
          {/* Video Preview Area */}
          <div className="rounded-lg bg-black/60 aspect-video relative overflow-hidden w-full max-w-2xl mx-auto">
            <Image
              src="/images/storyboardIA_3.png"
              alt="Video preview"
              width={640}
              height={360}
              className="w-full h-full object-contain"
            />
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 rounded-full px-3 py-1.5 backdrop-blur-sm">
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-white hover:bg-white/10">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-10 w-10 rounded-full bg-white text-black hover:bg-white/90">
                <Play className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-white hover:bg-white/10">
                <SkipForward className="h-4 w-4" />
              </Button>
              <div className="mx-2 text-xs text-white">00:10 / 00:15</div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="flex-1 h-[300px] flex flex-col justify-end">
            <VideoTimeline />
          </div>
        </div>

        {/* Right sidebar - Settings and Export */}
        <div className="lg:col-span-3 flex flex-col h-full gap-4">
          {/* Scene Settings Panel */}
          <div className="rounded-lg bg-gray-900/80 p-4 border border-gray-800 flex-1">
            <h3 className="text-sm font-medium text-purple-400 mb-3">Ajustes de Escena</h3>
            <div className="space-y-3">
              {/* Duration Slider */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Duración</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="range"
                    min="1"
                    max="10"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-xs text-white">{duration}s</span>
                </div>
              </div>

              {/* Transition Dropdown */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Transición</label>
                <select className="w-full h-8 rounded-md bg-gray-800 border border-gray-700 text-sm text-white px-2">
                  <option>Fundido</option>
                  <option>Corte</option>
                  <option>Disolución</option>
                </select>
              </div>

              {/* Style Dropdown */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Estilo</label>
                <select className="w-full h-8 rounded-md bg-gray-800 border border-gray-700 text-sm text-white px-2">
                  <option>Animado</option>
                  <option>Realista</option>
                  <option>Estilizado</option>
                </select>
              </div>
            </div>
          </div>

            {/* Generar Video Panel */}
            <div className="rounded-lg bg-gray-900/80 p-4 border border-gray-800 h-[250px]">
            <h3 className="text-sm font-medium text-purple-400 mb-3">Generar</h3>
            <div className="space-y-3">
              {/* Format Dropdown */}
              <div>
              <label className="text-xs text-gray-400 block mb-1">Formato</label>
              <select className="w-full h-8 rounded-md bg-gray-800 border border-gray-700 text-sm text-white px-2">
                <option>MP4</option>
                <option>MOV</option>
                <option>WebM</option>
              </select>
              </div>

              {/* Resolution Dropdown */}
              <div>
              <label className="text-xs text-gray-400 block mb-1">Resolución</label>
              <select className="w-full h-8 rounded-md bg-gray-800 border border-gray-700 text-sm text-white px-2">
                <option>1080p</option>
                <option>720p</option>
                <option>4K</option>
              </select>
              </div>
              
              {/* Spacer */}
              <div className="" />

              {/* Export Button */}
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0">
              <Sparkle className="h-4 w-4 " />
              Generar Video
              </Button>
            </div>
            </div>
        </div>
      </div>
    </div>
  )
}

