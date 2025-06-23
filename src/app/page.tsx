'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ResumeBuilder = dynamic(
  () => import('@/components/resume-builder').then((mod) => mod.ResumeBuilder),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen w-full flex-col bg-background">
        {/* Skeleton for AppHeader */}
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-8">
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-10 w-36" />
        </div>
        
        {/* Skeleton for main content */}
        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
            {/* Left Panel Skeleton */}
            <div className="overflow-y-auto p-4 sm:p-8">
                <div className="space-y-8">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
            {/* Right Panel Skeleton (hidden on mobile) */}
            <div className="overflow-y-auto bg-muted/30 p-4 sm:p-8 hidden md:block">
                 <Skeleton className="h-full w-full" />
            </div>
        </main>
      </div>
    ),
  }
);

export default function Home() {
  return <ResumeBuilder />;
}
