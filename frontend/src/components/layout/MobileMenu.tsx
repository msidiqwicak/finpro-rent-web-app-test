import { Link } from "react-router-dom";

interface MobileMenuProps {
  user: any;
  isLoggedIn: boolean;
  isTenant: boolean;
  isUser: boolean;
  navItems: { name: string; path: string }[];
  locationPath: string;
  setMobileOpen: (open: boolean) => void;
  handleLogout: () => void;
  avatarUrl: string | null;
}

export default function MobileMenu({
  user,
  isLoggedIn,
  isTenant,
  isUser,
  navItems,
  locationPath,
  setMobileOpen,
  handleLogout,
  avatarUrl,
}: MobileMenuProps) {
  return (
    <nav className="md:hidden absolute top-full left-0 w-full bg-surface-white border-b border-outline-variant shadow-xl animate-fade-in z-40 max-h-[calc(100vh-72px)] overflow-y-auto">
      <div className="px-5 py-4 flex flex-col gap-1">
        {/* Info Pengguna Singkat di Mobile */}
        {isLoggedIn && (
          <div className="flex items-center gap-3 pb-4 mb-2 border-b border-surface-high">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.name}
                className="w-12 h-12 rounded-full border border-outline-variant object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="font-bold text-on-surface text-base truncate">
                {user.name}
              </p>
              <p className="text-xs text-on-surface-variant truncate uppercase tracking-wider">
                {user.role}
              </p>
            </div>
          </div>
        )}

        {/* Menu Navigasi */}
        {!isTenant &&
          navItems.map((item) => {
            const isActive =
              locationPath === item.path ||
              (item.path !== "/" && locationPath.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 px-2 rounded-lg text-[15px] ${
                  isActive
                    ? "font-bold text-primary bg-primary/5"
                    : "font-medium text-on-surface hover:bg-surface-low"
                }`}
              >
                {item.name}
              </Link>
            );
          })}



        <hr className="border-surface-high my-2" />

        {/* Menu Profil / Role */}
        {isUser && (
          <Link
            to="/profile"
            onClick={() => setMobileOpen(false)}
            className="block py-3 px-2 rounded-lg text-[15px] font-semibold text-on-surface hover:bg-surface-low"
          >
            My Profile
          </Link>
        )}
        {isTenant && (
          <Link
            to="/tenant/dashboard"
            onClick={() => setMobileOpen(false)}
            className="block py-3 px-2 rounded-lg text-[15px] font-semibold text-on-surface hover:bg-surface-low"
          >
            Tenant Dashboard
          </Link>
        )}

        {/* Auth Menu */}
        {!isLoggedIn ? (
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="block mt-4 py-3 text-center text-[15px] font-bold bg-primary text-white rounded-xl shadow-sm hover:opacity-90 transition-opacity"
          >
            Sign In
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="text-left py-3 px-2 rounded-lg text-[15px] font-bold text-error hover:bg-error-container/20 w-full transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
