
// Define types for our API responses
export interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  thumbnail: string
  versionCount: number
}

export interface Version {
  id: string
  projectId: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  thumbnail: string
  scenes: SceneProps[]
}

export interface SceneProps {
  id: number
  title: string
  description: string
  dialogue: string
  image: string | null
  color: string
}

// Type definitions for local storage keys
const STORAGE_KEYS = {
  PROJECTS: 'storyboard_projects',
  VERSIONS: 'storyboard_versions',
};

// Helper function to get data from localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  const storedData = localStorage.getItem(key);
  if (!storedData) return defaultValue;
  
  try {
    return JSON.parse(storedData) as T;
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage:`, e);
    return defaultValue;
  }
}

// Helper function to save data to localStorage
function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export const storyboardService = {
  // Project methods
  getProjects: (): Project[] => {
    return getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
  },
  
  getProject: (projectId: string): Project | undefined => {
    const projects = getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
    return projects.find((p) => p.id === projectId);
  },
  
  createProject: (newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'versionCount'>): Project => {
    const projects = getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
    
    // Create project with required fields
    const project: Project = {
      ...newProject,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versionCount: 0,
    };
    
    // Save to storage
    saveToStorage(STORAGE_KEYS.PROJECTS, [project, ...projects]);
    
    return project;
  },

  updateProject: (projectId: string, updates: Partial<Project>): Project => {
    const projects = getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
    
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    // Update the project
    const updatedProject = {
      ...projects[projectIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    projects[projectIndex] = updatedProject;
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    
    return updatedProject;
  },
  
  // New method to directly update projects array
  updateProjects: (projects: Project[]): void => {
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  },

  // Version methods
  getVersions: (projectId: string): Version[] => {
    const versions = getFromStorage<Version[]>(STORAGE_KEYS.VERSIONS, []);
    return versions.filter(v => v.projectId === projectId);
  },
  
  getVersion: (versionId: string): Version | undefined => {
    const versions = getFromStorage<Version[]>(STORAGE_KEYS.VERSIONS, []);
    return versions.find(v => v.id === versionId);
  },
  
  createVersion: (newVersion: Omit<Version, 'id' | 'createdAt' | 'updatedAt'>): Version => {
    const versions = getFromStorage<Version[]>(STORAGE_KEYS.VERSIONS, []);
    
    // Create version with required fields
    const version: Version = {
      ...newVersion,
      id: `version-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Save to storage
    saveToStorage(STORAGE_KEYS.VERSIONS, [version, ...versions]);
    
    // Update project version count
    try {
      const projects = getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
      const projectIndex = projects.findIndex(p => p.id === version.projectId);
      
      if (projectIndex !== -1) {
        projects[projectIndex] = {
          ...projects[projectIndex],
          versionCount: (projects[projectIndex].versionCount || 0) + 1,
          updatedAt: new Date().toISOString(),
        };
        
        saveToStorage(STORAGE_KEYS.PROJECTS, projects);
      }
    } catch (e) {
      console.error('Error updating project version count:', e);
    }
    
    return version;
  },
  
  updateVersion: (versionId: string, updates: Partial<Version>): Version => {
    console.log(`Updating version ${versionId} with:`, updates);
    
    const versions = getFromStorage<Version[]>(STORAGE_KEYS.VERSIONS, []);
    console.log("Current versions in storage:", versions);
    
    const versionIndex = versions.findIndex(v => v.id === versionId);
    if (versionIndex === -1) {
      console.error(`Version with ID ${versionId} not found in localStorage`);
      throw new Error(`Version with ID ${versionId} not found`);
    }
    
    // Ensure we're correctly handling the scenes array
    const currentVersion = versions[versionIndex];
    console.log("Original version before update:", currentVersion);
    
    // Create updated version, handling scenes explicitly to ensure they're properly stored
    const updatedVersion = {
      ...currentVersion,
      ...updates,
      // If scenes are provided in updates, use them; otherwise keep the current ones
      scenes: updates.scenes !== undefined ? updates.scenes : currentVersion.scenes,
      updatedAt: new Date().toISOString(),
    };
    
    console.log("Updated version to save:", updatedVersion);
    versions[versionIndex] = updatedVersion;
    
    // Explicitly save with the correct key
    saveToStorage(STORAGE_KEYS.VERSIONS, versions);
    
    // Verify the save worked
    const checkVersions = getFromStorage<Version[]>(STORAGE_KEYS.VERSIONS, []);
    console.log("Versions after save:", checkVersions);
    console.log("Check if updated version is saved correctly:", 
      checkVersions.find(v => v.id === versionId));
    
    // Update project's updatedAt
    try {
      const projects = getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
      const projectIndex = projects.findIndex(p => p.id === updatedVersion.projectId);
      
      if (projectIndex !== -1) {
        projects[projectIndex] = {
          ...projects[projectIndex],
          updatedAt: new Date().toISOString(),
        };
        
        saveToStorage(STORAGE_KEYS.PROJECTS, projects);
      }
    } catch (e) {
      console.error('Error updating project last modified date:', e);
    }
    
    return updatedVersion;
  },

  // Utility to clear all data (for testing/development)
  clearAllData: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.PROJECTS);
      localStorage.removeItem(STORAGE_KEYS.VERSIONS);
    }
  },
};
