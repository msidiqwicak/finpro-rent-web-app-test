import { Link } from 'react-router-dom';
import type { AuthUser } from '../../context/AuthContext';

interface NavDropdownProps {
  user:     AuthUser;
  onLogout: () => void;
  onClose:  () => void;
  onToast:  (msg: string) => void;
}

function DropdownItem({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <Link to={to}
      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold font-body text-on-surface hover:bg-surface-low transition-colors duration-150"
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      {label}
    </Link>
  );
}


function RoleBadge({ role }: { role: string }) {
  const isUser = role === 'USER';
  return (
    <span className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full ${isUser ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-fixed text-on-primary-fixed'}`}>
      {role}
    </span>
  );
}

export default function NavDropdown({ user, onLogout, onClose, onToast }: NavDropdownProps) {
  const isUser   = user.role === 'USER';
  const isTenant = user.role === 'TENANT';

  return (
    <div onClick={onClose}
      className="absolute top-[calc(100%+8px)] right-0 bg-surface-white border border-outline-variant rounded-2xl shadow-[0_8px_32px_rgba(6,27,14,0.15)] min-w-[220px] z-[100] overflow-hidden animate-[fadeIn_0.2s_ease]"
    >
      <div className="flex items-center justify-between gap-2 px-4 py-3 bg-surface-low">
        <p className="font-body font-bold text-[14px] text-on-surface truncate">{user.name}</p>
        <RoleBadge role={user.role} />
      </div>
      <div className="h-px bg-outline-variant my-1" />

      {isUser   && <><DropdownItem to="/profile"  icon="person"        label="My Profile" /><DropdownItem to="/bookings" icon="calendar_month" label="My Bookings" /></>}
      {isTenant && <><DropdownItem to="/tenant/dashboard"  icon="dashboard"   label="Dashboard" /><DropdownItem to="/tenant/properties" icon="home_work" label="My Properties" /><DropdownItem to="/tenant/bookings" icon="receipt_long" label="Manage Bookings" /></>}



      <div className="h-px bg-outline-variant my-1" />
      <button onClick={onLogout}
        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] font-semibold font-body text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer border-none bg-transparent text-left"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>Logout
      </button>
    </div>
  );
}
