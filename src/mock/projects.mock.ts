import type { Project } from '../types/project.types';

export const projectsStore: Project[] = [];

let nextId = 1;
export function nextProjectId(): number {
  return nextId++;
}
