import { Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface LineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
}

export const LineChart = ({ data, xKey, yKey, color = 'text-blue-400' }: LineChartProps) => {
  const colorValue = color.replace('text-', '').replace('-400', '');
  
  return (
    <ResponsiveContainer width="100%" height={120}>
      <RechartsLineChart data={data}>
        <XAxis
          dataKey={xKey}
          hide
          padding={{ left: 10, right: 10 }}
        />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: 'none',
            borderRadius: '0.5rem',
            color: '#fff',
          }}
          labelStyle={{ color: '#94a3b8' }}
        />
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={`var(--${colorValue})`}
          strokeWidth={2}
          dot={false}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};