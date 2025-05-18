
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

interface GrowthData {
  name: string;
  contractors: number;
  customers: number;
}

interface GrowthChartProps {
  data: GrowthData[];
}

const GrowthChart: React.FC<GrowthChartProps> = ({ data }) => {
  // Chart config needed for the ChartContainer
  const chartConfig = {
    contractors: {
      label: 'Contractors',
      theme: {
        light: '#f59e0b',
        dark: '#f59e0b',
      },
    },
    customers: {
      label: 'Customers',
      theme: {
        light: '#0ea5e9',
        dark: '#0ea5e9',
      },
    },
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth Metrics</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer
          config={chartConfig}
          className="h-[350px]"
        >
          <LineChart
            width={500}
            height={300}
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="contractors" 
              stroke="#f59e0b" 
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="customers" 
              stroke="#0ea5e9" 
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default GrowthChart;
