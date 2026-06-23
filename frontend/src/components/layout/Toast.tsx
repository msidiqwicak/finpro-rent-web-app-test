interface ToastProps {
  msg: string;
}

export default function Toast({ msg }: ToastProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 bg-primary-container text-on-primary text-[14px] font-medium font-body px-5 py-3 rounded-xl shadow-[0_8px_24px_rgba(6,27,14,0.25)] max-w-[90vw] animate-fade-in"
    >
      <span className="material-symbols-outlined text-[18px] shrink-0">
        info
      </span>
      {msg}
    </div>
  );
}
