export default function ReviewNoticeCard() {
  return (
    <section className="bg-surface-container-low/60 rounded-2xl p-8 border border-outline-variant/30 space-y-4">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-secondary text-[28px]">
          account_circle
        </span>
        <h2 className="font-headline-sm text-xl font-bold text-primary">
          Account Review
        </h2>
      </div>
      <p className="text-on-surface-variant font-body-md leading-relaxed">
        This order will be linked to an account{" "}
        <strong>Evergreen Escapes</strong> You can proceed to the payment page
        after confirming that all the above details are correct.
      </p>
      <div className="flex items-center gap-2 text-secondary font-label-md font-bold pt-2">
        <span className="material-symbols-outlined text-[18px]">
          check_circle
        </span>
        <span>Ready for secure checkout</span>
      </div>
    </section>
  );
}
