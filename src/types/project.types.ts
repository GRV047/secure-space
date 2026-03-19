/** Matches POST /projects/ response */
export interface Project {
  id: number;
  name: string;
  target_url: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

/** Matches POST /projects/{id}/crawl-sessions/ response */
export interface CrawlSession {
  id: number;
  project_id: number;
  include_subdomains: boolean;
  status: string;
  created_at: string;
}

/** Matches GET /crawl-session/{id} response */
export interface CrawlSessionDetail {
  id: number;
  status: string;
  url_count: number;
  urls: string[];
}
