
interface OrderCardProps {
  title: string;
  subtitle: string;
  date: string;
  orderId: string;
  price: string;
  status: string;
  image: string;
  onActionClick: () => void;
}

export default function OrderCard({
  title,
  subtitle,
  date,
  orderId,
  price,
  status,
  image,
  onActionClick,
}: OrderCardProps) {
  // Fungsi helper untuk menentukan warna lencana (badge) berdasarkan status
  const getStatusStyles = (currentStatus: string) => {
    switch (currentStatus) {
      case "Pending Payment":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Waiting Confirmation":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Confirmed":
        return "bg-[#d0e9d4] text-primary border-primary/20"; // Menggunakan warna dari tema Evergreen-mu
      case "Canceled":
        return "bg-error-container text-on-error-container border-error/20";
      default:
        return "bg-surface-container text-on-surface-variant border-outline-variant/30";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 group">
      {/* Bagian Gambar (Header Kartu) */}
      <div className="h-48 w-full overflow-hidden relative bg-surface-container-low">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback jika gambar gagal dimuat
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=600&auto=format&fit=crop";
          }}
        />
        {/* Lencana Status di pojok kanan atas gambar */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider backdrop-blur-sm bg-opacity-90 ${getStatusStyles(status)}`}
        >
          {status}
        </div>
      </div>

      {/* Bagian Informasi (Body Kartu) */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Judul & Subjudul */}
        <div className="mb-5">
          <h3
            className="font-headline-sm text-lg font-bold text-primary line-clamp-1"
            title={title}
          >
            {title}
          </h3>
          <p className="text-sm text-on-surface-variant line-clamp-1">
            {subtitle}
          </p>
        </div>

        {/* Detail (Tanggal, ID, Harga) */}
        <div className="space-y-2.5 mb-6">
          <div className="flex items-center gap-3 text-sm text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              calendar_month
            </span>
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              tag
            </span>
            <span className="font-medium text-on-surface-variant">
              Order ID:{" "}
              <span className="text-on-surface uppercase">{orderId}</span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-primary">
            <span className="material-symbols-outlined text-[18px] text-secondary">
              payments
            </span>
            <span>{price}</span>
          </div>
        </div>

        {/* Tombol Aksi */}
        <button
          onClick={onActionClick}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all mt-auto active:scale-[0.98] ${
            status === "Pending Payment"
              ? "bg-primary text-white hover:opacity-90 shadow-sm" // Menonjol jika butuh dibayar
              : "bg-surface-container-low border border-outline-variant/30 text-primary hover:bg-surface-container" // Biasa jika hanya lihat detail
          }`}
        >
          {status === "Pending Payment" ? "Pay Now" : "View Details"}
        </button>
      </div>
    </div>
  );
}
