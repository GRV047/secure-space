import { useCallback } from 'react';
import {
  createProject,
  createCrawlSession,
  fetchCrawlSession,
} from '../services/projectService';
import type { Project, CrawlSession, CrawlSessionDetail } from '../types/project.types';

export function useProjectFlow() {
  const doCreateProject = useCallback(
    (name: string, targetUrl: string): Promise<Project> =>
      createProject(name, targetUrl),
    [],
  );

  const doCreateCrawlSession = useCallback(
    (projectId: number): Promise<CrawlSession> =>
      createCrawlSession(projectId),
    [],
  );

  const doFetchCrawlSession = useCallback(
    (crawlSessionId: number): Promise<CrawlSessionDetail> =>
      fetchCrawlSession(crawlSessionId),
    [],
  );

  return { doCreateProject, doCreateCrawlSession, doFetchCrawlSession };
}
