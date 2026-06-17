import React, { useState } from "react";
import Sidebar from "../tenant/Sidebar";
import TopNavBar from "../tenant/TopNavbar";

interface TenantLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function TenantLayout({
  children,
  title,
  subtitle,
}: TenantLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background font-body text-on-surface overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 w-full md:ml-64 min-h-screen flex flex-col overflow-y-auto">
        {/* PERHATIKAN BARIS INI: TopNavBar harus ditutup dengan /> */}
        <TopNavBar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Konten children diletakkan di luarnya TopNavBar */}
        <div className="px-4 md:px-8 py-6 md:py-8 max-w-[1280px] mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
