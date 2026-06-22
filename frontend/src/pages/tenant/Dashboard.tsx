import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TenantLayout from "../../components/layout/TenantLayout";
import api from "../../api/axiosConfig";

import WelcomeHeader from "../../components/tenant/dashboard/WelcomeHeader";
import KeyMetrics from "../../components/tenant/dashboard/KeyMetrics";
import RevenueChart from "../../components/tenant/dashboard/RevenueChart";
import UpcomingCheckins from "../../components/tenant/dashboard/UpcomingCheckins";
import TopPerformer from "../../components/tenant/dashboard/TopPerformer";

// ── TYPES ────────────────────────────────────────────────────────
export interface DashboardStats {
  metrics: {
    totalRevenue: number;
    revenueGrowth: number;
    activeBookings: number;
    occupancy: number;
    averageRating: number;
  };
  chartData: Array<{
    month: string;
    height: string;
    label: string;
    active?: boolean;
  }>;
  upcomingCheckins: Array<{
    id: string;
    name: string;
    property: string;
    date: string;
    time: string;
    img: string;
    bg: string;
  }>;
  topProperty: {
    name: string;
    location: string;
    earnings: number;
    occupancy: number;
    image: string;
    ecoFriendly: boolean;
  } | null; // Gunakan null jika tidak ada property sama sekali
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/tenant/dashboard-stats");
        setStats(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
        // Jika gagal, pastikan state diset null (bukan data dummy lagi)
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <TenantLayout
      title="Dashboard Overview"
      subtitle="Monitor your property performance and summary"
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-secondary gap-4">
          <span className="material-symbols-outlined animate-spin text-5xl">
            sync
          </span>
          <p className="text-on-surface-variant font-label-md animate-pulse">
            Memuat data properti...
          </p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <WelcomeHeader
            currentDate={currentDate}
            tenantName={user?.name || "Tenant"}
            onAddProperty={() => navigate("/tenant/properties")}
          />

          <KeyMetrics metrics={stats?.metrics} />

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <RevenueChart data={stats?.chartData} />
            <UpcomingCheckins
              checkins={stats?.upcomingCheckins}
              onViewAllActivity={() => navigate("/tenant/bookings")}
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {stats?.topProperty ? (
              <TopPerformer property={stats?.topProperty} />
            ) : (
              // Empty State untuk Top Performer jika datanya tidak ada
              <div className="lg:col-span-1 flex flex-col items-center justify-center p-8 bg-surface-container-lowest rounded-[2.5rem] border-2 border-dashed border-outline-variant text-on-surface-variant h-full min-h-[300px]">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
                  hotel_class
                </span>
                <p className="font-label-md text-center">
                  Belum ada properti unggulan
                </p>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => navigate("/tenant/properties")}
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
