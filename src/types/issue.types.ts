export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
export type IssueStatus = 'Open' | 'Confirmed' | 'False Positive' | 'Fixed' | 'Wont Fix';

export interface Issue {
  id: string;
  title: string;
  severity: Severity;
  status: IssueStatus;
  url: string;
  parameter?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  category: string;
  cwe?: string;
  cvss?: number;
  detectedAt: string;
  description: string;
  evidence?: string;
  remediation?: string;
  comments: IssueComment[];
}

export interface IssueComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface IssueFilters {
  severity: Severity[];
  status: IssueStatus[];
  category: string[];
}
