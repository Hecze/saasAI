import { SceneProps } from '@/lib/storyboard-service';
import { Panel } from './comic-panel-adjustment-modal';

export class ComicPanelExtractor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private image: HTMLImageElement;
  private panels: Panel[] = [];

  constructor() {
    // Create canvas for image processing
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    this.ctx = ctx;
    this.image = new Image();
  }

  /**
   * Process an image and extract comic panels
   * @param imageUrl URL of the image to process
   * @returns Promise that resolves to an array of SceneProps
   */
  public async extractPanels(imageUrl: string): Promise<SceneProps[]> {
    return new Promise((resolve, reject) => {
      this.image.onload = async () => {
        try {
          // Setup canvas with image dimensions
          this.canvas.width = this.image.width;
          this.canvas.height = this.image.height;
          this.ctx.drawImage(this.image, 0, 0);

          // Detect panels
          await this.detectPanels();
          
          // If no panels detected, use the whole image as one panel
          if (this.panels.length === 0) {
            this.panels.push({
              id: 1,
              x: 0,
              y: 0,
              width: this.image.width,
              height: this.image.height
            });
          }

          // Sort panels by reading order (top to bottom, left to right)
          this.sortPanels();

          // Convert panels to scenes
          const scenes = await this.panelsToScenes(imageUrl, this.panels);
          resolve(scenes);
        } catch (error) {
          reject(error);
        }
      };

      this.image.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      this.image.src = imageUrl;
    });
  }
  
  /**
   * Detect panels in the image and return them without converting to scenes
   * @param imageUrl URL of the image to process
   * @returns Promise that resolves to an array of Panel objects
   */
  public async detectPanelsOnly(imageUrl: string): Promise<Panel[]> {
    return new Promise((resolve, reject) => {
      this.image.onload = async () => {
        try {
          // Setup canvas with image dimensions
          this.canvas.width = this.image.width;
          this.canvas.height = this.image.height;
          this.ctx.drawImage(this.image, 0, 0);

          // Detect panels
          await this.detectPanels();
          
          // If no panels detected, use the whole image as one panel
          if (this.panels.length === 0) {
            this.panels.push({
              id: 1,
              x: 0,
              y: 0,
              width: this.image.width,
              height: this.image.height
            });
          }

          // Sort panels by reading order (top to bottom, left to right)
          this.sortPanels();

          resolve([...this.panels]);
        } catch (error) {
          reject(error);
        }
      };

      this.image.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      this.image.src = imageUrl;
    });
  }
  
  /**
   * Extract panels from predefined boundaries
   * @param imageUrl URL of the image
   * @param panels Array of panel boundaries
   * @returns Promise that resolves to an array of SceneProps
   */
  public async extractPanelsFromBoundaries(imageUrl: string, panels: Panel[]): Promise<SceneProps[]> {
    return new Promise((resolve, reject) => {
      this.image.onload = async () => {
        try {
          // Sort panels by reading order
          const sortedPanels = [...panels].sort((a, b) => {
            // Create rows based on vertical position
            const rowThreshold = Math.min(a.height, b.height) * 0.5;
            if (Math.abs(a.y - b.y) > rowThreshold) {
              return a.y - b.y; // Sort by y if panels are in different rows
            }
            return a.x - b.x; // Sort by x if panels are in the same row
          });
          
          // Convert sorted panels to scenes
          const scenes = await this.panelsToScenes(imageUrl, sortedPanels);
          resolve(scenes);
        } catch (error) {
          reject(error);
        }
      };

      this.image.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      this.image.src = imageUrl;
    });
  }

  /**
   * Detect panels in the comic image
   */
  private async detectPanels(): Promise<void> {
    // Reset panels array
    this.panels = [];
    
    // Get image data for processing
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    // Try to detect comic-style panels using line detection
    await this.detectPanelsByLines(imageData);
    
    // If we didn't find enough panels, try with our other methods
    if (this.panels.length < 2) {
      const edges = this.detectEdges(imageData);
      this.findPanels(edges);
    }
    
    if (this.panels.length < 2) {
      await this.detectPanelsByContours(imageData);
    }
    
    if (this.panels.length < 2) {
      await this.detectPanelsByCannyEdges(imageData);
    }
    
    // Last resort: Use the layout detection approach
    if (this.panels.length < 2) {
      this.analyzeImageLayout();
    }
    
    // Merge overlapping panels and filter small ones
    this.refinePanels();
  }

  /**
   * Detect comic panels using horizontal and vertical line detection
   */
  private async detectPanelsByLines(imageData: ImageData): Promise<void> {
    const { width, height, data } = imageData;
    
    // Convert to grayscale
    const grayscale = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
      const idx = i * 4;
      grayscale[i] = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]);
    }
    
    // Detect horizontal and vertical lines
    const horizontalLines: number[] = [];
    const verticalLines: number[] = [];
    
    // Parameters for line detection - INCREASED THRESHOLDS FOR LESS SENSITIVITY
    const lineThreshold = 300;  // Increased from 200 to 300 (minimum length for a line)
    const gapThreshold = 15;    // Reduced from 20 to 15 (maximum gap allowed in a line)
    const blackThreshold = 140; // Reduced from 150 to 140 (pixel value threshold for "dark" pixel)
    
    // Find horizontal lines
    for (let y = 0; y < height; y++) {
      let lineLength = 0;
      let blackCount = 0;
      
      for (let x = 0; x < width; x++) {
        const pixelValue = grayscale[y * width + x];
        
        // If we found a dark pixel, increment counter
        if (pixelValue < blackThreshold) {
          blackCount++;
          lineLength++;
        } else if (blackCount > 0 && lineLength < gapThreshold) {
          // Allow small gaps
          lineLength++;
        } else {
          // End of a potential line segment
          if (blackCount > lineThreshold) {
            // We found a significant horizontal line
            horizontalLines.push(y);
          }
          lineLength = 0;
          blackCount = 0;
        }
      }
      
      // Check if we have a line at the end of the row
      if (blackCount > lineThreshold) {
        horizontalLines.push(y);
      }
    }
    
    // Find vertical lines
    for (let x = 0; x < width; x++) {
      let lineLength = 0;
      let blackCount = 0;
      
      for (let y = 0; y < height; y++) {
        const pixelValue = grayscale[y * width + x];
        
        if (pixelValue < blackThreshold) {
          blackCount++;
          lineLength++;
        } else if (blackCount > 0 && lineLength < gapThreshold) {
          // Allow small gaps
          lineLength++;
        } else {
          // End of a potential line segment
          if (blackCount > lineThreshold) {
            // We found a significant vertical line
            verticalLines.push(x);
          }
          lineLength = 0;
          blackCount = 0;
        }
      }
      
      // Check if we have a line at the end of the column
      if (blackCount > lineThreshold) {
        verticalLines.push(x);
      }
    }
    
    // Filter out closely spaced lines
    const filteredHLines = this.filterClosePoints(horizontalLines, 10);
    const filteredVLines = this.filterClosePoints(verticalLines, 10);
    
    // Always add image boundaries as potential panel boundaries
    filteredHLines.unshift(0);
    filteredHLines.push(height - 1);
    filteredVLines.unshift(0);
    filteredVLines.push(width - 1);
    
    // Create panels from the intersections of horizontal and vertical lines
    for (let i = 0; i < filteredVLines.length - 1; i++) {
      for (let j = 0; j < filteredHLines.length - 1; j++) {
        const x1 = filteredVLines[i];
        const y1 = filteredHLines[j];
        const x2 = filteredVLines[i + 1];
        const y2 = filteredHLines[j + 1];
        
        // Ensure the panel has reasonable dimensions
        const panelWidth = x2 - x1;
        const panelHeight = y2 - y1;
        const minSize = Math.min(width, height) * 0.05;
        const maxSize = Math.max(width, height) * 0.95;
        
        if (panelWidth > minSize && panelHeight > minSize && 
            panelWidth < maxSize && panelHeight < maxSize) {
          this.panels.push({
            id: this.panels.length + 1,
            x: x1,
            y: y1,
            width: panelWidth,
            height: panelHeight
          });
        }
      }
    }
  }

  /**
   * Detect panels using Canny edge detection (simplified implementation)
   */
  private async detectPanelsByCannyEdges(imageData: ImageData): Promise<void> {
    const { width, height, data } = imageData;
    
    // Step 1: Convert to grayscale and apply Gaussian blur
    const grayscale = new Uint8Array(width * height);
    
    // Grayscale conversion
    for (let i = 0; i < width * height; i++) {
      const idx = i * 4;
      grayscale[i] = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]);
    }
    
    // Step 2: Apply a simple edge detection filter
    const edges: boolean[][] = Array(height).fill(0).map(() => Array(width).fill(false));
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    
    const gradientMagnitude = new Array(width * height).fill(0);
    
    // Compute gradient magnitude
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let sumX = 0;
        let sumY = 0;
        
        for (let j = -1; j <= 1; j++) {
          for (let i = -1; i <= 1; i++) {
            const idx = (y + j) * width + (x + i);
            const kernelIdx = (j + 1) * 3 + (i + 1);
            sumX += grayscale[idx] * sobelX[kernelIdx];
            sumY += grayscale[idx] * sobelY[kernelIdx];
          }
        }
        
        const idx = y * width + x;
        gradientMagnitude[idx] = Math.sqrt(sumX * sumX + sumY * sumY);
      }
    }
    
    // Apply threshold to find edges
    const threshold = 100;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (gradientMagnitude[idx] > threshold) {
          edges[y][x] = true;
        }
      }
    }
    
    // Dilate edges to create closed boundaries
    const dilatedEdges: boolean[][] = Array(height).fill(0).map(() => Array(width).fill(false));
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        // Check if any neighbors are edges
        dilatedEdges[y][x] = edges[y][x] || 
                            edges[y-1][x] || edges[y+1][x] || 
                            edges[y][x-1] || edges[y][x+1];
      }
    }
    
    // Step 3: Find enclosed regions (potential panels)
    const visited: boolean[][] = Array(height).fill(0).map(() => Array(width).fill(false));
    const minPanelSize = Math.min(width, height) * 0.05;
    
    // Sample the image at regular intervals to find panel interiors
    for (let y = Math.floor(height * 0.1); y < height * 0.9; y += Math.max(1, Math.floor(height / 20))) {
      for (let x = Math.floor(width * 0.1); x < width * 0.9; x += Math.max(1, Math.floor(width / 20))) {
        if (!dilatedEdges[y][x] && !visited[y][x]) {
          const panel = this.floodFillPanel(x, y, dilatedEdges, visited);
          
          // Add panels with reasonable size
          if (panel.width > minPanelSize && panel.height > minPanelSize &&
              panel.width < width * 0.95 && panel.height < height * 0.95) {
            this.panels.push({
              ...panel
            });
          }
        }
      }
    }
  }

  /**
   * Modified to better handle contours with reduced sensitivity
   */
  private async detectPanelsByContours(imageData: ImageData): Promise<void> {
    const { width, height, data } = imageData;
    
    // Create a binary image with adaptive thresholding
    const binaryImage: boolean[][] = Array(height).fill(0).map(() => Array(width).fill(false));
    
    // Apply Otsu-like thresholding: calculate histogram and find optimal threshold
    const histogram = new Array(256).fill(0);
    
    // Build histogram
    for (let i = 0; width * height; i++) {
      const idx = i * 4;
      const gray = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]);
      histogram[gray]++;
    }
    
    // Find threshold using a simplified Otsu method
    let sum = 0;
    for (let i = 0; i < 256; i++) {
      sum += i * histogram[i];
    }
    
    let sumB = 0;
    let wB = 0;
    let wF = 0;
    let maxVariance = 0;
    let threshold = 0;
    const totalPixels = width * height;
    
    for (let t = 0; t < 256; t++) {
      wB += histogram[t]; // Weight background
      if (wB === 0) continue;
      
      wF = totalPixels - wB; // Weight foreground
      if (wF === 0) break;
      
      sumB += t * histogram[t];
      
      const mB = sumB / wB; // Mean background
      const mF = (sum - sumB) / wF; // Mean foreground
      
      // Calculate between-class variance
      const variance = wB * wF * (mB - mF) * (mB - mF);
      
      if (variance > maxVariance) {
        maxVariance = variance;
        threshold = t;
      }
    }
    
    // Apply threshold to create binary image
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const gray = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]);
        binaryImage[y][x] = gray < threshold;
      }
    }
    
    // Find connected components (simulate OpenCV contour finding)
    const visited: boolean[][] = Array(height).fill(0).map(() => Array(width).fill(false));
    const contours: Panel[] = [];
    const minContourSize = width * height * 0.005; // INCREASED from 0.001 to 0.005 - larger minimum size
    
    // Scan the binary image for contours
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // If this is a border pixel and not visited yet
        if (binaryImage[y][x] && !visited[y][x] && this.isBorderPixel(binaryImage, x, y, width, height)) {
          const contour = this.traceContour(binaryImage, visited, x, y, width, height);
          
          // Get bounding box
          if (contour.points.length > minContourSize) {
            let minX = width, minY = height, maxX = 0, maxY = 0;
            
            for (const point of contour.points) {
              minX = Math.min(minX, point.x);
              minY = Math.min(minY, point.y);
              maxX = Math.max(maxX, point.x);
              maxY = Math.max(maxY, point.y);
            }
            
            const contourWidth = maxX - minX + 1;
            const contourHeight = maxY - minY + 1;
            
            // Filter by size - MORE RESTRICTIVE FILTERS
            if (contourWidth > width * 0.1 && contourHeight > height * 0.1 && // Increased from 0.05 to 0.1
                contourWidth < width * 0.9 && contourHeight < height * 0.9) { // Reduced from 0.95 to 0.9
              contours.push({
                id: contours.length + 1,
                x: minX,
                y: minY,
                width: contourWidth,
                height: contourHeight
              });
            }
          }
        }
      }
    }
    
    // Add valid contours to panels
    this.panels.push(...contours);
  }

  /**
   * Apply edge detection with reduced sensitivity
   */
  private detectEdges(imageData: ImageData): boolean[][] {
    const { width, height, data } = imageData;
    const threshold = 35; // INCREASED from 20 to 35 - less sensitive edge detection
    const edges: boolean[][] = Array(height).fill(0).map(() => Array(width).fill(false));

    // Enhanced edge detection - look for significant changes in pixel values
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const pos = (y * width + x) * 4;
        const posLeft = (y * width + (x - 1)) * 4;
        const posRight = (y * width + (x + 1)) * 4;
        const posUp = ((y - 1) * width + x) * 4;
        const posDown = ((y + 1) * width + x) * 4;

        // Calculate differences with neighboring pixels
        const diffX = Math.abs(data[pos] - data[posLeft]) + 
                     Math.abs(data[pos + 1] - data[posLeft + 1]) + 
                     Math.abs(data[pos + 2] - data[posLeft + 2]);
                     
        const diffY = Math.abs(data[pos] - data[posUp]) + 
                     Math.abs(data[pos + 1] - data[posUp + 1]) + 
                     Math.abs(data[pos + 2] - data[posUp + 2]);
                     
        const diffRight = Math.abs(data[pos] - data[posRight]) + 
                     Math.abs(data[pos + 1] - data[posRight + 1]) + 
                     Math.abs(data[pos + 2] - data[posRight + 2]);
                     
        const diffDown = Math.abs(data[pos] - data[posDown]) + 
                     Math.abs(data[pos + 1] - data[posDown + 1]) + 
                     Math.abs(data[pos + 2] - data[posDown + 2]);

        // Mark as edge if difference exceeds threshold in any direction
        if (diffX > threshold || diffY > threshold || diffRight > threshold || diffDown > threshold) {
          edges[y][x] = true;
        }
      }
    }

    return edges;
  }

  /**
   * Find potential panels with reduced sensitivity
   */
  private findPanels(edges: boolean[][]): void {
    const { width, height } = this.canvas;
    const visited: boolean[][] = Array(height).fill(0).map(() => Array(width).fill(false));
    const minPanelSize = Math.min(width, height) * 0.1; // INCREASED from 0.05 to 0.1

    // Reduce sampling density for less panels
    const stepY = Math.max(1, Math.floor(height / 20)); // REDUCED from 40 to 20
    const stepX = Math.max(1, Math.floor(width / 20)); // REDUCED from 40 to 20
    
    // Find and mark continuous regions
    for (let y = 0; y < height; y += stepY) {
      for (let x = 0; x < width; x += stepX) {
        if (!edges[y][x] && !visited[y][x]) {
          // Found a potential panel start point
          const panel = this.floodFillPanel(x, y, edges, visited);
          
          // More restrictive size filtering
          if (panel.width > minPanelSize && panel.height > minPanelSize &&
              panel.width < width * 0.9 && panel.height < height * 0.9) { // Reduced from 0.95 to 0.9
            this.panels.push({
              ...panel
            });
          }
        }
      }
    }
  }

  /**
   * Use flood fill algorithm to find a contiguous region
   */
  private floodFillPanel(startX: number, startY: number, edges: boolean[][], visited: boolean[][]): Panel {
    const { width, height } = this.canvas;
    const queue: [number, number][] = [[startX, startY]];
    let minX = startX, maxX = startX, minY = startY, maxY = startY;
    
    visited[startY][startX] = true;
    
    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      
      // Update panel boundaries
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      
      // Check neighboring pixels
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (
          nx >= 0 && nx < width &&
          ny >= 0 && ny < height &&
          !edges[ny][nx] && !visited[ny][nx]
        ) {
          visited[ny][nx] = true;
          queue.push([nx, ny]);
        }
      }
    }
    
    return {
      id: this.panels.length + 1, // Add id to match Panel interface
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1
    };
  }

  /**
   * Smooth an array using moving average
   */
  private smoothArray(arr: number[], windowSize: number): number[] {
    const result = new Array(arr.length);
    
    for (let i = 0; i < arr.length; i++) {
      let sum = 0;
      let count = 0;
      
      for (let j = Math.max(0, i - windowSize); j <= Math.min(arr.length - 1, i + windowSize); j++) {
        sum += arr[j];
        count++;
      }
      
      result[i] = sum / count;
    }
    
    return result;
  }

  /**
   * Detect significant changes in profile with reduced sensitivity
   */
  private detectProfileDividers(profile: number[], dimension: number): number[] {
    const dividers: number[] = [];
    const threshold = 0.5; // INCREASED from 0.4 to 0.5
    
    // Smooth the profile first
    const smoothedProfile = this.smoothArray(profile, 5);
    
    // Calculate first derivative to find sharp changes
    const derivative: number[] = [];
    for (let i = 1; i < smoothedProfile.length; i++) {
      derivative.push(Math.abs(smoothedProfile[i] - smoothedProfile[i-1]));
    }
    
    // Find peaks in derivative (sharp changes)
    for (let i = 1; i < derivative.length - 1; i++) {
      if (derivative[i] > threshold && 
          derivative[i] > derivative[i-1] && 
          derivative[i] > derivative[i+1]) {
        dividers.push(i);
      }
    }
    
    // Ensure wider minimum distance between dividers
    const minDistance = dimension * 0.1; // INCREASED from 0.05 to 0.1
    const filteredDividers = this.filterClosePoints(dividers, minDistance);
    
    return filteredDividers;
  }

  /**
   * Improved analyze layout to create fewer panels
   */
  private analyzeImageLayout(): void {
    const { width, height } = this.canvas;
    
    // Analyze image content to determine best layout approach
    // Start by checking image intensity profile to detect panels
    
    // First, create horizontal and vertical profiles
    const horizontalProfile = new Array(height).fill(0);
    const verticalProfile = new Array(width).fill(0);
    
    // Get image data to analyze content
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Calculate intensity profiles
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const intensity = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        horizontalProfile[y] += intensity;
        verticalProfile[x] += intensity;
      }
    }
    
    // Normalize profiles
    const maxH = Math.max(...horizontalProfile);
    const maxV = Math.max(...verticalProfile);
    
    for (let i = 0; i < height; i++) {
      horizontalProfile[i] /= (width * maxH);
    }
    
    for (let i = 0; i < width; i++) {
      verticalProfile[i] /= (height * maxV);
    }
    
    // Detect potential dividers (sharp changes in profile)
    const horizontalDividers = this.detectProfileDividers(horizontalProfile, height);
    const verticalDividers = this.detectProfileDividers(verticalProfile, width);
    
    // Add image boundaries
    horizontalDividers.unshift(0);
    horizontalDividers.push(height - 1);
    verticalDividers.unshift(0);
    verticalDividers.push(width - 1);
    
    // Reset panels
    this.panels = [];
    
    // Create panels from dividers
    for (let i = 0; i < verticalDividers.length - 1; i++) {
      for (let j = 0; j < horizontalDividers.length - 1; j++) {
        const x = verticalDividers[i];
        const y = horizontalDividers[j];
        const w = verticalDividers[i + 1] - x;
        const h = horizontalDividers[j + 1] - y;
        
        // Check if panel size is reasonable
        if (w > width * 0.05 && h > height * 0.05 &&
            w < width * 0.95 && h < height * 0.95) {
          this.panels.push({
            id: this.panels.length + 1,
            x,
            y,
            width: w,
            height: h
          });
        }
      }
    }
    
    // If no good dividers are detected, fallback to simpler layouts
    if (this.panels.length < 2) {
      // Default to simpler layouts - max 4 panels
      const aspectRatio = width / height;
      
      let rows = 1, cols = 1;
      
      if (aspectRatio > 1.8) {
        // Very wide image, likely horizontal panels
        cols = 2; // REDUCED from 3 to 2
      } else if (aspectRatio > 1.3) {
        // Wide image, likely 2x1 grid
        rows = 2;
        cols = 1; // REDUCED from 2 to 1
      } else if (aspectRatio < 0.6) {
        // Very tall image, likely vertical panels
        rows = 2; // REDUCED from 3 to 2
      } else {
        // Square-ish image, likely 2x2 grid
        rows = 2;
        cols = 1; // REDUCED from 2 to 1
      }
      
      const panelWidth = width / cols;
      const panelHeight = height / rows;
      
      this.panels = [];
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          this.panels.push({
            id: row * cols + col + 1,
            x: col * panelWidth,
            y: row * panelHeight,
            width: panelWidth,
            height: panelHeight
          });
        }
      }
    }
  }

  /**
   * Filter out points that are too close to each other
   */
  private filterClosePoints(points: number[], threshold: number): number[] {
    if (points.length === 0) return points;
    
    // Sort points in ascending order
    points.sort((a, b) => a - b);
    
    const result: number[] = [points[0]];
    
    for (let i = 1; i < points.length; i++) {
      if (points[i] - result[result.length - 1] > threshold) {
        result.push(points[i]);
      }
    }
    
    return result;
  }

  /**
   * Trace a contour using border following
   */
  private traceContour(binaryImage: boolean[][], visited: boolean[][], startX: number, startY: number, width: number, height: number) {
    const points: { x: number, y: number }[] = [];
    const stack: { x: number, y: number }[] = [{ x: startX, y: startY }];
    
    while (stack.length > 0) {
      const current = stack.pop()!;
      const { x, y } = current;
      
      if (x < 0 || x >= width || y < 0 || y >= height || visited[y][x] || !binaryImage[y][x]) {
        continue;
      }
      
      visited[y][x] = true;
      points.push({ x, y });
      
      // 8-connectivity
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height && 
              binaryImage[ny][nx] && !visited[ny][nx]) {
            stack.push({ x: nx, y: ny });
          }
        }
      }
    }
    
    return { points };
  }

  /**
   * Check if a pixel is on the border of an object
   */
  private isBorderPixel(binaryImage: boolean[][], x: number, y: number, width: number, height: number): boolean {
    if (!binaryImage[y][x]) return false;
    
    // Check 4-neighborhood
    const neighbors = [
      { x: x + 1, y: y },
      { x: x - 1, y: y },
      { x: x, y: y + 1 },
      { x: x, y: y - 1 }
    ];
    
    for (const neighbor of neighbors) {
      if (neighbor.x >= 0 && neighbor.x < width && 
          neighbor.y >= 0 && neighbor.y < height &&
          !binaryImage[neighbor.y][neighbor.x]) {
        return true; // Found a background neighbor
      }
    }
    
    return false;
  }

  /**
   * Refine panel detection by merging overlaps and filtering
   */
  private refinePanels(): void {
    if (this.panels.length === 0) return;

    // Sort panels by size (descending)
    this.panels.sort((a, b) => (b.width * b.height) - (a.width * a.height));

    // Keep track of panels to remove (duplicates or nested panels)
    const panelsToRemove = new Set<number>();

    // Check for overlapping panels
    for (let i = 0; i < this.panels.length; i++) {
      if (panelsToRemove.has(i)) continue;
      
      for (let j = i + 1; j < this.panels.length; j++) {
        if (panelsToRemove.has(j)) continue;
        
        // Calculate overlap
        const overlap = this.calculateOverlap(this.panels[i], this.panels[j]);
        
        // If substantial overlap, mark smaller panel for removal
        if (overlap > 0.7) {
          panelsToRemove.add(j);
        }
      }
    }

    // Remove marked panels
    this.panels = this.panels.filter((_, index) => !panelsToRemove.has(index));
    
    // Ensure panel IDs are sequential
    this.panels = this.panels.map((panel, index) => ({
      ...panel,
      id: index + 1
    }));
    
    // Check if panels seem reasonable (e.g., not all covering the whole image)
    if (this.panels.length <= 1) {
      // If we only detected one panel, try a layout-based approach
      this.analyzeImageLayout();
    }
  }

  /**
   * Calculate overlap between two panels
   */
  private calculateOverlap(panel1: Panel, panel2: Panel): number {
    // Calculate intersection
    const xOverlap = Math.max(0, Math.min(panel1.x + panel1.width, panel2.x + panel2.width) - Math.max(panel1.x, panel2.x));
    const yOverlap = Math.max(0, Math.min(panel1.y + panel1.height, panel2.y + panel2.height) - Math.max(panel1.y, panel2.y));
    const overlapArea = xOverlap * yOverlap;
    
    // Calculate smaller panel area
    const panel2Area = panel2.width * panel2.height;
    
    // Return overlap as percentage of smaller panel
    return panel2Area > 0 ? overlapArea / panel2Area : 0;
  }

  /**
   * Sort panels in reading order (top to bottom, left to right)
   */
  private sortPanels(): void {
    // Simple reading order sort for western comics
    this.panels.sort((a, b) => {
      // Create rows based on vertical position
      const rowThreshold = Math.min(a.height, b.height) * 0.5;
      if (Math.abs(a.y - b.y) > rowThreshold) {
        return a.y - b.y; // Sort by y if panels are in different rows
      }
      return a.x - b.x; // Sort by x if panels are in the same row
    });
    
    // Reassign IDs based on the sorted order
    this.panels = this.panels.map((panel, index) => ({
      ...panel,
      id: index + 1
    }));
  }

  /**
   * Convert detected panels to scene objects
   */
  private async panelsToScenes(imageUrl: string, panelsToProcess: Panel[]): Promise<SceneProps[]> {
    const scenes: SceneProps[] = [];
    const colors = ["bg-purple-500", "bg-indigo-500", "bg-violet-500", "bg-fuchsia-500", "bg-pink-500"];
    
    // Create a new canvas for extracting panels
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    // Process each panel and convert to scene
    for (let i = 0; i < panelsToProcess.length; i++) {
      const panel = panelsToProcess[i];
      
      // Extract panel image
      canvas.width = panel.width;
      canvas.height = panel.height;
      ctx.drawImage(
        this.image,
        panel.x, panel.y, panel.width, panel.height,
        0, 0, panel.width, panel.height
      );
      
      // Convert canvas to data URL
      const panelImageUrl = canvas.toDataURL('image/png');
      
      // Create scene object
      scenes.push({
        id: i + 1, // Ascending IDs starting from 1
        title: `Panel ${i + 1}`,
        description: "",
        dialogue: "",
        image: panelImageUrl,
        color: colors[i % colors.length]
      });
    }
    
    return scenes;
  }
}
