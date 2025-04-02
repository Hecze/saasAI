import { mockProjects, mockVersions } from "@/lib/mock-data"
import type { SceneProps } from "@/components/story-builder/story-builder"

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

// Mock API functions that simulate fetching data from a database
export async function fetchProjects(): Promise<Project[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockProjects
}

export async function fetchProject(projectId: string): Promise<Project | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockProjects.find((p) => p.id === projectId) || null
}

export async function fetchVersions(projectId: string): Promise<Version[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockVersions.filter((v) => v.projectId === projectId)
}

export async function fetchVersion(versionId: string): Promise<Version | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockVersions.find((v) => v.id === versionId) || null
}

export async function saveVersion(version: Version): Promise<Version> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  // Find the version in our mock data
  const index = mockVersions.findIndex((v) => v.id === version.id)

  if (index !== -1) {
    // Update the existing version
    mockVersions[index] = {
      ...version,
      updatedAt: new Date().toISOString(),
    }
    return mockVersions[index]
  } else {
    // Add a new version
    const newVersion = {
      ...version,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockVersions.push(newVersion)
    return newVersion
  }
}

export async function createProject(
  project: Omit<Project, "id" | "createdAt" | "updatedAt" | "versionCount">,
): Promise<Project> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  const newProject = {
    ...project,
    id: `project-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    versionCount: 0,
  }

  mockProjects.push(newProject)
  return newProject
}

export async function createVersion(version: Omit<Version, "id" | "createdAt" | "updatedAt">): Promise<Version> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  const newVersion = {
    ...version,
    id: `version-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockVersions.push(newVersion)

  // Update the version count for the project
  const project = mockProjects.find((p) => p.id === version.projectId)
  if (project) {
    project.versionCount += 1
  }

  return newVersion
}

