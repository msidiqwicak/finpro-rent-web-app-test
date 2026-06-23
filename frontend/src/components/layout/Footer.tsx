import { Link } from 'react-router-dom';

const LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Explore', path: '/explore' },
  { label: 'Our Mission', path: '/sustainability' },
];

function ContactSection() {
  return (
    <div id="contact" className="bg-primary-container relative overflow-hidden py-20">
      <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full bg-primary-fixed/10 blur-[60px] pointer-events-none" />
      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-8 lg:px-16">
        <div className="max-w-[640px] mx-auto text-center">
          <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-primary-fixed-dim mb-3">Get in Touch</p>
          <h2 className="font-display text-[clamp(24px,3.5vw,32px)] font-semibold text-on-primary mb-4">
            Need Help With Your Booking?
          </h2>
          <p className="font-body text-[18px] text-on-primary/75 mb-10 max-w-[500px] mx-auto">
            Our support team is available from 9 AM to 6 PM. Choose your preferred way to contact us below.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://wa.me/6281234567890" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-8 py-3.5 rounded-full font-body font-bold text-[15px] hover:bg-[#1ebd5a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto justify-center no-underline"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              WhatsApp Us
            </a>
            
            <a 
              href="mailto:support@evergreenescapes.com" 
              className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded-full font-body font-bold text-[15px] hover:bg-white/20 transition-all w-full sm:w-auto justify-center no-underline"
            >
              <span className="material-symbols-outlined text-[20px]">mail</span>
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer aria-label="Site footer" className="bg-surface-low border-t border-outline-variant">
      <ContactSection />
      <div className="max-w-[1280px] mx-auto px-5 py-7 md:px-8 lg:px-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-[16px] text-on-surface">Evergreen Escapes</p>
            <p className="font-body text-[12px] text-on-surface-variant mt-0.5">
              © {new Date().getFullYear()} Evergreen Escapes. All rights reserved.
            </p>
          </div>
          <nav aria-label="Footer links" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LINKS.map(link => (
              <Link key={link.label} to={link.path}
                className="font-body text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
