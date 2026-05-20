import { Link } from 'react-router-dom';
import { useState } from 'react';

const NAV_LINKS = [
  { to: '/search', label: 'Find Stays', active: true },
  { to: '/sustainability', label: 'Sustainability' },
  { to: '/about', label: 'About Us' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar__inner container-page">

        {/* Logo */}
        <Link to="/" className="navbar__logo" style={{ textDecoration: 'none', color: 'var(--on-surface)' }}>
          Evergreen Escapes
        </Link>

        {/* Desktop Nav Links — uses .navbar__links from index.css (hidden mobile, flex desktop) */}
        <nav className="navbar__links">
          {NAV_LINKS.map(({ to, label, active }) => (
            <Link
              key={to}
              to={to}
              className={`navbar__link ${active ? 'navbar__link--active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="navbar__actions">
          {/* Host CTA — desktop only, uses CSS class */}
          <Link to="/tenant/register" className="navbar__cta">
            Host Your Eco-Stay
          </Link>

          {/* Profile icon */}
          <Link
            to="/login"
            aria-label="Profile"
            className="btn-icon"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 35 }}>person</span>
          </Link>

          {/* Hamburger — mobile only, uses CSS class */}
          <button
            className="navbar__hamburger btn-icon"
            aria-label="Toggle menu"
            onClick={() => setOpen(o => !o)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{open ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="navbar__mobile-menu">
          <div className="container-page" style={{ display: 'flex', flexDirection: 'column' }}>
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="navbar__mobile-link"
              >
                {label}
              </Link>
            ))}
            <Link to="/tenant/register" onClick={() => setOpen(false)} className="navbar__mobile-link" style={{ color: 'var(--primary)', fontWeight: 700, borderBottom: 'none' }}>
              Host Your Eco-Stay
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
