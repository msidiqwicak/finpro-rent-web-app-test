interface OrderSummarySidebarProps {
  roomName: string;
  locationName: string;
  imageUrl: string;
  diffDays: number;
  pricePerNight: number;
  totalPrice: number;
  isLoading: boolean;
  onPaymentSubmit: () => void;
}

export default function OrderSummarySidebar({
  roomName,
  locationName,
  imageUrl,
  diffDays,
  pricePerNight,
  totalPrice,
  isLoading,
  onPaymentSubmit,
}: OrderSummarySidebarProps) {
  return (
    <div className="bg-surface-container-lowest rounded-[24px] overflow-hidden border border-outline-variant/30 shadow-[0_8px_24px_rgba(27,48,34,0.06)] hover:shadow-[0_12px_32px_rgba(27,48,34,0.1)] transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative h-56">
        <img
          alt={roomName}
          className="w-full h-full object-cover"
          src={imageUrl}
        />
        <div className="absolute top-4 left-4">
          <div className="bg-secondary text-on-secondary px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md backdrop-blur-sm bg-secondary/90">
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
            Eco-Certified
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 space-y-6">
        <div>
          <h3 className="font-headline-sm text-2xl font-bold text-primary mb-2">
            {roomName}
          </h3>
          <p className="text-on-surface-variant font-body-md flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">
              location_on
            </span>
            {locationName}
          </p>
        </div>

        <div className="space-y-4 border-t border-outline-variant/30 pt-6">
          <div className="flex justify-between items-center text-body-md">
            <span className="text-on-surface-variant">
              {diffDays} malam × Rp {pricePerNight.toLocaleString("id-ID")}
            </span>
            <span className="text-primary font-bold">
              Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30 mt-4">
            <span className="font-headline-sm text-xl font-bold text-primary">
              Total
            </span>
            <span className="font-headline-sm text-2xl font-bold text-primary">
              Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={onPaymentSubmit}
          disabled={isLoading}
          className="w-full bg-primary-container text-on-primary py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-primary-container/20 group disabled:opacity-70 disabled:cursor-not-allowed border-none cursor-pointer mt-4"
        >
          {isLoading && (
            <span className="material-symbols-outlined animate-spin">
              autorenew
            </span>
          )}
          <span>{isLoading ? "Memproses..." : "Lanjut ke Pembayaran"}</span>
          {!isLoading && (
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          )}
        </button>

        <p className="text-center text-xs font-medium text-on-surface-variant mt-4 px-2">
          By clicking the button above, you agree{" "}
          <a
            className="underline hover:text-primary transition-colors cursor-pointer"
            href="#"
          >
            Terms of service
          </a>{" "}
          and{" "}
          <a
            className="underline hover:text-primary transition-colors cursor-pointer"
            href="#"
          >
            Privacy Policy
          </a>{" "}
          kami.
        </p>
      </div>
    </div>
  );
}
