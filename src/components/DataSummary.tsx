
import React, { useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface DataSummaryProps {
  data: Array<Record<string, any>>;
}

const DataSummary = ({ data }: DataSummaryProps) => {
  // Calculate summary statistics for numeric columns
  const summaryStats = useMemo(() => {
    if (data.length === 0) return {};
    
    const columns = Object.keys(data[0]);
    const stats: Record<string, any> = {};
    
    columns.forEach(column => {
      const values = data.map(row => {
        const val = row[column];
        return !isNaN(Number(val)) ? Number(val) : null;
      }).filter(val => val !== null);
      
      if (values.length > 0) {
        // Only calculate stats for numeric columns
        values.sort((a, b) => (a || 0) - (b || 0));
        
        const sum = values.reduce((acc, val) => acc + (val || 0), 0);
        const mean = sum / values.length;
        const min = values[0];
        const max = values[values.length - 1];
        
        // Calculate median
        const mid = Math.floor(values.length / 2);
        const median = values.length % 2 === 0
          ? ((values[mid - 1] || 0) + (values[mid] || 0)) / 2
          : values[mid] || 0;
        
        // Calculate standard deviation
        const squaredDiffs = values.map(val => Math.pow((val || 0) - mean, 2));
        const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length;
        const stdDev = Math.sqrt(variance);
        
        stats[column] = {
          count: values.length,
          mean: mean.toFixed(2),
          median: median.toFixed(2),
          min: min.toFixed(2),
          max: max.toFixed(2),
          stdDev: stdDev.toFixed(2)
        };
      }
    });
    
    return stats;
  }, [data]);
  
  // Calculate frequencies for categorical columns
  const categoricalStats = useMemo(() => {
    if (data.length === 0) return {};
    
    const columns = Object.keys(data[0]);
    const stats: Record<string, any> = {};
    
    columns.forEach(column => {
      // Check if the column is likely categorical (less than 15 unique values or non-numeric)
      const valuesMap: Record<string, number> = {};
      
      data.forEach(row => {
        const val = String(row[column] || '');
        valuesMap[val] = (valuesMap[val] || 0) + 1;
      });
      
      const uniqueValues = Object.keys(valuesMap);
      
      if (uniqueValues.length < 15 || uniqueValues.some(val => isNaN(Number(val)))) {
        // Sort by frequency
        const sortedFreq = Object.entries(valuesMap)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 5); // Take top 5
        
        stats[column] = {
          uniqueCount: uniqueValues.length,
          topValues: sortedFreq
        };
      }
    });
    
    return stats;
  }, [data]);

  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Upload data to generate summary statistics
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dataset Overview</CardTitle>
          <CardDescription>Summary information about your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat-card">
              <span className="text-muted-foreground text-sm">Rows</span>
              <span className="text-3xl font-bold">{data.length}</span>
            </div>
            <div className="stat-card">
              <span className="text-muted-foreground text-sm">Columns</span>
              <span className="text-3xl font-bold">{Object.keys(data[0]).length}</span>
            </div>
            <div className="stat-card">
              <span className="text-muted-foreground text-sm">Numeric Columns</span>
              <span className="text-3xl font-bold">{Object.keys(summaryStats).length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Numerical Statistics */}
      {Object.keys(summaryStats).length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Numerical Statistics</CardTitle>
            <CardDescription>Statistical summary of numeric fields</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full data-grid">
                <thead>
                  <tr>
                    <th>Column</th>
                    <th>Count</th>
                    <th>Mean</th>
                    <th>Median</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Std Dev</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(summaryStats).map(([column, stats]) => (
                    <tr key={column}>
                      <td className="font-medium">{column}</td>
                      <td>{stats.count}</td>
                      <td>{stats.mean}</td>
                      <td>{stats.median}</td>
                      <td>{stats.min}</td>
                      <td>{stats.max}</td>
                      <td>{stats.stdDev}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Categorical Statistics */}
      {Object.keys(categoricalStats).length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Categorical Data</CardTitle>
            <CardDescription>Frequency analysis of categorical fields</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(categoricalStats).map(([column, stats]) => (
                <div key={column} className="border rounded-md p-4">
                  <h4 className="font-semibold mb-2">{column}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {stats.uniqueCount} unique values
                  </p>
                  <div className="space-y-2">
                    {stats.topValues.map(([value, count]: [string, number], i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="truncate max-w-[150px]">{value || '(empty)'}</span>
                        <span className="font-medium">{count} ({((count / data.length) * 100).toFixed(1)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataSummary;
