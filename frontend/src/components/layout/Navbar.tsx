import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavDropdown from "./NavDropdown";
import Toast from "./Toast";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Close profile dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  // Sync avatar
  useEffect(() => {
    if (!user?.token) return;
    fetch("http://localhost:8000/api/users/profile", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        const url = d?.data?.avatar_url ?? null;
        setAvatarUrl(url);
        if (url !== user.avatar_url) login({ ...user, avatar_url: url });
      })
      .catch(() => {});
  }, [user?.token, login, user]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
    showToast("You have successfully logged out.");
  };

  const isTenant = user?.role === "TENANT";
  const isUser = user?.role === "USER";
  const isLoggedIn = !!user;
  const navItems = [
    { name: "Explore", path: "/explore" },
    { name: "Our Mission", path: "/sustainability" },
    ...(isLoggedIn
      ? [
          { name: "Bookings", path: "/bookings" },
        ]
      : []),
  ];
  // Logic Checkout Isolation
  const isCheckoutPhase =
    location.pathname.startsWith("/checkout") ||
    location.pathname.startsWith("/payment") ||
    location.pathname.startsWith("/order");

  const isHome = location.pathname === "/";

  return (
    <>
      {toast && <Toast msg={toast} />}

      <header className="sticky top-0 z-50 h-[72px] bg-surface/95 backdrop-blur-md border-b border-outline-variant/50 shadow-sm w-full">
        <div className="flex items-center justify-between h-full w-full max-w-[1280px] px-4 md:px-5 mx-auto relative">
          {/* Kiri: Logo */}
          <div className="flex items-center gap-1 sm:gap-2 z-20">
            {!isHome ? (
              <button
                onClick={() => navigate(-1)}
                aria-label="Go back"
                className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:bg-surface-container-high transition-colors w-10 h-10 shrink-0 rounded-full border-none bg-transparent flex items-center justify-center -ml-2"
              >
                arrow_back
              </button>
            ) : (
              <div className="w-10 h-10 -ml-2 shrink-0 invisible pointer-events-none" />
            )}
            <Link
              to="/"
              className="flex items-center gap-2 no-underline shrink-0"
            >
              <span className="material-symbols-outlined text-primary text-[26px] [font-variation-settings:'FILL'_1]">
                forest
              </span>
              <span className="font-display font-bold text-[18px] text-primary hidden sm:block">
                Evergreen Escapes
              </span>
            </Link>
          </div>

          {/* Tengah: Desktop Nav */}
          {!isTenant && !isCheckoutPhase && (
            <nav className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 -translate-x-1/2 w-fit z-10">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/" &&
                    location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`text-[15px] font-body transition-colors ${isActive ? "font-bold text-primary" : "font-medium text-on-surface-variant hover:text-primary"}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Kanan: Desktop Profile & Mobile Hamburger */}
          <div className="flex items-center gap-3 z-20">
            <div className="hidden md:flex items-center gap-3">

              {!isLoggedIn ? (
                <Link
                  to="/login"
                  className="w-10 h-10 rounded-full border border-outline-variant text-primary bg-transparent flex items-center justify-center hover:bg-surface-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    person
                  </span>
                </Link>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setOpen((o) => !o)}
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
            </div>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="flex md:hidden w-10 h-10 rounded-full bg-surface-low items-center justify-center text-primary hover:bg-surface-container transition-colors cursor-pointer border-none"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <MobileMenu
            user={user}
            isLoggedIn={isLoggedIn}
            isTenant={isTenant}
            isUser={isUser}
            navItems={navItems}
            locationPath={location.pathname}
            setMobileOpen={setMobileOpen}
            handleLogout={handleLogout}
            avatarUrl={avatarUrl}
          />
        )}
      </header>
    </>
  );
}
