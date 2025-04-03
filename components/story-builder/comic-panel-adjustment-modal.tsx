import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SceneProps } from '@/lib/storyboard-service';
import { PanelBoundaryEditor } from './panel-boundary-editor';
import { ComicPanelExtractor } from './comic-panel-extractor';
import { Trash2, Plus, X } from "lucide-react";

export interface Panel {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ComicPanelAdjustmentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onConfirm: (scenes: SceneProps[]) => void;
}

export const ComicPanelAdjustmentModal: React.FC<ComicPanelAdjustmentModalProps> = ({
  isOpen,
  onOpenChange,
  imageUrl,
  onConfirm
}) => {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedPanelId, setSelectedPanelId] = useState<number | null>(null);
  const panelExtractor = useRef<ComicPanelExtractor | null>(null);
  
  // Initialize the panel extractor and detect panels when the image changes
  useEffect(() => {
    if (!imageUrl || !isOpen) return;
    
    const loadImage = async () => {
      setIsLoading(true);
      
      try {
        // Create image element to get dimensions
        const img = new Image();
        img.onload = async () => {
          setImageSize({ width: img.width, height: img.height });
          
          // Initialize panel extractor
          panelExtractor.current = new ComicPanelExtractor();
          
          // Detect panels
          const detectedPanels = await panelExtractor.current.detectPanelsOnly(imageUrl);
          
          // Map detected panels to have unique IDs
          const panelsWithIds = detectedPanels.map((panel, index) => ({
            ...panel,
            id: index + 1
          }));
          
          setPanels(panelsWithIds);
          if (panelsWithIds.length > 0) {
            setSelectedPanelId(panelsWithIds[0].id);
          }
          setIsLoading(false);
        };
        
        img.onerror = () => {
          console.error("Failed to load image");
          setIsLoading(false);
        };
        
        img.src = imageUrl;
      } catch (error) {
        console.error("Error initializing panel detection:", error);
        setIsLoading(false);
      }
    };
    
    loadImage();
  }, [imageUrl, isOpen]);
  
  // Reset state when the modal is closed or opened
  useEffect(() => {
    // When the modal opens, we initialize
    if (isOpen) {
      setIsLoading(true);
      // Other initialization happens in the image loading effect
    } else {
      // When modal closes, reset all state to clean up
      setPanels([]);
      setSelectedPanelId(null);
      panelExtractor.current = null;
      setIsLoading(true); // Reset loading state
      setIsExtracting(false); // Reset extracting state
    }
  }, [isOpen]);
  
  // Debug selected panel ID changes
  useEffect(() => {
    console.log("Selected panel ID changed to:", selectedPanelId);
  }, [selectedPanelId]);
  
  // Function to convert adjusted panels to scenes when user confirms
  const handleConfirm = async () => {
    if (!panelExtractor.current || panels.length === 0) return;
    
    setIsExtracting(true);
    
    try {
      // Use the panel extractor to create scenes from the adjusted panels
      const scenes = await panelExtractor.current.extractPanelsFromBoundaries(imageUrl, panels);
      onConfirm(scenes);
      onOpenChange(false);
    } catch (error) {
      console.error("Error extracting panels:", error);
    } finally {
      setIsExtracting(false);
    }
  };

  // Function to add a new panel
  const handleAddPanel = () => {
    // Add new empty panel in the center of the image
    const newPanel: Panel = {
      id: panels.length > 0 ? Math.max(...panels.map(p => p.id)) + 1 : 1,
      x: imageSize.width / 4,
      y: imageSize.height / 4,
      width: imageSize.width / 2,
      height: imageSize.height / 2
    };
    setPanels([...panels, newPanel]);
    setSelectedPanelId(newPanel.id);
  };
  
  // Function to delete selected panel
  const handleDeletePanel = () => {
    if (selectedPanelId === null) {
      console.warn("No panel selected for deletion");
      return;
    }
    
    console.log(`Deleting panel with ID: ${selectedPanelId}`);
    
    // Find the panel index before filtering
    const panelIndex = panels.findIndex(p => p.id === selectedPanelId);
    if (panelIndex === -1) {
      console.warn(`Panel with ID ${selectedPanelId} not found`);
      return;
    }
    
    // Copy the panels array and remove the selected panel
    const updatedPanels = panels.filter(p => p.id !== selectedPanelId);
    
    // Select a new panel if available
    let newSelectedId: number | null = null;
    if (updatedPanels.length > 0) {
      // Try to select the next panel, or the previous one if we deleted the last panel
      const nextIndex = Math.min(panelIndex, updatedPanels.length - 1);
      newSelectedId = updatedPanels[nextIndex].id;
    }
    
    // Update state
    setPanels(updatedPanels);
    setSelectedPanelId(newSelectedId);
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Properly clean up when closing
        onOpenChange(open);
      }}
    >
      <DialogContent 
        className="sm:max-w-4xl max-h-[90vh] flex flex-col bg-slate-100"
        onPointerDownOutside={(e) => e.preventDefault()} // Prevent closing on outside click
      >
        <DialogHeader className="relative">
        <DialogTitle className="text-lg font-medium text-slate-800 opacity-90">
            Previsualización del storyboard
          </DialogTitle>
          <DialogClose className="absolute top-[-.6rem] right-0 h-8 w-8 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white transition-colors border border-purple-500/30 shadow-glow-sm">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-400">Cargando y detectando paneles...</p>
            </div>
          ) : (
            <div className="relative">
              <PanelBoundaryEditor
                imageUrl={imageUrl}
                panels={panels}
                imageWidth={imageSize.width}
                imageHeight={imageSize.height}
                selectedPanelId={selectedPanelId}
                onSelectPanel={setSelectedPanelId}
                onPanelChange={setPanels}
              />
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-400 my-2">
          <ul className="list-disc pl-5 space-y-1">
            <li>Ajusta los paneles: Arrastra los puntos o bordes para cambiar el tamaño</li>
            <li>Mueve los paneles: Arrastra el punto central para mover todo el panel</li>
            <li>Selecciona un panel: Haz clic en cualquier parte del panel para seleccionarlo</li>
            <li>El panel seleccionado se muestra con un fondo de color semitransparente</li>
          </ul>
        </div>
        
        <DialogFooter className="gap-2">
          <div className="mr-auto flex gap-2">
            <Button 
              variant="outline"
              onClick={handleAddPanel}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Añadir panel
            </Button>
            
            <Button 
              variant="destructive"
              onClick={handleDeletePanel}
              disabled={selectedPanelId === null}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Eliminar panel {selectedPanelId !== null ? selectedPanelId : ""}
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          
          <Button 
            onClick={handleConfirm}
            disabled={isExtracting || panels.length === 0}
          >
            {isExtracting ? "Procesando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
