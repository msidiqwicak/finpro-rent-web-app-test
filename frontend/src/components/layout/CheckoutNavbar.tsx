import { Link, useNavigate } from "react-router-dom";

export default function CheckoutNavbar() {
  const navigate = useNavigate();

  return (
    // Identical structure to Navbar: sticky, h-[72px], bg/blur, border, z-50
    <header className="sticky top-0 z-50 h-[72px] bg-surface/95 backdrop-blur-md border-b border-outline-variant/50 shadow-sm w-full">
      <div className="flex items-center h-full w-full max-w-[1280px] px-4 md:px-5 mx-auto gap-3">
        {/* Back button — same size/shape as icon buttons in Navbar */}
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="w-10 h-10 -ml-2 rounded-full border-none bg-transparent flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>

        {/* Brand — same font & size as Navbar logo */}
        <Link
          to="/"
          className="flex items-center gap-2 no-underline"
        >
          <span className="material-symbols-outlined text-primary text-[26px] [font-variation-settings:'FILL'_1]">
            forest
          </span>
          <span className="font-display font-bold text-[18px] text-primary hidden sm:block">
            Evergreen Escapes
          </span>
        </Link>
      </div>
    </header>
  );
}
