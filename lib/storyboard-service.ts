import { mockProjects, mockVersions } from './mock-data';
import type { Version, Project } from './api';

// In-memory data store that simulates a database
let projects = [...mockProjects];
let versions = [...mockVersions];

export const storyboardService = {
  // Project methods
  getProjects: () => {
    return [...projects];
  },
  
  getProject: (projectId: string) => {
    return projects.find((p) => p.id === projectId);
  },

  // Version methods
  getVersions: (projectId: string) => {
    return versions.filter((v) => v.projectId === projectId);
  },
  
  getVersion: (versionId: string) => {
    return versions.find((v) => v.id === versionId);
  },
  
  createVersion: (newVersion: Version) => {
    // Add to the versions array
    versions = [newVersion, ...versions];
    
    // Update project version count
    const projectIndex = projects.findIndex((p) => p.id === newVersion.projectId);
    if (projectIndex !== -1) {
      projects[projectIndex] = {
        ...projects[projectIndex],
        versionCount: (projects[projectIndex].versionCount || 0) + 1,
        updatedAt: new Date().toISOString(),
      };
    }
    
    return newVersion;
  },
  
  updateVersion: (versionId: string, updatedData: Partial<Version>) => {
    const versionIndex = versions.findIndex((v) => v.id === versionId);
    if (versionIndex === -1) {
      throw new Error(`Version not found: ${versionId}`);
    }
    
    // Update the version
    const updatedVersion = {
      ...versions[versionIndex],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
    
    versions[versionIndex] = updatedVersion;
    
    // Update project's updatedAt
    const projectIndex = projects.findIndex((p) => p.id === updatedVersion.projectId);
    if (projectIndex !== -1) {
      projects[projectIndex] = {
        ...projects[projectIndex],
        updatedAt: new Date().toISOString(),
      };
    }
    
    return updatedVersion;
  },
  
  // Utility to reset data (for testing)
  resetData: () => {
    projects = [...mockProjects];
    versions = [...mockVersions];
  }
};
