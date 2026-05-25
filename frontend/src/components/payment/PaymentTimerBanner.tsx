import React, { useState, useEffect } from "react";

export default function PaymentTimerBanner({
  initialSeconds,
}: {
  initialSeconds: number;
}) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-red-50 text-red-900 rounded-xl p-4 flex items-center gap-4 shadow-sm border border-red-100">
      <span className="material-symbols-outlined text-red-600">timer</span>
      <div>
        <p className="text-sm font-bold">Pending Payment</p>
        <p className="text-sm">
          Complete within{" "}
          <span className="font-bold tracking-wider">
            {formatTime(timeLeft)}
          </span>
        </p>
      </div>
    </div>
  );
}
