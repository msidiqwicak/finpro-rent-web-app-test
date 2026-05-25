const LINKS = ['Legal', 'Company', 'Privacy Policy', 'Terms of Service', 'Contact'];

function NewsletterSection() {
  return (
    <div style={{ background: 'var(--primary-container)', position: 'relative', overflow: 'hidden', paddingBlock: 80 }}>
      <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: 9999, background: 'rgba(208,233,212,0.10)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '0 20px' }} className="md:px-8 lg:px-16">
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary-fixed-dim)', marginBottom: 12 }}>Stay Connected</p>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(24px,3.5vw,32px)', fontWeight: 600, color: 'var(--on-primary)', marginBottom: 12 }}>Join the Evergreen Community</h2>
          <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 18, color: 'rgba(255,255,255,0.75)', marginBottom: 36 }}>Sign up for eco-travel tips, exclusive retreats, and early access to our newest sustainable properties.</p>
          {/* .newsletter-form: stacked on mobile, row on sm+ via CSS class */}
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" aria-label="Email address" required
              style={{ flex: 1, minWidth: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: 9999, padding: '14px 24px', color: 'white', fontFamily: "'Manrope',sans-serif", fontSize: 15, outline: 'none', transition: 'border-color 0.2s' }} />
            <button type="submit"
              style={{ background: 'var(--primary-fixed)', color: 'var(--on-primary-fixed)', padding: '14px 28px', borderRadius: 9999, fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}>
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer aria-label="Site footer" style={{ background: 'var(--surface-low)', borderTop: '1px solid var(--outline-variant)' }}>
      <NewsletterSection />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 20px' }} className="md:px-8 lg:px-16">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--on-surface)' }}>Evergreen Escapes</p>
            <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 2 }}>© {new Date().getFullYear()} Evergreen Escapes. All rights reserved.</p>
          </div>
          <nav aria-label="Footer links" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
            {LINKS.map(label => (
              <a key={label} href="#" style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: 'var(--on-surface-variant)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--on-surface-variant)')}
              >{label}</a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
