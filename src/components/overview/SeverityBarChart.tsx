import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../ui/Card';
import type { SeverityDataPoint } from '../../types/scan.types';

interface Props {
  data: SeverityDataPoint[];
}

export function SeverityBarChart({ data }: Props) {
  return (
    <Card title="Issues by Category & Severity">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: -16, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
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
          />
          <Tooltip
            contentStyle={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#131313',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
          <Bar dataKey="critical" stackId="a" fill="#DC2626" radius={0} />
          <Bar dataKey="high"     stackId="a" fill="#EA580C" radius={0} />
          <Bar dataKey="medium"   stackId="a" fill="#D97706" radius={0} />
          <Bar dataKey="low"      stackId="a" fill="#0891B2" radius={0} />
          <Bar dataKey="info"     stackId="a" fill="#2563EB" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
