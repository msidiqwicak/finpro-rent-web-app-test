import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import TenantLayout from "../../components/layout/TenantLayout";
import DateRangePickerPopover from "../../components/tenant/reports/DateRangePickerPopover";
import SalesMetricsCards from "../../components/tenant/reports/SalesMetricsCards";
import SalesDataTable from "../../components/tenant/reports/SalesDataTable";

type GroupBy = "transaction" | "property" | "user";

export default function TenantSalesReportPage() {
  const [reportData, setReportData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Sorting State
  const [groupBy, setGroupBy] = useState<GroupBy>("transaction");
  const [sortBy, setSortBy] = useState<"date" | "total">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/reports/sales", {
          params: { groupBy, sortBy, sortOrder, startDate, endDate },
        });
        setReportData(response.data.data);
      } catch (error) {
        console.error("Gagal memuat laporan penjualan", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [groupBy, sortBy, sortOrder, startDate, endDate]);

  // Kalkulasi Metrik Dinamis
  const totalRevenue = reportData.reduce(
    (sum, item) => sum + Number(item.total_sales),
    0,
  );
  const totalBookings = reportData.reduce((sum, item) => {
    return (
      sum +
      (groupBy === "transaction" ? 1 : Number(item.total_transactions || 0))
    );
  }, 0);
  const avgRate = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const toggleSort = (column: "date" | "total") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  return (
    <TenantLayout title="Report" subtitle="Lihat report bulananmu">
      <div className="p-4 md:p-6 lg:p-10 max-w-[1280px] mx-auto w-full animate-fade-in">
        {/* Header Section */}
        <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-12">
          {/* Popover Component */}
          <DateRangePickerPopover
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            isOpen={isDatePickerOpen}
            setIsOpen={setIsDatePickerOpen}
          />
        </header>

        {/* Metrics Component */}
        <SalesMetricsCards
          totalRevenue={totalRevenue}
          totalBookings={totalBookings}
          avgRate={avgRate}
          formatCurrency={formatCurrency}
        />

        {/* Data Table Component */}
        <SalesDataTable
          reportData={reportData}
          isLoading={isLoading}
          groupBy={groupBy}
          setGroupBy={setGroupBy}
          sortBy={sortBy}
          sortOrder={sortOrder}
          toggleSort={toggleSort}
          formatCurrency={formatCurrency}
        />
      </div>
    </TenantLayout>
  );
}
