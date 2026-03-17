import { Info } from 'lucide-react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ScanOverview } from '../../types/scan.types';

interface Props {
  overview: ScanOverview;
}

export function IssueSeverityChart({ overview }: Props) {
  const data = [
    { name: 'Critical',       count: overview.issueCount.critical,  fill: '#DC2626' },
    { name: 'High',           count: overview.issueCount.high,       fill: '#EA580C' },
    { name: 'Medium',         count: overview.issueCount.medium,     fill: '#D97706' },
    { name: 'Low',            count: overview.issueCount.low,        fill: '#0891B2' },
    { name: 'Informational',  count: overview.issueCount.info,       fill: '#2563EB' },
  ];

  const total =
    overview.issueCount.critical +
    overview.issueCount.high +
    overview.issueCount.medium +
    overview.issueCount.low +
    overview.issueCount.info;

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-1 mb-1">
        <p className="text-xs font-semibold text-secondary uppercase tracking-widest">
          Issues by severity
        </p>
        <Info size={12} className="text-muted" />
      </div>

      {/* Total issues label */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs text-muted">Total issues</span>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs font-semibold text-primary">{total}</span>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: -20, bottom: 4 }}
            barSize={32}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: '#F0F4FF' }}
              contentStyle={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#131313',
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
