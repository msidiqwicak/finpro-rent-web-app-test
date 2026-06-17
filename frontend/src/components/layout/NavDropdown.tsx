import React from "react";
import type { AuthUser } from "../../context/AuthContext";
import RoleBadge from "./RoleBadge";
import NavDropdownItem from "./NavDropDownItem";

interface NavDropdownProps {
  user: AuthUser;
  onLogout: () => void;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export default function NavDropdown({
  user,
  onLogout,
  onClose,
  onToast,
}: NavDropdownProps) {
  const isUser = user.role === "USER";
  const isTenant = user.role === "TENANT";

  return (
    <div
      onClick={onClose}
      // w-[calc(100vw-2rem)] menjamin dropdown tidak akan melebihi layar HP
      className="absolute top-[calc(100%+12px)] right-0 bg-white border border-outline-variant/50 rounded-2xl shadow-xl w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[240px] z-[100] overflow-hidden animate-fade-in origin-top-right"
    >
      {/* Header Info */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:py-4 bg-surface-container-lowest">
        <p className="font-body font-bold text-sm md:text-[15px] text-on-surface truncate">
          {user.name}
        </p>
        <RoleBadge role={user.role} />
      </div>

      <div className="h-px bg-outline-variant/30 my-1 md:my-1.5" />

      {/* Menu Navigasi Aktif */}
      {isUser && (
        <>
          <NavDropdownItem to="/profile" icon="person" label="My Profile" />
          <NavDropdownItem
            to="/bookings"
            icon="calendar_month"
            label="My Bookings"
          />
        </>
      )}

      {isTenant && (
        <>
          <NavDropdownItem
            to="/tenant/dashboard"
            icon="dashboard"
            label="Dashboard"
          />
          <NavDropdownItem
            to="/tenant/properties"
            icon="home_work"
            label="My Properties"
          />
          <NavDropdownItem
            to="/tenant/bookings"
            icon="receipt_long"
            label="Manage Bookings"
          />
        </>
      )}

      {/* Menu Terkunci (Disabled) */}
      {isTenant && (
        <NavDropdownItem
          icon="hotel"
          label="Book a Stay"
          badge="Guest only"
          isDisabled
          onClick={() =>
            onToast("This feature is only available for Guest accounts.")
          }
        />
      )}
      {isUser && (
        <NavDropdownItem
          icon="dashboard"
          label="Tenant Dashboard"
          badge="Tenant only"
          isDisabled
          onClick={() =>
            onToast("This feature is only available for Tenant accounts.")
          }
        />
      )}

      <div className="h-px bg-outline-variant/30 my-1 md:my-1.5" />

      {/* Menu Logout */}
      <NavDropdownItem
        icon="logout"
        label="Logout"
        isDanger
        onClick={onLogout}
      />
    </div>
  );
}
