import { useState, useCallback } from 'react';
import { getProjects } from '../services/projectService';
import type { Project } from '../types/project.types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => getProjects());

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => [...prev, project]);
  }, []);

  return { projects, addProject };
}
