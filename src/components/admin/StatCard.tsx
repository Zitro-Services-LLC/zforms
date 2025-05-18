
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  change?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, change }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-amber-100 rounded-full text-amber-600">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
        {change !== undefined && (
          <div className={`flex items-center pt-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
            <span>{Math.abs(change)}% from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
