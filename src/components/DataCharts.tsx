
import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface DataChartsProps {
  data: Array<Record<string, any>>;
}

const DataCharts = ({ data }: DataChartsProps) => {
  const COLORS = ['#1a73e8', '#00a3bf', '#ffab00', '#ea4335', '#34a853', '#8e24aa', '#f6c026', '#ff6d01'];
  const isMobile = useIsMobile();
  
  // Get numeric columns from data
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    
    return Object.keys(data[0]).filter(key => {
      // Check if the column is numeric for at least 80% of the rows
      const numericCount = data.filter(row => 
        row[key] !== null && 
        row[key] !== undefined && 
        !isNaN(Number(row[key]))
      ).length;
      
      return numericCount / data.length >= 0.8;
    });
  }, [data]);
  
  // Get categorical columns
  const categoricalColumns = useMemo(() => {
    if (data.length === 0) return [];
    
    return Object.keys(data[0]).filter(key => !columns.includes(key));
  }, [data, columns]);
  
  const [xAxis, setXAxis] = useState<string>(columns[0] || '');
  const [yAxis, setYAxis] = useState<string>(columns[1] || (columns[0] ? columns[0] : ''));
  const [categoryField, setCategoryField] = useState<string>(categoricalColumns[0] || '');
  
  // Process data for pie chart
  const pieData = useMemo(() => {
    if (!categoryField || data.length === 0) return [];
    
    const categoryCount: Record<string, number> = {};
    
    data.forEach(item => {
      const category = String(item[categoryField] || 'Unknown');
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    return Object.keys(categoryCount).map(category => ({
      name: category,
      value: categoryCount[category]
    })).slice(0, 8); // Limit to 8 categories for better visualization
  }, [data, categoryField]);
  
  // Check if we have valid data to display charts
  const hasValidData = data.length > 0 && columns.length > 0;

  // Mobile-optimized chart dimensions - Fixed height is crucial for Android rendering
  const chartHeight = 300; // Fixed height instead of dynamic
  const marginConfig = isMobile ? 
    { top: 15, right: 10, left: 0, bottom: 40 } : 
    { top: 20, right: 30, left: 20, bottom: 60 };

  // Mobile-optimized axis configuration
  const xAxisConfig = {
    dataKey: xAxis,
    angle: isMobile ? -45 : -45,
    textAnchor: "end",
    height: isMobile ? 50 : 70,
    tick: { fontSize: isMobile ? 10 : 12 },
    interval: isMobile ? 1 : 0
  };

  // Mobile-optimized tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="bg-background/95 backdrop-blur-sm p-2 rounded-md border border-border shadow-md">
        <p className="text-xs font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  };

  if (!hasValidData) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <CardContent>
          <p className="text-center text-muted-foreground">
            Upload data to generate visualizations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="bar" className="w-full">
      <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-4">
        <TabsList className="overflow-x-auto pb-1">
          <TabsTrigger value="bar" className="min-w-[70px]">Bar</TabsTrigger>
          <TabsTrigger value="line" className="min-w-[70px]">Line</TabsTrigger>
          <TabsTrigger value="pie" className="min-w-[70px]">Pie</TabsTrigger>
          <TabsTrigger value="scatter" className="min-w-[70px]">Scatter</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-wrap gap-2">
          <Select value={xAxis} onValueChange={setXAxis}>
            <SelectTrigger className="w-[100px] md:w-[120px]">
              <SelectValue placeholder="X Axis" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {columns.map(column => (
                <SelectItem key={column} value={column}>{column}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={yAxis} onValueChange={setYAxis}>
            <SelectTrigger className="w-[100px] md:w-[120px]">
              <SelectValue placeholder="Y Axis" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {columns.map(column => (
                <SelectItem key={column} value={column}>{column}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={categoryField} onValueChange={setCategoryField}>
            <SelectTrigger className="w-[100px] md:w-[120px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {categoricalColumns.map(column => (
                <SelectItem key={column} value={column}>{column}</SelectItem>
              ))}
              {categoricalColumns.length === 0 && columns.map(column => (
                <SelectItem key={column} value={column}>{column}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle>Data Visualization</CardTitle>
          <CardDescription>
            Interactive charts to explore your data
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 md:p-4">
          <div style={{ width: '100%', height: `${chartHeight}px` }} className="touch-manipulation">
            <TabsContent value="bar" className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={marginConfig} barSize={isMobile ? 15 : 20}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.7} />
                  <XAxis {...xAxisConfig} />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 30 : 40} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12, paddingTop: 8 }} />
                  <Bar dataKey={yAxis} fill="#1a73e8" name={yAxis} animationDuration={500} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="line" className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={marginConfig}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.7} />
                  <XAxis {...xAxisConfig} />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 30 : 40} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12, paddingTop: 8 }} />
                  <Line 
                    type="monotone" 
                    dataKey={yAxis} 
                    stroke="#00a3bf" 
                    name={yAxis}
                    dot={{ fill: '#00a3bf', strokeWidth: 2, r: isMobile ? 2 : 4 }}
                    activeDot={{ r: isMobile ? 4 : 6 }}
                    animationDuration={500}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="pie" className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={isMobile ? { top: 5, right: 5, left: 5, bottom: 5 } : { top: 20, right: 20, left: 20, bottom: 20 }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={isMobile ? 80 : 120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => 
                      isMobile 
                        ? `${percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}` 
                        : `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    animationDuration={500}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} entries`, "Count"]} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" 
                    wrapperStyle={{ 
                      fontSize: isMobile ? 9 : 12, 
                      paddingTop: 8,
                      width: '100%',
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }} />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="scatter" className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={marginConfig}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.7} />
                  <XAxis 
                    type="number" 
                    dataKey={xAxis} 
                    name={xAxis} 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    tickCount={isMobile ? 5 : 10}
                  />
                  <YAxis 
                    type="number" 
                    dataKey={yAxis} 
                    name={yAxis} 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    tickCount={isMobile ? 5 : 10}
                    width={isMobile ? 30 : 40}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12, paddingTop: 8 }} />
                  <Scatter 
                    name={`${xAxis} vs ${yAxis}`} 
                    data={data} 
                    fill="#ffab00"
                    shape="circle"
                    animationDuration={500}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </TabsContent>
          </div>
        </CardContent>
      </Card>
    </Tabs>
  );
};

export default DataCharts;
