export default function PromoBanner() {
  return (
    <div className="lg:col-span-2 p-8 bg-primary text-white rounded-[2.5rem] relative overflow-hidden flex flex-col justify-center">
      {/* Atmospheric Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-secondary blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-secondary-container blur-3xl"></div>
      </div>
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-grow text-center md:text-left">
          <h4 className="text-3xl font-bold mb-4">
            New "Eco-Rating" feature is live!
          </h4>
          <p className="text-white/80 font-body-lg mb-6">
            Your properties now show their sustainability score to
            travelers. Properties with high scores see up to 24% more
            bookings.
          </p>
          <button className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg border-none cursor-pointer">
            Improve Your Score
          </button>
        </div>
        <div className="w-40 h-40 shrink-0 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
          <span className="material-symbols-outlined text-6xl text-secondary-fixed">
            eco
          </span>
        </div>
      </div>
    </div>
  );
}
