import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useAuth();

  const navItems = [
    { name: "Overview", icon: "dashboard", path: "/tenant/dashboard" },
    { name: "My Properties", icon: "home_work", path: "/tenant/properties" },
    { name: "Categories", icon: "category", path: "/tenant/categories" },
    { name: "Bookings", icon: "receipt_long", path: "/tenant/bookings" },
    { name: "Reviews", icon: "rate_review", path: "/tenant/reviews" },
    { name: "Settings", icon: "settings", path: "/tenant/settings" },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 z-50 bg-surface-container-low border-r border-outline-variant/30 flex flex-col p-4 gap-2">
      <div className="px-2 py-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white overflow-hidden">
            <span className="material-symbols-outlined">forest</span>
          </div>
          <div>
            <h1 className="font-headline-sm text-[16px] font-bold text-primary">
              Evergreen Escapes
            </h1>
            <p className="font-label-md text-[12px] text-on-surface-variant">
              Tenant Portal
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPath.includes(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
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
        <Link
          to="/tenant/support"
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-all group"
        >
          <span className="material-symbols-outlined text-xl group-hover:text-primary transition-colors">
            contact_support
          </span>
          <span className="font-label-md text-sm">Support</span>
        </Link>
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
  );
}
