import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import NavDropdown from "../layout/NavDropdown"; // Sesuaikan path import-nya

interface TopNavBarProps {
  title: string;
  subtitle: string;
}

export default function TopNavBar({ title, subtitle }: TopNavBarProps) {
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
    <header className="w-full sticky top-0 z-40 backdrop-blur-md bg-surface/80 shadow-sm flex justify-between items-center px-8 py-4">
      <div>
        <h2 className="font-headline-sm text-2xl font-bold text-primary">
          {title}
        </h2>
        <p className="font-label-md text-sm text-on-surface-variant">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-surface-variant transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        {/* Wrapper untuk Dropdown agar bisa deteksi klik di luar */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 pl-4 border-l border-outline-variant cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
              {user.name.charAt(0).toUpperCase()}
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
