
import React, { Suspense } from 'react';
import DataAnalyzer from '@/components/DataAnalyzer';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy loading the DataAnalyzer component to improve initial load time on mobile
const Index = () => {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-full max-w-md space-y-4 p-4">
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-64 w-full rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
          </div>
        </div>
      </div>
    }>
      <div className="touch-manipulation">
        <DataAnalyzer />
      </div>
    </Suspense>
  );
};

export default Index;
