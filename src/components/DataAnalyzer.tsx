
import React, { useState } from 'react';
import Layout from "./Layout";
import FileUploader from "./FileUploader";
import DataTable from "./DataTable";
import DataCharts from "./DataCharts";
import DataSummary from "./DataSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DownloadIcon, TableIcon, BarChart, FileText, HeartPulse } from "lucide-react";

// Sample data for initial state (will be replaced when user uploads)
const sampleData = [
  { month: "Jan", sales: 100, profit: 20, customers: 5 },
  { month: "Feb", sales: 120, profit: 25, customers: 7 },
  { month: "Mar", sales: 150, profit: 30, customers: 10 },
  { month: "Apr", sales: 80, profit: 10, customers: 4 },
  { month: "May", sales: 200, profit: 45, customers: 15 },
  { month: "Jun", sales: 220, profit: 50, customers: 17 },
  { month: "Jul", sales: 180, profit: 40, customers: 12 },
  { month: "Aug", sales: 250, profit: 60, customers: 20 },
  { month: "Sep", sales: 300, profit: 70, customers: 25 },
  { month: "Oct", sales: 280, profit: 65, customers: 22 },
  { month: "Nov", sales: 350, profit: 90, customers: 30 },
  { month: "Dec", sales: 400, profit: 100, customers: 35 },
];

const DataAnalyzer = () => {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [data, setData] = useState<Array<Record<string, any>>>(sampleData);
  const [hasUserUploaded, setHasUserUploaded] = useState(false);

  const handleDataLoaded = (newData: Array<Record<string, any>>) => {
    setData(newData);
    setHasUserUploaded(true);
    setCurrentTab("visualize");
  };

  const handleDownloadCSV = () => {
    if (data.length === 0) return;
    
    // Convert data to CSV format
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : String(value)
      ).join(',')
    );
    
    const csvContent = `${headers}\n${rows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    // Create a link to download the file
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'data_export.csv');
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="stat-card animate-fade-in card-hover">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-muted-foreground text-sm">Total Rows</h3>
                    <p className="text-2xl font-bold">{data.length}</p>
                  </div>
                  <TableIcon className="h-8 w-8 text-datablue opacity-80" />
                </div>
              </Card>
              
              <Card className="stat-card animate-fade-in card-hover" style={{ animationDelay: "100ms" }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-muted-foreground text-sm">Total Columns</h3>
                    <p className="text-2xl font-bold">{data.length > 0 ? Object.keys(data[0]).length : 0}</p>
                  </div>
                  <BarChart className="h-8 w-8 text-datateal opacity-80" />
                </div>
              </Card>
              
              <Card className="stat-card animate-fade-in card-hover" style={{ animationDelay: "200ms" }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-muted-foreground text-sm">Data Source</h3>
                    <p className="text-2xl font-bold">{hasUserUploaded ? "User Upload" : "Sample"}</p>
                  </div>
                  <FileText className="h-8 w-8 text-dataaccent opacity-80" />
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="animate-fade-in" style={{ animationDelay: "300ms" }}>
                <CardHeader>
                  <CardTitle>Data Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 overflow-y-auto">
                    <DataTable data={data.slice(0, 5)} />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button variant="outline" onClick={() => setCurrentTab("upload")} className="mx-2">
                      Upload Your Data
                    </Button>
                    <Button onClick={() => setCurrentTab("visualize")} className="mx-2">
                      View Visualizations
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in" style={{ animationDelay: "400ms" }}>
                <CardHeader>
                  <CardTitle>Quick Chart</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <DataCharts data={data} />
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case "upload":
        return <FileUploader onDataLoaded={handleDataLoaded} />;
      
      case "visualize":
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleDownloadCSV} className="flex items-center gap-2">
                <DownloadIcon className="h-4 w-4" />
                Export Data
              </Button>
            </div>
            
            <Tabs defaultValue="charts" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="charts" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  Charts
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-2">
                  <TableIcon className="h-4 w-4" />
                  Data Table
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4" />
                  Summary
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="charts" className="animate-fade-in">
                <DataCharts data={data} />
              </TabsContent>
              
              <TabsContent value="table" className="animate-fade-in">
                <DataTable data={data} />
              </TabsContent>
              
              <TabsContent value="summary" className="animate-fade-in">
                <DataSummary data={data} />
              </TabsContent>
            </Tabs>
          </div>
        );
      
      case "analyze":
        return (
          <div className="space-y-6">
            <DataSummary data={data} />
          </div>
        );
      
      default:
        return <div>Select a tab to get started</div>;
    }
  };

  return (
    <Layout currentTab={currentTab} onTabChange={setCurrentTab}>
      {renderContent()}
    </Layout>
  );
};

export default DataAnalyzer;
