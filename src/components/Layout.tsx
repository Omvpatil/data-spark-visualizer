
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { BarChart3, PieChart, LineChart, Upload, Home, Settings, FileText, BarChart } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

const Layout = ({ children, currentTab = "dashboard", onTabChange }: LayoutProps) => {
  const { toast } = useToast();

  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-datablue" />
            <span className="text-xl font-bold text-datablue">DataSpark</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => toast({ title: "Coming soon", description: "Settings will be available in a future update" })}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <Tabs defaultValue={currentTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid grid-cols-4 md:w-[400px]">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="visualize" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="hidden sm:inline">Visualize</span>
            </TabsTrigger>
            <TabsTrigger value="analyze" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Analyze</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-4">
            {currentTab === "dashboard" && children}
          </TabsContent>
          <TabsContent value="upload" className="space-y-4">
            {currentTab === "upload" && children}
          </TabsContent>
          <TabsContent value="visualize" className="space-y-4">
            {currentTab === "visualize" && children}
          </TabsContent>
          <TabsContent value="analyze" className="space-y-4">
            {currentTab === "analyze" && children}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 px-6">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© 2025 DataSpark. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <Link to="/" className="hover:text-foreground">About</Link>
            <Link to="/" className="hover:text-foreground">Help</Link>
            <Link to="/" className="hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
