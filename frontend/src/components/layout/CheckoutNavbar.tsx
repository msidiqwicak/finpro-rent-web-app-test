import React from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutNavbar() {
  const navigate = useNavigate();

  return (
    <header className="bg-surface/80 top-0 sticky backdrop-blur-md shadow-sm flex justify-center items-center w-full px-5 h-[72px] z-50 border-b border-outline-variant/30">
      <div className="max-w-[1280px] w-full mx-auto flex items-center gap-2 md:gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="material-symbols-outlined text-primary cursor-pointer hover:bg-surface-container-high transition-colors w-10 h-10 -ml-2 rounded-full border-none bg-transparent flex items-center justify-center"
        >
          arrow_back
        </button>
        <div className="font-display font-bold text-xl text-primary">
          Finpro Escapes
        </div>
      </div>
    </header>
  );
}
