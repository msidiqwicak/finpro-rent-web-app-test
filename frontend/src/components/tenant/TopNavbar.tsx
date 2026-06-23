import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import NavDropdown from "../layout/NavDropdown"; // Sesuaikan path import-nya

interface TopNavBarProps {
  title: string;
  subtitle: string;
  onMenuClick?: () => void;
}

export default function TopNavBar({ title, subtitle, onMenuClick }: TopNavBarProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown jika klik di luar area
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
    <header className="w-full sticky top-0 z-40 backdrop-blur-md bg-surface/80 shadow-sm flex justify-between items-center px-4 lg:px-8 py-4">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-full hover:bg-surface-variant text-on-surface-variant flex items-center justify-center">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div>
          <h2 className="font-headline-sm text-xl lg:text-2xl font-bold text-primary">
            {title}
          </h2>
          <p className="font-label-md text-sm text-on-surface-variant">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">


        {/* Wrapper untuk Dropdown agar bisa deteksi klik di luar */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 pl-4 border-l border-outline-variant cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20 overflow-hidden">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
          </button>

          {isDropdownOpen && (
            <NavDropdown
              user={user}
              onLogout={() => {
                setIsDropdownOpen(false);
                logout();
              }}
              onClose={() => setIsDropdownOpen(false)}
              onToast={(msg) => alert(msg)} // Ganti dengan sistem toast kamu
            />
          )}
        </div>
      </div>
    </header>
  );
}
