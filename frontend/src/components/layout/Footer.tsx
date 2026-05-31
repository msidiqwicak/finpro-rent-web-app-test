const LINKS = ['Legal', 'Company', 'Privacy Policy', 'Terms of Service', 'Contact'];

function NewsletterSection() {
  return (
    <div className="bg-primary-container relative overflow-hidden py-20">
      <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full bg-primary-fixed/10 blur-[60px] pointer-events-none" />
      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-8 lg:px-16">
        <div className="max-w-[640px] mx-auto text-center">
          <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-primary-fixed-dim mb-3">Stay Connected</p>
          <h2 className="font-display text-[clamp(24px,3.5vw,32px)] font-semibold text-on-primary mb-3">
            Join the Evergreen Community
          </h2>
          <p className="font-body text-[18px] text-on-primary/75 mb-9">
            Sign up for eco-travel tips, exclusive retreats, and early access to our newest sustainable properties.
          </p>
          <form className="flex flex-col gap-3 max-w-xl mx-auto sm:flex-row">
            <input type="email" placeholder="Your email address" aria-label="Email address" required
              className="flex-1 min-w-0 bg-white/10 border border-white/22 rounded-full px-6 py-3.5 text-white font-body text-[15px] outline-none placeholder:text-white/50 focus:border-white/50 transition-colors"
            />
            <button type="submit"
              className="bg-primary-fixed text-on-primary-fixed px-7 py-3.5 rounded-full font-body font-bold text-[14px] whitespace-nowrap border-none cursor-pointer hover:opacity-90 transition-opacity"
            >
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
    <footer aria-label="Site footer" className="bg-surface-low border-t border-outline-variant">
      <NewsletterSection />
      <div className="max-w-[1280px] mx-auto px-5 py-7 md:px-8 lg:px-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-[16px] text-on-surface">Evergreen Escapes</p>
            <p className="font-body text-[12px] text-on-surface-variant mt-0.5">
              © {new Date().getFullYear()} Evergreen Escapes. All rights reserved.
            </p>
          </div>
          <nav aria-label="Footer links" className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map(label => (
              <a key={label} href="#"
                className="font-body text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-200"
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
