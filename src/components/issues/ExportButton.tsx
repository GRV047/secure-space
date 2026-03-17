import { Download } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Issue } from '../../types/issue.types';

interface Props {
  issues: Issue[];
}

export function ExportButton({ issues }: Props) {
  function handleExport() {
    const headers = ['ID', 'Title', 'Severity', 'Status', 'Category', 'URL', 'CWE', 'CVSS', 'Detected At'];
    const rows = issues.map((i) => [
      i.id,
      `"${i.title.replace(/"/g, '""')}"`,
      i.severity,
      i.status,
      i.category,
      i.url,
      i.cwe ?? '',
      i.cvss ?? '',
      i.detectedAt,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'securesphere-issues.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleExport}>
      <Download size={14} />
      Export CSV
    </Button>
  );
}
