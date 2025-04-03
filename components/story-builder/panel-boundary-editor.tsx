import React, { useState, useRef, useEffect } from 'react';
import { Panel } from './comic-panel-adjustment-modal';

// Define panel colors for better differentiation
const PANEL_COLORS = [
  "#ff0000", // Red
  "#00ff00", // Green
  "#0000ff", // Blue
  "#ff00ff", // Magenta
  "#ffff00", // Yellow
  "#00ffff", // Cyan
  "#ff8000", // Orange
  "#8000ff", // Purple
];

interface PanelBoundaryEditorProps {
  imageUrl: string;
  panels: Panel[];
  imageWidth: number;
  imageHeight: number;
  onPanelChange: (panels: Panel[]) => void;
  selectedPanelId?: number | null;
  onSelectPanel?: (id: number | null) => void;
}

export const PanelBoundaryEditor: React.FC<PanelBoundaryEditorProps> = ({
  imageUrl,
  panels,
  imageWidth,
  imageHeight,
  onPanelChange,
  selectedPanelId,
  onSelectPanel
}) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [internalSelectedPanelId, setInternalSelectedPanelId] = useState<number | null>(null);
  const [draggingPoint, setDraggingPoint] = useState<{ panelId: number, point: string, initialX: number, initialY: number, panelInitialState: Panel } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageReady, setImageReady] = useState(false);
  
  // Use either external or internal selection state
  const actualSelectedPanelId = selectedPanelId !== undefined ? selectedPanelId : internalSelectedPanelId;
  const setActualSelectedPanelId = (id: number | null) => {
    if (onSelectPanel) {
      onSelectPanel(id);
    } else {
      setInternalSelectedPanelId(id);
    }
  };

  // Handle image load to get exact dimensions
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setImageReady(true);
    updateContainerSize();
  };

  // Calculate container size and scaling factor
  const updateContainerSize = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      
      // Get the container's client width
      const containerWidth = container.clientWidth;
      
      // Calculate the scale
      let newScale = containerWidth / imageWidth;
      
      // Limit scale to avoid excessive enlargement 
      if (newScale > 1) {
        newScale = 1;
      }

      const scaledWidth = imageWidth * newScale;
      const scaledHeight = imageHeight * newScale;
      
      console.log(`Container width: ${containerWidth}, Image size: ${imageWidth}x${imageHeight}, Scale: ${newScale}, Scaled size: ${scaledWidth}x${scaledHeight}`);
      
      setScale(newScale);
      setContainerSize({
        width: scaledWidth,
        height: scaledHeight
      });
    }
  };

  // Update size on mount and resize
  useEffect(() => {
    updateContainerSize();
    
    const handleResize = () => {
      updateContainerSize();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imageWidth, imageHeight, imageReady]);

  // Prevent text selection and other default behaviors
  const preventSelection = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Handle mouse down on a control point
  const handlePointMouseDown = (e: React.MouseEvent, panelId: number, point: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const panel = panels.find(p => p.id === panelId);
    if (!panel) return;

    setDraggingPoint({
      panelId,
      point,
      initialX: e.clientX,
      initialY: e.clientY,
      panelInitialState: { ...panel }
    });
    
    setActualSelectedPanelId(panelId);
  };

  // Handle panel selection
  const handlePanelSelect = (e: React.MouseEvent, panelId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActualSelectedPanelId(panelId);
  };

  // Handle mouse move for dragging control points
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingPoint || !containerRef.current || !imageReady) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate the movement delta from initial click position in screen pixels
    const deltaX = (e.clientX - draggingPoint.initialX) / scale;
    const deltaY = (e.clientY - draggingPoint.initialY) / scale;
    
    // Find the panel being manipulated
    const panelIndex = panels.findIndex(p => p.id === draggingPoint.panelId);
    if (panelIndex === -1) return;
    
    const initialPanel = draggingPoint.panelInitialState;
    const updatedPanels = [...panels];
    
    // Make a copy of the panel to avoid directly modifying state
    const panelCopy = { ...initialPanel };
    
    // Update the panel based on which point is being dragged
    switch (draggingPoint.point) {
      // Corner points
      case 'topLeft':
        panelCopy.x = initialPanel.x + deltaX;
        panelCopy.y = initialPanel.y + deltaY;
        panelCopy.width = initialPanel.width - deltaX;
        panelCopy.height = initialPanel.height - deltaY;
        break;
        
      case 'topRight':
        panelCopy.y = initialPanel.y + deltaY;
        panelCopy.width = initialPanel.width + deltaX;
        panelCopy.height = initialPanel.height - deltaY;
        break;
        
      case 'bottomLeft':
        panelCopy.x = initialPanel.x + deltaX;
        panelCopy.width = initialPanel.width - deltaX;
        panelCopy.height = initialPanel.height + deltaY;
        break;
        
      case 'bottomRight':
        panelCopy.width = initialPanel.width + deltaX;
        panelCopy.height = initialPanel.height + deltaY;
        break;
        
      // Edges
      case 'top':
        panelCopy.y = initialPanel.y + deltaY;
        panelCopy.height = initialPanel.height - deltaY;
        break;
        
      case 'right':
        panelCopy.width = initialPanel.width + deltaX;
        break;
        
      case 'bottom':
        panelCopy.height = initialPanel.height + deltaY;
        break;
        
      case 'left':
        panelCopy.x = initialPanel.x + deltaX;
        panelCopy.width = initialPanel.width - deltaX;
        break;
        
      // Center drag to move the entire panel
      case 'center':
        panelCopy.x = initialPanel.x + deltaX;
        panelCopy.y = initialPanel.y + deltaY;
        break;
    }
    
    // Ensure minimum dimensions
    if (panelCopy.width < 10) panelCopy.width = 10;
    if (panelCopy.height < 10) panelCopy.height = 10;
    
    // Ensure the panel stays within image boundaries
    panelCopy.x = Math.max(0, Math.min(imageWidth - panelCopy.width, panelCopy.x));
    panelCopy.y = Math.max(0, Math.min(imageHeight - panelCopy.height, panelCopy.y));
    
    // Update the panel in our copy of the panels array
    updatedPanels[panelIndex] = panelCopy;
    
    // Update parent component
    onPanelChange(updatedPanels);
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setDraggingPoint(null);
  };

  // Get panel color based on id
  const getPanelColor = (panelId: number) => {
    return PANEL_COLORS[(panelId - 1) % PANEL_COLORS.length];
  };

  // Calculate control point size that stays consistent regardless of zoom
  const getControlPointRadius = () => {
    return 5 / scale; // Base size divided by scale
  };

  // Calculate stroke width that stays consistent regardless of zoom
  const getStrokeWidth = () => {
    return 2 / scale; // Base width divided by scale
  };

  return (
    <div 
      ref={containerRef} 
      className="relative overflow-hidden border border-gray-700 rounded-md"
      style={{ 
        maxWidth: '100%', 
        userSelect: 'none',
        width: containerSize.width > 0 ? containerSize.width : '100%',
        height: containerSize.height > 0 ? containerSize.height : 'auto'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseDown={preventSelection}
    >
      {/* Comic image */}
      <img
        src={imageUrl}
        alt="Comic page"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none' // Prevent image selection
        }}
        draggable={false}
        onLoad={handleImageLoad}
      />
      
      {/* SVG overlay for panel boundaries */}
      {imageReady && (
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${imageWidth} ${imageHeight}`}
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none'
          }}
        >
          {panels.map((panel) => {
            const panelColor = getPanelColor(panel.id);
            const isSelected = actualSelectedPanelId === panel.id;
            const pointRadius = getControlPointRadius();
            const strokeWidth = getStrokeWidth();
            
            return (
            <g key={panel.id}>
              {/* Panel background highlight when selected */}
              {isSelected && (
                <rect
                  x={panel.x}
                  y={panel.y}
                  width={panel.width}
                  height={panel.height}
                  fill={panelColor}
                  fillOpacity="0.2"
                  style={{ pointerEvents: 'none' }}
                />
              )}
              
              {/* Panel rectangle */}
              <rect
                x={panel.x}
                y={panel.y}
                width={panel.width}
                height={panel.height}
                stroke={panelColor}
                strokeWidth={strokeWidth}
                fill="none"
                onClick={(e) => handlePanelSelect(e, panel.id)}
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              />
              
              {/* Edge control lines with visible hitbox */}
              {/* Top edge */}
              <line
                x1={panel.x + 5}
                y1={panel.y}
                x2={panel.x + panel.width - 5}
                y2={panel.y}
                stroke={panelColor}
                strokeWidth={strokeWidth * 8}
                strokeOpacity={isSelected ? "0.3" : "0"}
                onMouseDown={(e) => handlePointMouseDown(e, panel.id, 'top')}
                style={{ pointerEvents: 'auto', cursor: 'ns-resize' }}
              />
              
              {/* Right edge */}
              <line
                x1={panel.x + panel.width}
                y1={panel.y + 5}
                x2={panel.x + panel.width}
                y2={panel.y + panel.height - 5}
                stroke={panelColor}
                strokeWidth={strokeWidth * 8}
                strokeOpacity={isSelected ? "0.3" : "0"}
                onMouseDown={(e) => handlePointMouseDown(e, panel.id, 'right')}
                style={{ pointerEvents: 'auto', cursor: 'ew-resize' }}
              />
              
              {/* Bottom edge */}
              <line
                x1={panel.x + 5}
                y1={panel.y + panel.height}
                x2={panel.x + panel.width - 5}
                y2={panel.y + panel.height}
                stroke={panelColor}
                strokeWidth={strokeWidth * 8}
                strokeOpacity={isSelected ? "0.3" : "0"}
                onMouseDown={(e) => handlePointMouseDown(e, panel.id, 'bottom')}
                style={{ pointerEvents: 'auto', cursor: 'ns-resize' }}
              />
              
              {/* Left edge */}
              <line
                x1={panel.x}
                y1={panel.y + 5}
                x2={panel.x}
                y2={panel.y + panel.height - 5}
                stroke={panelColor}
                strokeWidth={strokeWidth * 8}
                strokeOpacity={isSelected ? "0.3" : "0"}
                onMouseDown={(e) => handlePointMouseDown(e, panel.id, 'left')}
                style={{ pointerEvents: 'auto', cursor: 'ew-resize' }}
              />
              
              {/* Corner control points */}
              <circle
                cx={panel.x}
                cy={panel.y}
                r={pointRadius}
                fill={panelColor}
                onMouseDown={(e) => handlePointMouseDown(e, panel.id, 'topLeft')}
                style={{ pointerEvents: 'auto', cursor: 'nwse-resize' }}
              />
              <circle
                cx={panel.x + panel.width}
                cy={panel.y}
                r={pointRadius}
                fill={panelColor}
                onMouseDown={(e) => handlePointMouseDown(e, panel.id, 'topRight')}
                style={{ pointerEvents: 'auto', cursor: 'nesw-resize' }}
              />
              <circle
                cx={panel.x}
                cy={panel.y + panel.height}
                r={pointRadius}
                fill={panelColor}
                onMouseDown={(e) => handlePointMouseDown(e, panel.id, 'bottomLeft')}
                style={{ pointerEvents: 'auto', cursor: 'nesw-resize' }}
              />
              <circle
                cx={panel.x + panel.width}
                cy={panel.y + panel.height}
                r={pointRadius}
                fill={panelColor}
                onMouseDown={(e) => handlePointMouseDown(e, panel.id, 'bottomRight')}
                style={{ pointerEvents: 'auto', cursor: 'nwse-resize' }}
              />
              
              {/* Center control point for moving entire panel */}
              <circle
                cx={panel.x + panel.width / 2}
                cy={panel.y + panel.height / 2}
                r={pointRadius}
                fill={panelColor}
                onMouseDown={(e) => handlePointMouseDown(e, panel.id, 'center')}
                style={{ pointerEvents: 'auto', cursor: 'move' }}
              />
              
              {/* Panel number */}
              <text
                x={panel.x + 10 / scale}
                y={panel.y + 20 / scale}
                fill="white"
                stroke="black"
                strokeWidth={0.5 / scale}
                fontSize={14 / scale}
                fontWeight="bold"
              >
                {panel.id}
              </text>
            </g>
          )})}
        </svg>
      )}
    </div>
  );
};
