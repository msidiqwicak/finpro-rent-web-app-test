import { Link } from "react-router-dom";

interface NavDropdownItemProps {
  to?: string;
  icon: string;
  label: string;
  isDisabled?: boolean;
  isDanger?: boolean;
  badge?: string;
  onClick?: () => void;
}

export default function NavDropdownItem({
  to,
  icon,
  label,
  isDisabled,
  isDanger,
  badge,
  onClick,
}: NavDropdownItemProps) {
  // Base class: Padding lebih besar di mobile (py-3) dibanding desktop (md:py-2.5)
  const baseClass =
    "flex items-center gap-3 px-4 py-3 md:py-2.5 text-sm md:text-[13px] font-semibold font-body transition-colors duration-150 w-full text-left border-none bg-transparent group";

  // Kondisi 1: Menu Dinonaktifkan (Disabled)
  if (isDisabled) {
    return (
      <button
        onClick={onClick}
        className={`${baseClass} text-on-surface opacity-45 cursor-not-allowed`}
      >
        <span className="material-symbols-outlined text-[18px] md:text-[20px]">
          {icon}
        </span>
        {label}
        {badge && (
          <span className="ml-auto text-[9px] md:text-[10px] font-bold bg-surface-high text-on-surface-variant px-1.5 py-0.5 rounded shrink-0">
            {badge}
          </span>
        )}
      </button>
    );
  }

  // Kondisi 2: Menu sebagai Navigasi Link
  if (to) {
    return (
      <Link
        to={to}
        className={`${baseClass} text-on-surface hover:bg-surface-low`}
      >
        <span className="material-symbols-outlined text-[18px] md:text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">
          {icon}
        </span>
        {label}
      </Link>
    );
  }

  // Kondisi 3: Menu sebagai Tombol (seperti Logout)
  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${isDanger ? "text-error hover:bg-error-container/20" : "text-on-surface hover:bg-surface-low"} cursor-pointer`}
    >
      <span
        className={`material-symbols-outlined text-[18px] md:text-[20px] ${isDanger ? "text-error" : "text-on-surface-variant"}`}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}
