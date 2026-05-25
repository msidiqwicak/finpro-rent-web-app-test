import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavLinks } from './NavLinks';
import NavDropdown from './NavDropdown';

function Toast({ msg }: { msg: string }) {
  return (
    <div role="alert" aria-live="polite" style={{
      position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, background: 'var(--primary-container)', color: 'var(--on-primary)',
      padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 500,
      fontFamily: "'Manrope', sans-serif", display: 'flex', alignItems: 'center',
      gap: 8, boxShadow: '0 8px 24px rgba(6,27,14,0.25)',
      animation: 'slideDown 0.3s ease', maxWidth: '90vw',
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 18, flexShrink: 0 }}>info</span>
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

      <header style={{ position: 'sticky', top: 0, zIndex: 50, height: 72, background: 'rgba(249,250,248,0.88)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--outline-variant)', boxShadow: 'var(--shadow-nav)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>

          <Link to="/" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            Evergreen Escapes
          </Link>

          <NavLinks />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/tenant/register" onClick={handleHostClick}
              className="navbar-cta"
              style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, fontWeight: 700, background: 'var(--primary)', color: '#fff', borderRadius: 9999, padding: '9px 20px', textDecoration: 'none', whiteSpace: 'nowrap', letterSpacing: '0.01em', transition: 'opacity 0.2s', opacity: isTenant ? 0.45 : 1, cursor: isTenant ? 'not-allowed' : 'pointer', alignItems: 'center' }}
            >
              Host Your Eco-Stay
            </Link>

            {!isLoggedIn ? (
              <Link to="/login" aria-label="Login" title="Login or Register"
                style={{ width: 40, height: 40, borderRadius: 9999, border: '1px solid var(--outline-variant)', color: 'var(--primary)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 37 }}>person</span>
              </Link>
            ) : (
              <div style={{ position: 'relative' }}>
                <button aria-label="Profile menu" onClick={() => setOpen(o => !o)} title={`Logged in as ${user.name} (${user.role})`}
                  style={{ width: 40, height: 40, borderRadius: 9999, border: '2px solid var(--primary)', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--primary)' }}>account_circle</span>
                </button>
                {open && <NavDropdown user={user} onLogout={handleLogout} onClose={() => setOpen(false)} onToast={showToast} />}
              </div>
            )}

            <button aria-label="Toggle menu" onClick={() => setOpen(o => !o)}
              className="navbar-hamburger"
              style={{ width: 40, height: 40, borderRadius: 9999, border: '1px solid var(--outline-variant)', background: 'transparent', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{open ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {open && (
          <nav style={{ background: 'var(--surface-white)', borderTop: '1px solid var(--outline-variant)', padding: '8px 0' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', display: 'flex', flexDirection: 'column' }}>
              <NavLinks mobile onClose={() => setOpen(false)} />
              {user?.role === 'USER'   && <Link to="/profile"          onClick={() => setOpen(false)} style={{ display: 'block', padding: '12px 0', fontSize: 14, fontWeight: 600, color: 'var(--on-surface)', borderBottom: '1px solid var(--surface-high)', textDecoration: 'none' }}>My Profile</Link>}
              {user?.role === 'TENANT' && <Link to="/tenant/dashboard" onClick={() => setOpen(false)} style={{ display: 'block', padding: '12px 0', fontSize: 14, fontWeight: 600, color: 'var(--on-surface)', borderBottom: '1px solid var(--surface-high)', textDecoration: 'none' }}>Tenant Dashboard</Link>}
              {!isLoggedIn && <Link to="/login" onClick={() => setOpen(false)} style={{ display: 'block', padding: '12px 0', fontSize: 14, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>Login / Register</Link>}
              {isLoggedIn  && <button onClick={handleLogout} style={{ background: 'none', border: 'none', textAlign: 'left', color: '#c0392b', cursor: 'pointer', fontWeight: 700, padding: '12px 0', fontSize: 14 }}>Logout</button>}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
