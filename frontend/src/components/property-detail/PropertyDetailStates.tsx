import React from 'react';
import { Link } from 'react-router-dom';

export function LoadingSkeleton() {
  return (
    <main className="bg-surface-low min-h-screen">
      <div className="max-w-[1280px] mx-auto px-5 pt-6 pb-16 md:px-8 lg:px-16 animate-pulse">
        <div className="h-4 w-48 bg-surface-container-high rounded mb-6" />
        <div className="h-8 w-2/3 bg-surface-container-high rounded mb-3" />
        <div className="h-4 w-1/3 bg-surface-container-high rounded mb-8" />
        <div className="grid grid-cols-4 grid-rows-2 gap-1 rounded-2xl overflow-hidden mb-10" style={{ height: 460 }}>
          <div className="col-span-2 row-span-2 bg-surface-container-high" />
          <div className="bg-surface-container-high" />
          <div className="bg-surface-container-high" />
          <div className="bg-surface-container-high" />
          <div className="bg-surface-container-high" />
        </div>
        <div className="flex gap-10">
          <div className="flex-1 space-y-4">
            <div className="h-6 w-1/2 bg-surface-container-high rounded" />
            <div className="h-4 w-full bg-surface-container-high rounded" />
            <div className="h-4 w-3/4 bg-surface-container-high rounded" />
          </div>
          <div className="w-[380px] hidden lg:block">
            <div className="h-[400px] bg-surface-container-high rounded-2xl" />
          </div>
        </div>
      </div>
    </main>
  );
}

export function ErrorState({ message }: { message: string | null }) {
  return (
    <main className="bg-surface-low min-h-screen flex flex-col items-center justify-center gap-4">
      <span className="material-symbols-outlined text-[64px] text-outline">error_outline</span>
      <p className="text-on-surface-variant text-[16px] max-w-sm text-center">{message ?? 'Something went wrong.'}</p>
      <Link to="/explore" className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-[13px] font-bold">
        Back to Explore
      </Link>
    </main>
  );
}
