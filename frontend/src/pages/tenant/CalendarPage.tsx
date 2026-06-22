import React, { useState, useEffect, useMemo } from "react";
import api from "../../api/axiosConfig";
import TenantLayout from "../../components/layout/TenantLayout";
import AnalyticsSidebar from "../../components/tenant/calendar/AnalyticsSidebar";
import CalendarGrid from "../../components/tenant/calendar/CalendarGrid";

export default function TenantPropertyCalendarPage() {
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const monthStr = `${year}-${String(month).padStart(2, "0")}`;

  const fetchCalendarData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/reports/calendar`, {
        params: { month: monthStr },
      });
      const data = response.data.data || [];
      setCalendarData(data);
      if (data.length > 0 && !selectedPropertyId) {
        setSelectedPropertyId(data[0].property_id);
      }
    } catch (error) {
      console.error("Gagal memuat kalender ketersediaan", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [monthStr]);

  const activeProperty = useMemo(() => {
    return calendarData.find((p) => p.property_id === selectedPropertyId);
  }, [calendarData, selectedPropertyId]);

  const firstDayIndex = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const calendarDays = useMemo(() => {
    const blanks = Array(firstDayIndex).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return [...blanks, ...days];
  }, [firstDayIndex, daysInMonth]);

  const getDayStatus = (day: number) => {
    if (!activeProperty)
      return { bookedUnits: [], totalAvailable: 0, totalUnits: 0 };
    const targetDateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const targetDate = new Date(targetDateStr);

    let totalUnits = 0;
    let bookedCount = 0;
    const bookedUnitsList: string[] = [];

    activeProperty.room_types.forEach((rt: any) => {
      rt.units.forEach((unit: any) => {
        totalUnits++;
        const hasBooking = unit.bookings.some((b: any) => {
          const checkIn = new Date(b.check_in.split("T")[0]);
          const checkOut = new Date(b.check_out.split("T")[0]);
          return targetDate >= checkIn && targetDate < checkOut;
        });

        if (hasBooking) {
          bookedCount++;
          bookedUnitsList.push(
            `${rt.room_type_name.split(" ")[0]} ${unit.unit_number}`,
          );
        }
      });
    });

    return {
      bookedUnits: bookedUnitsList,
      totalAvailable: totalUnits - bookedCount,
      totalUnits,
    };
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const sidebarMetrics = useMemo(() => {
    let totalUnits = 0;
    let occupiedUnits = 0;
    const arrivals: any[] = [];

    if (activeProperty) {
      activeProperty.room_types.forEach((rt: any) => {
        rt.units.forEach((unit: any) => {
          totalUnits++;
          unit.bookings.forEach((b: any) => {
            const bCheckIn = b.check_in.split("T")[0];
            const bCheckOut = b.check_out.split("T")[0];
            if (todayStr >= bCheckIn && todayStr < bCheckOut) occupiedUnits++;
            if (bCheckIn === todayStr) {
              arrivals.push({
                guest_name: b.guest_name,
                unit_info: `${rt.room_type_name} • Unit ${unit.unit_number}`,
                id: b.booking_id,
              });
            }
          });
        });
      });
    }
    const occupancyRate =
      totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
    return { totalUnits, occupiedUnits, occupancyRate, arrivals };
  }, [activeProperty, todayStr]);

  return (
    <TenantLayout
      title="Calendar"
      subtitle="Lihat kalender ketersediaan properti"
    >
      <div className="flex flex-col xl:flex-row flex-1 gap-6 lg:gap-8 max-w-[1280px] mx-auto w-full animate-fade-in pt-2 pb-10">
        <CalendarGrid
          currentDate={currentDate}
          handlePrevMonth={() =>
            setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1))
          }
          handleNextMonth={() =>
            setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1))
          }
          isLoading={isLoading}
          calendarDays={calendarDays}
          getDayStatus={getDayStatus}
          calendarData={calendarData}
          selectedPropertyId={selectedPropertyId}
          setSelectedPropertyId={setSelectedPropertyId}
        />

        <AnalyticsSidebar metrics={sidebarMetrics} />
      </div>
    </TenantLayout>
  );
}
