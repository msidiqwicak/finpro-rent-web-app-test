import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavLinks } from './NavLinks';
import NavDropdown from './NavDropdown';

function Toast({ msg }: { msg: string }) {
  return (
    <div role="alert" aria-live="polite"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 bg-primary-container text-on-primary text-[14px] font-medium font-body px-5 py-3 rounded-xl shadow-[0_8px_24px_rgba(6,27,14,0.25)] max-w-[90vw]"
    >
      <span className="material-symbols-outlined text-[18px] shrink-0">info</span>
      {msg}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen]   = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();

  const showToast    = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const handleLogout = () => { logout(); navigate('/'); showToast('You have successfully logged out.'); };

  const handleHostClick = (e: React.MouseEvent) => {
    if (!user)                  { e.preventDefault(); showToast('Please login first to register as a Host.'); return; }
    if (user.role === 'TENANT') { e.preventDefault(); showToast('Tenant accounts cannot register as a new Host.'); }
  };

  const isTenant   = user?.role === 'TENANT';
  const isLoggedIn = !!user;

  return (
    <>
      {toast && <Toast msg={toast} />}

      <header className="sticky top-0 z-50 h-[72px] bg-surface/90 backdrop-blur-md border-b border-outline-variant shadow-[0_1px_3px_rgba(6,27,14,0.08)]">
        <div className="flex items-center justify-between h-full max-w-[1280px] mx-auto px-5">

          <Link to="/" className="font-display font-bold text-xl text-primary flex items-center gap-2">
            Evergreen Escapes
          </Link>

          <NavLinks />

          <div className="flex items-center gap-3">
            <Link to="/tenant/register" onClick={handleHostClick}
              className={`hidden md:inline-flex items-center font-body text-[13px] font-bold bg-primary text-on-primary rounded-full px-5 py-2.5 whitespace-nowrap tracking-tight hover:opacity-90 transition-opacity ${isTenant ? 'opacity-45 cursor-not-allowed' : ''}`}
            >
              Host Your Eco-Stay
            </Link>

            {!isLoggedIn ? (
              <Link to="/login" aria-label="Login" title="Login or Register"
                className="w-10 h-10 rounded-full border border-outline-variant text-primary bg-transparent flex items-center justify-center hover:bg-surface-low transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">person</span>
              </Link>
            ) : (
              <div className="relative">
                <button aria-label="Profile menu" onClick={() => setOpen(o => !o)} title={`Logged in as ${user.name} (${user.role})`}
                  className="w-10 h-10 rounded-full border-2 border-primary bg-transparent flex items-center justify-center hover:bg-surface-low transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[22px] text-primary">account_circle</span>
                </button>
                {open && <NavDropdown user={user} onLogout={handleLogout} onClose={() => setOpen(false)} onToast={showToast} />}
              </div>
            )}

            <button aria-label="Toggle menu" onClick={() => setOpen(o => !o)}
              className="flex md:hidden w-10 h-10 rounded-full border border-outline-variant bg-transparent items-center justify-center text-primary hover:bg-surface-low transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">{open ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {open && (
          <nav className="bg-surface-white border-t border-outline-variant py-2">
            <div className="max-w-[1280px] mx-auto px-5 flex flex-col">
              <NavLinks mobile onClose={() => setOpen(false)} />
              {user?.role === 'USER'   && <Link to="/profile"          onClick={() => setOpen(false)} className="block py-3 text-[14px] font-semibold text-on-surface border-b border-surface-high">My Profile</Link>}
              {user?.role === 'TENANT' && <Link to="/tenant/dashboard" onClick={() => setOpen(false)} className="block py-3 text-[14px] font-semibold text-on-surface border-b border-surface-high">Tenant Dashboard</Link>}
              {!isLoggedIn && <Link to="/login" onClick={() => setOpen(false)} className="block py-3 text-[14px] font-bold text-primary">Login / Register</Link>}
              {isLoggedIn  && <button onClick={handleLogout} className="text-left py-3 text-[14px] font-bold text-red-600 bg-transparent border-none cursor-pointer">Logout</button>}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
