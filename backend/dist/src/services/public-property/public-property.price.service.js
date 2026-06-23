import { prisma } from "../../utils/prisma.js";
import { calcAdjustedPrice } from "./public-property.types.js";
export const getRoomCalendarPrices = async (roomId, monthStr) => {
    const parts = monthStr.split("-");
    if (parts.length !== 2)
        throw new Error("Format bulan tidak valid. Gunakan YYYY-MM.");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    if (isNaN(year) || isNaN(month))
        throw new Error("Format bulan tidak valid. Gunakan YYYY-MM.");
    const roomType = await prisma.room_type.findFirst({
        where: { id: roomId, deleted_at: null }, include: { price_modifier: true },
    });
    if (!roomType)
        throw new Error("Tipe kamar tidak ditemukan.");
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendar = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const target = new Date(dateStr);
        target.setHours(12, 0, 0, 0);
        const isBlocked = roomType.price_modifier.some((m) => {
            if (m.is_available !== false)
                return false;
            const start = new Date(m.start_date), end = new Date(m.end_date);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            return target >= start && target <= end;
        });
        if (isBlocked) {
            calendar.push({ date: dateStr, price: 0, available: false });
            continue;
        }
        const activeMods = roomType.price_modifier.filter((m) => m.is_available !== false);
        calendar.push({ date: dateStr, price: calcAdjustedPrice(roomType.price_per_night, activeMods, target), available: true });
    }
    return calendar;
};
//# sourceMappingURL=public-property.price.service.js.map