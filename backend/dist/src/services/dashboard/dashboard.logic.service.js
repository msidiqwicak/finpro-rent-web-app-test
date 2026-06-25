export const calculateGrowth = (thisMonth, lastMonth) => {
    if (lastMonth > 0)
        return Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
    return thisMonth > 0 ? 100 : 0;
};
const formatCompact = (num) => {
    if (num === 0)
        return "Rp 0";
    if (num >= 1000000)
        return `Rp ${(num / 1000000).toFixed(1).replace(".0", "")}M`;
    if (num >= 1000)
        return `Rp ${(num / 1000).toFixed(1).replace(".0", "")}K`;
    return `Rp ${num}`;
};
export const processRevenue = (bookings, now) => {
    let total = 0, thisMonth = 0, lastMonth = 0;
    const propRevs = {};
    const monthly = Array(6).fill(0);
    const curM = now.getMonth(), curY = now.getFullYear();
    const lastM = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    bookings.forEach((b) => {
        const rev = Number(b.total_price), bDate = new Date(b.created_at);
        total += rev;
        if (bDate.getMonth() === curM && bDate.getFullYear() === curY)
            thisMonth += rev;
        else if (bDate.getMonth() === lastM.getMonth() && bDate.getFullYear() === lastM.getFullYear())
            lastMonth += rev;
        const mDiff = (curY - bDate.getFullYear()) * 12 + (curM - bDate.getMonth());
        if (mDiff >= 0 && mDiff < 6)
            monthly[5 - mDiff] += rev;
        const prop = b.room_unit?.room_type?.property;
        if (prop) {
            if (!propRevs[prop.id])
                propRevs[prop.id] = { property: prop, revenue: 0, count: 0 };
            propRevs[prop.id].revenue += rev;
            propRevs[prop.id].count += 1;
        }
    });
    return { total, thisMonth, lastMonth, propRevs, monthly };
};
export const getChartData = (monthly, now) => {
    const max = Math.max(...monthly, 1);
    const names = Array.from({ length: 6 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - 5 + i, 1).toLocaleDateString("id-ID", { month: "short" }));
    return monthly.map((rev, idx) => ({
        month: names[idx], height: rev === 0 ? "0%" : `${Math.round((rev / max) * 100)}%`,
        label: formatCompact(rev), active: idx === 5,
    }));
};
export const getTopProperty = (propRevs) => {
    const sorted = Object.values(propRevs).sort((a, b) => b.revenue - a.revenue);
    if (!sorted.length)
        return null;
    const top = sorted[0];
    return {
        name: top.property.name, location: top.property.city, earnings: top.revenue,
        occupancy: top.count, image: top.property.image_urls?.[0] || "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=600&auto=format&fit=crop",
        ecoFriendly: false,
    };
};
export const formatCheckins = (checkins) => {
    const bg = ["bg-secondary-fixed", "bg-primary-fixed", "bg-tertiary-fixed"];
    return checkins.map((b, i) => {
        const isTmrw = new Date(b.check_in).getDate() === new Date().getDate() + 1;
        return {
            id: b.id, name: b.users?.name || "Guest", property: b.room_unit?.room_type?.property?.name || "Property",
            date: isTmrw ? "Tomorrow" : new Date(b.check_in).toLocaleDateString("id-ID", { month: "short", day: "numeric" }),
            time: new Date(b.check_in).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            img: b.users?.avatar_url || null, bg: bg[i % bg.length],
        };
    });
};
//# sourceMappingURL=dashboard.logic.service.js.map