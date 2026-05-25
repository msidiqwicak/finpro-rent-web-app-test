import React from "react";

export default function OrderSummarySidebar() {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50 overflow-hidden sticky top-24">
      <div className="h-48 w-full bg-surface-container relative">
        <img
          src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800&auto=format&fit=crop"
          alt="Cabin exterior"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="font-headline-sm text-xl text-primary mb-1">
          Whispering Pines Retreat
        </h3>
        <p className="font-body-md text-on-surface-variant text-sm flex items-center gap-1 mb-6">
          <span className="material-symbols-outlined text-[16px]">
            location_on
          </span>
          Cascades National Forest, WA
        </p>
        <div className="space-y-4 border-t border-surface-container-high pt-4 mb-6">
          <div className="flex justify-between text-on-surface-variant font-body-md text-sm">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                calendar_today
              </span>{" "}
              Oct 15 - Oct 18
            </span>
            <span>3 Nights</span>
          </div>
          <div className="flex justify-between text-on-surface-variant font-body-md text-sm">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                group
              </span>{" "}
              Guests
            </span>
            <span>2 Adults</span>
          </div>
        </div>
        <div className="space-y-3 border-t border-surface-container-high pt-4 font-body-md text-sm">
          <div className="flex justify-between text-on-surface-variant">
            <span>$250 x 3 nights</span>
            <span>$750.00</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>Eco-Cleaning Fee</span>
            <span>$65.00</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>Service Fee</span>
            <span>$45.00</span>
          </div>
          <div className="flex justify-between items-center border-t border-surface-container-high pt-4 mt-2">
            <span className="font-headline-sm text-lg text-primary">
              Total Amount
            </span>
            <span className="font-headline-md text-xl text-primary">
              $860.00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
