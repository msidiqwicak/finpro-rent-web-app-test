import React from "react";
import OrderCard from "../components/booking/OrderCard"; // Sesuaikan path import

export default function OrderHistory() {
  // Simulasi data dari backend (nanti diganti dengan fetch dari API kamu)
  const dummyOrders = [
    {
      title: "Whispering Pines Cabin",
      date: "Oct 12 - Oct 15, 2026",
      orderId: "EE-84729",
      price: "Rp 845.000",
      status: "Confirmed" as const,
      image:
        "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: "Lakeside Echo Retreat",
      date: "Nov 02 - Nov 07, 2026",
      orderId: "EE-84730",
      price: "Rp 1.250.000",
      status: "Pending Payment" as const,
      image:
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=600&auto=format&fit=crop",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 pb-24 md:pb-0">
      {/* Header Sederhana */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex justify-between items-center w-full px-6 md:px-12 h-16 max-w-7xl mx-auto">
          <div className="text-xl font-bold text-green-900">Finpro Escapes</div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full material-symbols-outlined">
              notifications
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
        {/* Judul Halaman */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h1>
          <p className="text-gray-500">
            Review your past and upcoming retreats.
          </p>
        </div>

        {/* Tab Filter & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div className="flex p-1 bg-gray-100 rounded-lg w-full md:w-auto border border-gray-200">
            <button className="flex-1 md:flex-none px-6 py-2 bg-white text-gray-900 font-medium text-sm rounded-md shadow-sm">
              Ongoing
            </button>
            <button className="flex-1 md:flex-none px-6 py-2 text-gray-500 hover:text-gray-900 font-medium text-sm rounded-md transition-all">
              Completed
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search order number or date..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-600 transition-colors"
            />
          </div>
        </div>

        {/* Grid Kartu Pesanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Render data dari array */}
          {dummyOrders.map((order, index) => (
            <OrderCard key={index} {...order} />
          ))}

          {/* Kartu "Add New" / Empty State */}
          <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-8 min-h-[400px] text-center hover:bg-gray-100 transition-colors cursor-pointer group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl text-green-700">
                explore
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Plan Your Next Escape
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-[250px]">
              Discover new sanctuaries designed for mindful travel.
            </p>
            <button className="bg-green-700 text-white font-medium px-6 py-3 rounded-lg hover:bg-green-800 transition-colors">
              Explore Properties
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
