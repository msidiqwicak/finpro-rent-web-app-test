interface PaymentSummaryCardProps {
  basePrice: number;
  formatCurrency: (amount: number) => string;
}

export default function PaymentSummaryCard({
  basePrice,
  formatCurrency,
}: PaymentSummaryCardProps) {
  return (
    <section className="bg-surface-container-lowest rounded-[32px] p-8 shadow-[0_8px_24px_-4px_rgba(27,48,34,0.06)] border border-surface-container">
      <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-6">
        Payment Summary
      </h3>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Base Rate</span>
          <span className="font-medium">{formatCurrency(basePrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Taxes & Fees</span>
          <span className="font-medium">Rp 0</span>
        </div>
      </div>
      <div className="pt-6 border-t border-outline-variant flex justify-between items-center mb-8">
        <span className="text-xl font-semibold text-primary">Total Amount</span>
        <span className="text-2xl font-bold text-primary">
          {formatCurrency(basePrice)}
        </span>
      </div>
      <div className="p-4 bg-[#c0c9ba] rounded-2xl flex gap-3 items-start">
        <span className="material-symbols-outlined text-[#40493d] mt-0.5">
          info
        </span>
        <p className="text-xs text-[#40493d] leading-relaxed">
          The reservation timer ensures popular dates remain available. If the
          guest fails to pay within the allotted time, the reservation will be
          automatically cancelled and dates released.
        </p>
      </div>
    </section>
  );
}
