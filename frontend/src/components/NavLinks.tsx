import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/search',       label: 'Find Stays'    },
  { to: '/sustainability', label: 'Sustainability' },
  { to: '/about',        label: 'About Us'      },
];

interface NavLinksProps {
  mobile?:  boolean;
  onClose?: () => void;
}

export function NavLinks({ mobile, onClose }: NavLinksProps) {
  if (mobile) {
    return (
      <>
        {NAV_LINKS.map(({ to, label }) => (
          <Link key={to} to={to} onClick={onClose}
            className="block py-3 text-sm font-semibold border-b"
            style={{ color: 'var(--on-surface)', borderColor: 'var(--surface-high)' }}
          >
            {label}
          </Link>
        ))}
      </>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-8">
      {NAV_LINKS.map(({ to, label }) => (
        <Link key={to} to={to}
          className="text-sm font-semibold pb-0.5 border-b-2 border-transparent transition-colors"
          style={{ color: 'var(--on-surface-variant)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderBottomColor = 'var(--primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--on-surface-variant)'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
