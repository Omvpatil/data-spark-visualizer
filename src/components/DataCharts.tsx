
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

interface DataChartsProps {
  data: Array<Record<string, any>>;
}

const DataCharts = ({ data }: DataChartsProps) => {
  const COLORS = ['#1a73e8', '#00a3bf', '#ffab00', '#ea4335', '#34a853', '#8e24aa', '#f6c026', '#ff6d01'];
  
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
        <TabsList>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="line">Line Chart</TabsTrigger>
          <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          <TabsTrigger value="scatter">Scatter Plot</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-wrap gap-2">
          {/* X-Axis selector (not needed for pie) */}
          <Select value={xAxis} onValueChange={setXAxis}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="X Axis" />
            </SelectTrigger>
            <SelectContent>
              {columns.map(column => (
                <SelectItem key={column} value={column}>{column}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Y-Axis selector (not needed for pie) */}
          <Select value={yAxis} onValueChange={setYAxis}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Y Axis" />
            </SelectTrigger>
            <SelectContent>
              {columns.map(column => (
                <SelectItem key={column} value={column}>{column}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Category selector (for pie chart) */}
          <Select value={categoryField} onValueChange={setCategoryField}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
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
        <CardContent>
          <div className="h-[400px] w-full">
            <TabsContent value="bar" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey={xAxis} 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={yAxis} fill="#1a73e8" name={yAxis} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="line" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey={xAxis} 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={yAxis} 
                    stroke="#00a3bf" 
                    name={yAxis}
                    dot={{ fill: '#00a3bf', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="pie" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} entries`, "Count"]} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="scatter" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey={xAxis} 
                    name={xAxis} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey={yAxis} 
                    name={yAxis} 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter 
                    name={`${xAxis} vs ${yAxis}`} 
                    data={data} 
                    fill="#ffab00"
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
