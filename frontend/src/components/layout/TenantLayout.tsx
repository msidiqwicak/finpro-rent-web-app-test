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
    <div className="flex min-h-screen bg-background font-body text-on-surface relative">
      {/* Sidebar sekarang mengambil fungsi logout sendiri via useAuth, dan menerima props responsive */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Overlay background saat menu terbuka di HP */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 lg:ml-64 min-h-screen w-full flex flex-col transition-all duration-300">
        <TopNavBar title={title} subtitle={subtitle} onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="px-4 lg:px-8 py-8 w-full max-w-[1280px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
