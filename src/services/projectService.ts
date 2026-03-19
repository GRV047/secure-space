import { USE_MOCK } from '../config/env';
import { apiRequest } from '../config/api';
import { projectsStore, nextProjectId } from '../mock/projects.mock';
import type { Project, CrawlSession, CrawlSessionDetail } from '../types/project.types';

// ─── Mock implementations ─────────────────────────────────────────────────────

async function createProjectMock(name: string, targetUrl: string): Promise<Project> {
  await new Promise((r) => setTimeout(r, 600));
  const project: Project = {
    id: nextProjectId(),
    name,
    target_url: targetUrl,
    owner_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  projectsStore.push(project);
  return project;
}

async function createCrawlSessionMock(projectId: number): Promise<CrawlSession> {
  await new Promise((r) => setTimeout(r, 500));
  return {
    id: Date.now(),
    project_id: projectId,
    include_subdomains: false,
    status: 'pending',
    created_at: new Date().toISOString(),
  };
}

async function fetchCrawlSessionMock(crawlSessionId: number): Promise<CrawlSessionDetail> {
  await new Promise((r) => setTimeout(r, 300));
  return { id: crawlSessionId, status: 'pending', url_count: 0, urls: [] };
}

// ─── API implementations ──────────────────────────────────────────────────────

async function createProjectApi(name: string, targetUrl: string): Promise<Project> {
  try {
    return await apiRequest<Project>('/projects/', {
      method: 'POST',
      body: JSON.stringify({ name, target_url: targetUrl }),
    });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to create project.');
  }
}

async function createCrawlSessionApi(projectId: number): Promise<CrawlSession> {
  try {
    return await apiRequest<CrawlSession>(`/projects/${projectId}/crawl-sessions/`, {
      method: 'POST',
      body: JSON.stringify({ include_subdomains: false }),
    });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to create crawl session.');
  }
}

async function fetchCrawlSessionApi(crawlSessionId: number): Promise<CrawlSessionDetail> {
  try {
    return await apiRequest<CrawlSessionDetail>(`/crawl-session/${crawlSessionId}`);
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to fetch crawl session.');
  }
}

// ─── Exports (driven by USE_MOCK flag) ────────────────────────────────────────

export const createProject      = USE_MOCK ? createProjectMock      : createProjectApi;
export const createCrawlSession = USE_MOCK ? createCrawlSessionMock : createCrawlSessionApi;
export const fetchCrawlSession  = USE_MOCK ? fetchCrawlSessionMock  : fetchCrawlSessionApi;

export function getProjects(): Project[] {
  return [...projectsStore];
}
