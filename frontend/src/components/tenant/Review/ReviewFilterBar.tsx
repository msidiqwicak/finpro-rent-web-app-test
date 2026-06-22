
interface ReviewFilterBarProps {
  reviewCount: number;
  // Nanti kamu bisa tambahkan filter rating beneran di sini
  // activeFilter: string;
  // setActiveFilter: (val: string) => void;
}

export default function ReviewFilterBar({ reviewCount }: ReviewFilterBarProps) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm mb-6 border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary">
          filter_list
        </span>
        <span className="text-sm font-bold uppercase tracking-wider text-on-surface-variant whitespace-nowrap">
          Filter By
        </span>
      </div>

      <select className="w-full sm:w-auto bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-2.5 text-sm font-bold text-on-surface outline-none cursor-pointer hover:border-secondary transition-colors focus:ring-2 focus:ring-secondary/20">
        <option>All Ratings</option>
        <option>5 Stars</option>
        <option>Needs Reply</option>
      </select>

      <div className="w-full sm:w-auto sm:ml-auto flex justify-end">
        <span className="text-xs font-bold text-primary bg-[#d0e9d4] px-3 py-1.5 rounded-full">
          Showing {reviewCount} reviews
        </span>
      </div>
    </div>
  );
}
