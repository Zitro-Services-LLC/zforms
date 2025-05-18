
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import GrowthChart from './GrowthChart';

interface GrowthData {
  name: string;
  contractors: number;
  customers: number;
}

interface DashboardTabsProps {
  growthData: GrowthData[];
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ growthData }) => {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <GrowthChart data={growthData} />
      </TabsContent>
      
      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Detailed analytics will be available here.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="reports">
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Report generation tools will be available here.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
