import React from "react";
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
  return (
    <div className="flex min-h-screen bg-background font-body text-on-surface">
      {/* Sidebar sekarang mengambil fungsi logout sendiri via useAuth, jadi tidak perlu props lagi */}
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <TopNavBar title={title} subtitle={subtitle} />
        <div className="px-8 py-8 max-w-[1280px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
