
import OrderCard from "./OrderCard"; // Pastikan path ini sesuai

interface OrderListGridProps {
  orders: any[];
  isLoading: boolean;
  onActionClick: (orderId: string, status: string) => void;
}

// Fungsi helper dipindah ke luar komponen agar tidak dirender ulang terus-menerus
const formatStatus = (dbStatus: string) => {
  switch (dbStatus) {
    case "WAITING_FOR_PAYMENT":
      return "Pending Payment";
    case "WAITING_FOR_CONFIRMATION":
      return "Waiting Confirmation";
    case "CONFIRMED":
      return "Confirmed";
    case "CANCELED":
      return "Canceled";
    default:
      return dbStatus;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function OrderListGrid({
  orders,
  isLoading,
  onActionClick,
}: OrderListGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-body text-sm font-bold animate-pulse">
          Memuat riwayat pesanan...
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 px-4 text-on-surface-variant bg-white rounded-2xl border border-dashed border-outline-variant/50">
        <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">
          search_off
        </span>
        <p className="font-bold text-lg text-on-surface">
          Tidak ada pesanan ditemukan
        </p>
        <p className="text-sm mt-1">
          Coba ubah filter pencarian atau tanggal Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {orders.map((order) => {
        const propertyImages = order.room_unit?.room_type?.property?.image_urls;
        const imageUrl =
          propertyImages && propertyImages.length > 0
            ? propertyImages[0]
            : "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=600&auto=format&fit=crop";

        return (
          <OrderCard
            key={order.id}
            title={
              order.room_unit?.room_type?.property?.name ||
              "Finpro Escapes Property"
            }
            subtitle={order.room_unit?.room_type?.name || "Standard Room"}
            date={`${new Date(order.check_in).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })} - ${new Date(order.check_out).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}`}
            orderId={order.id.substring(0, 8).toUpperCase()}
            price={formatCurrency(Number(order.total_price))}
            status={formatStatus(order.status)}
            image={imageUrl}
            onActionClick={() => onActionClick(order.id, order.status)}
          />
        );
      })}
    </div>
  );
}
