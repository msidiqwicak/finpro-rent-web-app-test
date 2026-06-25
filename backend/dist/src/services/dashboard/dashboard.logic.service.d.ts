export declare const calculateGrowth: (thisMonth: number, lastMonth: number) => number;
export declare const processRevenue: (bookings: any[], now: Date) => {
    total: number;
    thisMonth: number;
    lastMonth: number;
    propRevs: Record<string, any>;
    monthly: any[];
};
export declare const getChartData: (monthly: number[], now: Date) => {
    month: string | undefined;
    height: string;
    label: string;
    active: boolean;
}[];
export declare const getTopProperty: (propRevs: Record<string, any>) => {
    name: any;
    location: any;
    earnings: any;
    occupancy: any;
    image: any;
    ecoFriendly: boolean;
} | null;
export declare const formatCheckins: (checkins: any[]) => {
    id: any;
    name: any;
    property: any;
    date: string;
    time: string;
    img: any;
    bg: string | undefined;
}[];
//# sourceMappingURL=dashboard.logic.service.d.ts.map