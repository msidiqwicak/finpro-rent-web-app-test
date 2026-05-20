const LINKS = ['Legal', 'Company', 'Privacy Policy', 'Terms of Service', 'Contact'];

export default function Footer() {
  return (
    <footer className="footer" aria-label="Site footer">

      {/* Newsletter section */}
      <div className="newsletter-section">
        <div className="container-page" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>

            <p className="text-overline" style={{ color: 'var(--primary-fixed-dim)', marginBottom: 12 }}>Stay Connected</p>

            <h2 className="text-headline-md" style={{ color: 'var(--on-primary)', marginBottom: 12 }}>
              Join the Evergreen Community
            </h2>

            <p className="text-body-lg" style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 36 }}>
              Sign up for eco-travel tips, exclusive retreats, and early access to our newest sustainable properties.
            </p>

            {/* Using CSS class .newsletter-form for responsive horizontal layout */}
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Your email address"
                className="newsletter-input"
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                className="btn btn-pill"
                style={{
                  background: 'var(--primary-fixed)',
                  color: 'var(--on-primary-fixed)',
                  padding: '14px 28px',
                  fontWeight: 700,
                  fontSize: 14,
                  whiteSpace: 'nowrap',
                  borderRadius: 9999,
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-page" style={{ paddingBlock: 28 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

          {/* Brand */}
          <div>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--on-surface)' }}>
              Evergreen Escapes
            </p>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 2 }}>
              © {new Date().getFullYear()} Evergreen Escapes. All rights reserved.
            </p>
          </div>

          {/* Footer nav links */}
          <nav aria-label="Footer links" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
            {LINKS.map(label => (
              <a
                key={label}
                href="#"
                style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: 'var(--on-surface-variant)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--on-surface-variant)')}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

    </footer>
  );
}
