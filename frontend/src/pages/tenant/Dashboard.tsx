import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TenantLayout from "../../components/layout/TenantLayout";

// Child Components
import WelcomeHeader from "../../components/tenant/dashboard/WelcomeHeader";
import KeyMetrics from "../../components/tenant/dashboard/KeyMetrics";
import RevenueChart from "../../components/tenant/dashboard/RevenueChart";
import UpcomingCheckins from "../../components/tenant/dashboard/UpcomingCheckins";
import TopPerformer from "../../components/tenant/dashboard/TopPerformer";
import PromoBanner from "../../components/tenant/dashboard/PromoBanner";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mendapatkan tanggal hari ini
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <TenantLayout
      title="Dashboard Overview"
      subtitle="Pantau performa dan ringkasan properti Anda"
    >
      <div className="space-y-8 animate-in fade-in duration-500">
        
        <WelcomeHeader 
          currentDate={currentDate} 
          tenantName={user?.name || "Tenant"}
          onAddProperty={() => navigate('/tenant/properties')} 
        />
        
        <KeyMetrics />

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RevenueChart />
          <UpcomingCheckins onViewAllActivity={() => navigate('/tenant/bookings')} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <TopPerformer />
          <PromoBanner />
        </section>

      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate('/tenant/properties')}
        title="Add new property"
        className="fixed bottom-8 right-8 w-16 h-16 bg-secondary text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-50 hover:bg-secondary-container hover:text-on-secondary-container group cursor-pointer border-none"
      >
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform">
          add
        </span>
      </button>
    </TenantLayout>
  );
}
