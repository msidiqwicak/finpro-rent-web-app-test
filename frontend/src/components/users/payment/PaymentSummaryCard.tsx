interface PaymentSummaryCardProps {
  orderId: string;
  totalAmount: number;
  propertyName?: string;
}

export default function PaymentSummaryCard({
  orderId,
  totalAmount,
  propertyName = "Evergreen Property",
}: PaymentSummaryCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden sticky top-24 p-6">
      <h3 className="text-xl font-bold text-primary mb-4">Order Summary</h3>

      <div className="space-y-3 mb-6">
        <p className="text-sm text-on-surface-variant flex justify-between">
          <span>Booking ID</span>
          <span className="font-semibold text-primary truncate max-w-[150px]">
            #{orderId.substring(0, 8).toUpperCase()}
          </span>
        </p>
        <p className="text-sm text-on-surface-variant flex justify-between">
          <span>Property</span>
          <span className="font-semibold text-primary">{propertyName}</span>
        </p>
      </div>

      <div className="flex justify-between items-center border-t border-surface-variant pt-4">
        <span className="font-bold text-primary">Total Amount</span>
        <span className="text-2xl font-bold text-primary">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(totalAmount)}
        </span>
      </div>
    </div>
  );
}
