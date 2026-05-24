import { Link } from 'react-router-dom';
import type { AuthUser } from '../context/AuthContext';

interface NavDropdownProps {
  user:      AuthUser;
  onLogout:  () => void;
  onClose:   () => void;
  onToast:   (msg: string) => void;
}

const ITEM_STYLE: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
  fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600,
  color: 'var(--on-surface)', textDecoration: 'none', transition: 'background 0.15s',
  cursor: 'pointer', background: 'none', border: 'none', width: '100%', textAlign: 'left',
};

function DropdownItem({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <Link to={to} style={ITEM_STYLE}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-low)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
      {label}
    </Link>
  );
}

function DisabledItem({ icon, label, badge, onClick }: { icon: string; label: string; badge: string; onClick: () => void }) {
  return (
    <div style={{ ...ITEM_STYLE, opacity: 0.45, cursor: 'not-allowed' }} onClick={onClick}>
      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
      {label}
      <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, background: 'var(--surface-high)', color: 'var(--on-surface-variant)', padding: '2px 6px', borderRadius: 6 }}>{badge}</span>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const isUser = role === 'USER';
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
      padding: '2px 10px', borderRadius: 9999,
      background: isUser ? 'var(--secondary-container)' : 'var(--primary-fixed)',
      color:      isUser ? 'var(--on-secondary-container)' : 'var(--on-primary-fixed)',
    }}>{role}</span>
  );
}

export default function NavDropdown({ user, onLogout, onClose, onToast }: NavDropdownProps) {
  const isUser   = user.role === 'USER';
  const isTenant = user.role === 'TENANT';

  return (
    <div onClick={onClose} style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
      background: 'var(--surface-white)', border: '1px solid var(--outline-variant)',
      borderRadius: 16, boxShadow: '0 8px 32px rgba(6,27,14,0.15)', minWidth: 220,
      zIndex: 100, overflow: 'hidden', animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{ padding: '12px 16px', background: 'var(--surface-low)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <p style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--on-surface)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
        <RoleBadge role={user.role} />
      </div>
      <div style={{ height: 1, background: 'var(--outline-variant)', margin: '4px 0' }} />

      {isUser   && <><DropdownItem to="/profile"  icon="person"        label="My Profile" /><DropdownItem to="/bookings" icon="calendar_month" label="My Bookings" /></>}
      {isTenant && <><DropdownItem to="/tenant/dashboard"  icon="dashboard"   label="Dashboard" /><DropdownItem to="/tenant/properties" icon="home_work" label="My Properties" /><DropdownItem to="/tenant/bookings" icon="receipt_long" label="Manage Bookings" /></>}

      {isTenant && <DisabledItem icon="hotel"     label="Book a Stay" badge="Guest only"   onClick={() => onToast('This feature is only available for Guest accounts, not Tenants.')} />}
      {isUser   && <DisabledItem icon="dashboard" label="Tenant Dashboard" badge="Tenant only" onClick={() => onToast('This feature is only available for Tenant accounts.')} />}

      <div style={{ height: 1, background: 'var(--outline-variant)', margin: '4px 0' }} />
      <button onClick={onLogout} style={{ ...ITEM_STYLE, color: '#c0392b' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#fdf0f0')}
        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>Logout
      </button>
    </div>
  );
}
