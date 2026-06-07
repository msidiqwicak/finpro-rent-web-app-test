interface PaymentBreakdownProps {
  shortId: string;
  pricePerNight: number;
  nights: number;
  baseTotal: number;
  totalPrice: number;
  isCanceled: boolean;
  formatCurrency: (amount: number) => string;
}

export default function PaymentBreakdown({
  shortId,
  pricePerNight,
  nights,
  baseTotal,
  totalPrice,
  isCanceled,
  formatCurrency,
}: PaymentBreakdownProps) {
  return (
    <aside className="lg:col-span-4 space-y-6 animate-fade-in">
      <div className="sticky top-24 bg-white rounded-xl shadow-lg border border-outline-variant overflow-hidden">
        <div className="p-6 bg-primary-container text-white">
          <h3 className="font-display font-bold text-lg">Payment Details</h3>
          <p className="text-on-primary-container text-xs mt-1">
            Invoice ID: INV-{shortId}-B
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center text-on-surface-variant text-sm">
            <span>
              {formatCurrency(pricePerNight)} x {nights} nights
            </span>
            <span>{formatCurrency(baseTotal)}</span>
          </div>
          {totalPrice > baseTotal && (
            <div className="flex justify-between items-center text-on-surface-variant text-sm">
              <span>Service Fee</span>
              <span>{formatCurrency(totalPrice - baseTotal)}</span>
            </div>
          )}

          <div className="pt-4 border-t border-outline-variant flex justify-between items-center">
            <span
              className={`text-sm font-bold ${isCanceled ? "text-on-surface-variant line-through opacity-50" : "text-primary"}`}
            >
              Total Amount
            </span>
            <span
              className={`font-display font-bold ${isCanceled ? "text-on-surface-variant line-through opacity-50 text-base" : "text-primary text-lg"}`}
            >
              {formatCurrency(totalPrice)}
            </span>
          </div>

          {isCanceled && (
            <div className="mt-4 p-4 bg-error-container/30 rounded-lg border border-error/20">
              <div className="flex justify-between items-center text-error font-bold mb-1 text-sm">
                <span>Refunded Amount</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <p className="text-[11px] text-on-error-container italic leading-relaxed">
                Refunds typically take 5-10 business days to appear on your bank
                statement.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 bg-surface-container-low border-t border-outline-variant">
          <p className="text-on-surface-variant font-semibold text-xs uppercase tracking-wide mb-3">
            Payment Method
          </p>
          <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-outline-variant">
            <span className="material-symbols-outlined text-primary">
              credit_card
            </span>
            <div>
              <p className="text-sm font-bold text-primary">
                Visa ending in 4429
              </p>
              <p className="text-xs text-on-surface-variant">
                Processed via Stripe Secure
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="p-4 bg-tertiary-fixed text-on-tertiary-fixed rounded-lg text-sm flex flex-col gap-3">
            <div className="flex gap-3">
              <span className="material-symbols-outlined shrink-0">info</span>
              <p className="font-bold text-sm">Cancellation Policy</p>
            </div>
            <p className="text-on-tertiary-fixed-variant text-xs leading-relaxed">
              Free cancellation until Oct 5, 2026. After this date, 50% refund
              applies.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
