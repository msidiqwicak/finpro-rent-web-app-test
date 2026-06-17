import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Tambahkan Interface untuk Props
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useAuth();

  const navItems = [
    { name: "Overview", icon: "dashboard", path: "/tenant/dashboard" },
    { name: "My Properties", icon: "home_work", path: "/tenant/properties" },
    { name: "Categories", icon: "category", path: "/tenant/categories" },
    { name: "Bookings", icon: "receipt_long", path: "/tenant/bookings" },
    { name: "Reviews", icon: "rate_review", path: "/tenant/reviews" },
    { name: "Report", icon: "report", path: "/tenant/report" },
    { name: "Calendar", icon: "calendar_month", path: "/tenant/calendar" },
  ];

  return (
    <>
      {/* 1. OVERLAY HITAM TRANSPARAN (Hanya muncul di Mobile saat Sidebar terbuka) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* 2. SIDEBAR UTAMA */}
      <aside
        className={`h-screen w-64 fixed left-0 top-0 z-50 bg-white border-r border-outline-variant/30 flex flex-col p-4 gap-2 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        <div className="px-2 py-4 mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white overflow-hidden shrink-0">
              <span className="material-symbols-outlined">forest</span>
            </div>
            <div>
              <h1 className="font-headline-sm text-[16px] font-bold text-primary truncate">
                Evergreen Escapes
              </h1>
              <p className="font-label-md text-[12px] text-on-surface-variant">
                Tenant Portal
              </p>
            </div>
          </div>

          {/* Tombol Close (X) hanya untuk Mobile */}
          <button
            onClick={onClose}
            className="md:hidden text-on-surface-variant hover:bg-surface-variant p-1 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
          {navItems.map((item) => {
            const isActive = currentPath.includes(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose} // Tutup sidebar otomatis saat menu diklik di HP
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive
                    ? "bg-secondary-container text-on-secondary-container font-bold"
                    : "text-on-surface-variant hover:bg-surface-variant/50"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-xl ${
                    !isActive && "group-hover:text-primary transition-colors"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-label-md text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-outline-variant/30 pt-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-error-container/20 hover:text-error 
               rounded-lg transition-all duration-200 ease-in-out active:scale-[0.98] active:opacity-80 group cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl transition-colors duration-200">
              logout
            </span>
            <span className="font-label-md text-sm transition-colors duration-200">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
