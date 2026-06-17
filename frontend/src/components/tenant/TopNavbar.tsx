import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import NavDropdown from "../layout/NavDropdown"; // Sesuaikan path import-nya

interface TopNavBarProps {
  title: string;
  subtitle: string;
  onMenuClick?: () => void; // Prop baru untuk tombol hamburger
}

export default function TopNavBar({
  title,
  subtitle,
  onMenuClick,
}: TopNavBarProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <header className="w-full sticky top-0 z-40 backdrop-blur-md bg-surface/80 shadow-sm flex justify-between items-center px-4 md:px-8 py-4">
      {/* Tambahan Tombol Hamburger di samping Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div>
          <h2 className="font-headline-sm text-xl md:text-2xl font-bold text-primary truncate">
            {title}
          </h2>
          <p className="font-label-md text-xs md:text-sm text-on-surface-variant">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 rounded-full hover:bg-surface-variant transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 pl-2 md:pl-4 border-l border-outline-variant cursor-pointer"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2">
              <NavDropdown
                user={user}
                onLogout={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
                onClose={() => setIsDropdownOpen(false)}
                onToast={(msg) => alert(msg)}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
