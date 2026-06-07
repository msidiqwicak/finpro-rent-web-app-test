import { useState } from "react";

export default function ConfirmedBooking() {
  const [automations, setAutomations] = useState({
    reminder: true,
    digitalKey: false,
  });

  return (
    <div className="space-y-6">
      {/* Success State Header */}
      <section className="bg-secondary-container/30 border border-secondary-container rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary-fixed/20 rounded-full blur-3xl"></div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shadow-inner">
            <span
              className="material-symbols-outlined text-[40px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <div>
            <h2 className="font-headline-sm text-on-secondary-container">
              Booking #EE-2035 Confirmed
            </h2>
            <p className="font-body-md text-on-secondary-fixed-variant text-sm">
              Payment verified. Booking details emailed to guest.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 relative z-10">
          <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-label-md hover:bg-primary-container transition-all flex items-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">send</span>{" "}
            Send Rules
          </button>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6">
        {/* Guest & Automations Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low rounded-3xl p-8 shadow-sm border border-outline-variant/20">
            <h4 className="font-label-md text-on-surface uppercase tracking-widest mb-6">
              Automations
            </h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary-fixed">
                      notifications_active
                    </span>
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface">
                      H-1 Reminder
                    </p>
                    <p className="font-caption text-on-surface-variant">
                      Auto-send day before
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={automations.reminder}
                    onChange={(e) =>
                      setAutomations({
                        ...automations,
                        reminder: e.target.checked,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt & Timeline Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/20">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-headline-sm text-on-surface">
                Receipt Summary
              </h4>
              <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-label-md">
                Paid in Full
              </span>
            </div>
            <div className="pt-6 mt-2 border-t border-outline-variant/30 flex justify-between items-end">
              <div>
                <p className="font-caption text-on-surface-variant uppercase tracking-widest">
                  Total Amount
                </p>
                <p className="font-display-lg text-primary text-[36px]">
                  $1,425.00
                </p>
              </div>
              <div className="text-right">
                <p className="font-caption text-on-surface-variant mb-1">
                  Transaction ID
                </p>
                <code className="bg-surface-container px-3 py-1 rounded text-caption font-mono">
                  TXN-990-221-4401
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-50">
        <button className="w-14 h-14 bg-secondary text-on-secondary rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer">
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            chat
          </span>
        </button>
      </div>
    </div>
  );
}
