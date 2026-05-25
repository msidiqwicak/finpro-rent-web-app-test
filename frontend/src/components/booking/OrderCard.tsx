import React from "react";

interface OrderCardProps {
  title: string;
  date: string;
  orderId: string;
  price: string;
  status: "Confirmed" | "Pending Payment";
  image: string;
}

export default function OrderCard({
  title,
  date,
  orderId,
  price,
  status,
  image,
}: OrderCardProps) {
  const isConfirmed = status === "Confirmed";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300">
      {/* Bagian Gambar & Badge Status */}
      <div className="h-48 w-full bg-gray-100 relative">
        <img alt={title} className="w-full h-full object-cover" src={image} />
        <div
          className={`absolute top-4 right-4 font-medium text-xs px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm bg-opacity-90 ${
            isConfirmed
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {isConfirmed ? "check_circle" : "schedule"}
          </span>
          {status}
        </div>
      </div>

      {/* Bagian Detail Text */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {title}
          </h3>
          <div className="text-gray-500 text-sm mb-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                calendar_today
              </span>
              {date}
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">tag</span>
              {orderId}
            </div>
          </div>
        </div>

        {/* Bagian Harga & Tombol */}
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100">
          <div>
            <span className="block text-gray-400 text-xs uppercase tracking-wider font-medium">
              Total
            </span>
            <span className="text-xl font-bold text-gray-900">{price}</span>
          </div>
          <button
            className={`text-sm font-medium px-5 py-2.5 rounded-lg transition-colors ${
              isConfirmed
                ? "bg-gray-900 text-white hover:bg-gray-800 shadow-md"
                : "bg-white border border-green-700 text-green-700 hover:bg-green-50"
            }`}
          >
            {isConfirmed ? "View Details" : "Complete Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
