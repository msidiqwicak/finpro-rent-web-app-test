export declare const getTenantDashboardStats: (tenantUserId: string) => Promise<{
    metrics: {
        totalRevenue: number;
        revenueGrowth: number;
        activeBookings: number;
        occupancy: number;
        averageRating: number;
    };
    chartData: {
        month: string | undefined;
        height: string;
        label: string;
        active: boolean;
    }[];
    upcomingCheckins: {
        id: any;
        name: any;
        property: any;
        date: string;
        time: string;
        img: any;
        bg: string | undefined;
    }[];
    topProperty: {
        name: any;
        location: any;
        earnings: any;
        occupancy: any;
        image: any;
        ecoFriendly: boolean;
    } | null;
}>;
//# sourceMappingURL=dashboard.service.d.ts.map