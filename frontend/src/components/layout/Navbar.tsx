import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavDropdown from "./NavDropdown";

function Toast({ msg }: { msg: string }) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 bg-primary-container text-on-primary text-[14px] font-medium font-body px-5 py-3 rounded-xl shadow-[0_8px_24px_rgba(6,27,14,0.25)] max-w-[90vw]"
    >
      <span className="material-symbols-outlined text-[18px] shrink-0">
        info
      </span>
      {msg}
    </div>
  );
}

export default function Navbar() {
  const [open,        setOpen]     = useState(false);
  const [mobileOpen,  setMobileOpen] = useState(false);
  const [toast,       setToast]    = useState<string | null>(null);
  const [avatarUrl,   setAvatarUrl] = useState<string | null>(null);
  const { user, login, logout }    = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();
  const dropdownRef  = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Sync avatar from API when user logs in or token changes
  useEffect(() => {
    if (!user?.token) return;
    fetch('http://localhost:8000/api/users/profile', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        const url = d?.data?.avatar_url ?? null;
        setAvatarUrl(url);
        if (url !== user.avatar_url) login({ ...user, avatar_url: url });
      })
      .catch(() => {});
  }, [user?.token]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    showToast("You have successfully logged out.");
  };

  const isTenant = user?.role === "TENANT";
  const isUser = user?.role === "USER";
  const isLoggedIn = !!user;

  // Array untuk menu navigasi utama
  const navItems = [
    { name: "Explore", path: "/explore" },
    ...(isLoggedIn ? [
      { name: "Bookings", path: "/bookings" },
      { name: "Favorites", path: "/favorites" },
    ] : []),
  ];

  // =========================================================
  // LOGIC UNTUK CHECKOUT ISOLATION (NAVBAR MINIMALIS)
  // =========================================================
  const isCheckoutPhase =
    location.pathname.startsWith("/checkout") ||
    location.pathname.startsWith("/payment") ||
    location.pathname.startsWith("/order");

  if (isCheckoutPhase) {
    return (
      <>
        {toast && <Toast msg={toast} />}
        <header className="bg-surface/80 top-0 sticky backdrop-blur-md shadow-sm flex justify-between items-center w-full px-6 md:px-16 h-[72px] z-50 border-b border-outline-variant/30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="material-symbols-outlined text-primary cursor-pointer hover:bg-surface-container-high transition-colors p-2 rounded-full border-none bg-transparent flex items-center justify-center"
            >
              arrow_back
            </button>
            <div className="font-display font-bold text-xl text-primary">
              Finpro Escapes
            </div>
          </div>
          {/* Sisi kanan dibiarkan kosong agar user fokus pada transaksi */}
        </header>
      </>
    );
  }
  // =========================================================

  return (
    <>
      {toast && <Toast msg={toast} />}

      <header className="sticky top-0 z-50 h-[72px] bg-surface/90 backdrop-blur-md border-b border-outline-variant shadow-[0_1px_3px_rgba(6,27,14,0.08)] w-full">
        <div className="flex items-center justify-between h-full max-w-[1280px] mx-auto px-5">
          {/* Bagian Kiri: Logo */}
          <Link
            to="/"
            className="font-display font-bold text-xl text-primary flex items-center gap-2"
          >
            Finpro Escapes
          </Link>

          {/* Bagian Tengah: Desktop Navigation */}
          {!isTenant && (
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/" &&
                    location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`text-[15px] font-body transition-colors ${
                      isActive
                        ? "font-bold text-primary"
                        : "font-medium text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Bagian Kanan: Actions & Profile */}
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <button
                aria-label="Notifications"
                title="Notifications"
                className="hidden md:flex w-10 h-10 rounded-full border border-outline-variant bg-transparent items-center justify-center text-primary hover:bg-surface-low transition-colors cursor-pointer relative"
              >
                <span className="material-symbols-outlined text-[22px]">
                  notifications
                </span>
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-surface-white"></span>
              </button>
            )}

            {!isLoggedIn ? (
              <Link
                to="/login"
                aria-label="Login"
                title="Login or Register"
                className="w-10 h-10 rounded-full border border-outline-variant text-primary bg-transparent flex items-center justify-center hover:bg-surface-low transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">
                  person
                </span>
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  aria-label="Profile menu"
                  onClick={() => setOpen((o) => !o)}
                  title={`Logged in as ${user.name} (${user.role})`}
                  className="w-10 h-10 rounded-full border-2 border-primary bg-transparent flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer overflow-hidden"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[22px] text-primary">
                      account_circle
                    </span>
                  )}
                </button>
                {open && (
                  <NavDropdown
                    user={user}
                    onLogout={handleLogout}
                    onClose={() => setOpen(false)}
                    onToast={showToast}
                  />
                )}
              </div>
            )}

            {/* Hamburger Menu (Mobile) */}
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((o) => !o)}
              className="flex md:hidden w-10 h-10 rounded-full border border-outline-variant bg-transparent items-center justify-center text-primary hover:bg-surface-low transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <nav className="md:hidden bg-surface-white border-t border-outline-variant py-2 shadow-md">
            <div className="max-w-[1280px] mx-auto px-5 flex flex-col">
              {!isTenant && (
                <div className="py-2 border-b border-surface-high mb-2 flex flex-col gap-1">
                  {navItems.map((item) => {
                    const isActive =
                      location.pathname === item.path ||
                      (item.path !== "/" &&
                        location.pathname.startsWith(item.path));
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`block py-3 text-[15px] ${
                          isActive
                            ? "font-bold text-primary"
                            : "font-medium text-on-surface-variant"
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}

              {isLoggedIn && (
                <Link
                  to="/notifications"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-[15px] font-medium text-on-surface-variant flex items-center justify-between border-b border-surface-high"
                >
                  <span>Notifications</span>
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    New
                  </span>
                </Link>
              )}

              {isUser && (
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-[14px] font-semibold text-on-surface border-b border-surface-high"
                >
                  My Profile
                </Link>
              )}
              {isTenant && (
                <Link
                  to="/tenant/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-[14px] font-semibold text-on-surface border-b border-surface-high"
                >
                  Tenant Dashboard
                </Link>
              )}

              {!isLoggedIn && (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-[14px] font-bold text-primary"
                >
                  Login / Register
                </Link>
              )}
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="text-left py-3 text-[14px] font-bold text-red-600 bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
