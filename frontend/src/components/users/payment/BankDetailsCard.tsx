export default function BankDetailsCard() {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary-fixed text-on-primary-fixed p-2 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">
            account_balance
          </span>
        </div>
        <h2 className="font-headline-sm text-xl text-primary">
          Bank Transfer Details
        </h2>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-surface-container-high">
          <span className="font-body-md text-on-surface-variant">
            Bank Name
          </span>
          <span className="font-body-md font-bold text-primary">
            Evergreen Eco Bank
          </span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-surface-container-high">
          <span className="font-body-md text-on-surface-variant">
            Account Name
          </span>
          <span className="font-body-md font-bold text-primary">
            Evergreen Escapes Ltd.
          </span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-surface-container-high">
          <span className="font-body-md text-on-surface-variant">
            Account Number
          </span>
          <div className="flex items-center gap-2">
            <span className="font-body-lg font-bold text-primary tracking-wide">
              8492 0019 3321
            </span>
            <button
              className="text-secondary hover:text-primary transition-colors p-1"
              title="Copy Account Number"
            >
              <span className="material-symbols-outlined text-[20px]">
                content_copy
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
