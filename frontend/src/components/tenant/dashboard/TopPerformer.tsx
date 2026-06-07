export default function TopPerformer() {
  return (
    <div className="lg:col-span-1">
      <div className="relative group overflow-hidden bg-surface-container-lowest rounded-[2.5rem] shadow-sm border border-outline-variant flex flex-col h-full">
        <div className="h-48 overflow-hidden">
          <img
            alt="Top Performing Property"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=600&auto=format&fit=crop"
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h5 className="text-lg font-bold text-primary">
              Forest Pine Retreat
            </h5>
            <div className="px-3 py-1 rounded-full inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold">
              <span className="material-symbols-outlined text-[14px]">
                eco
              </span>
              Solar Powered
            </div>
          </div>
          <div className="flex items-center gap-2 mb-6 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">
              location_on
            </span>
            <span className="text-sm">Ubud, Bali</span>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-6">
            <div>
              <p className="text-on-surface-variant text-xs font-bold mb-1 uppercase tracking-wider">
                Earnings (Mo)
              </p>
              <p className="text-secondary font-bold">Rp 18.500.000</p>
            </div>
            <div>
              <p className="text-on-surface-variant text-xs font-bold mb-1 uppercase tracking-wider">
                Occupancy
              </p>
              <p className="text-primary font-bold">98%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
