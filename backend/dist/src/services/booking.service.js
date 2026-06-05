import { prisma } from "../utils/prisma.js";
import { addHours, eachDayOfInterval, subDays, isWithinInterval, } from "date-fns";
// 1. Fungsi pembantu: Dapatkan list tanggal menginap (tanpa hari check-out)
const getStayDates = (checkIn, checkOut) => {
    return eachDayOfInterval({ start: checkIn, end: subDays(checkOut, 1) });
};
// 2. Fungsi pembantu: Hitung harga per malam (Cek kenaikan harga & ketersediaan)
const calculateNightlyPrice = (basePrice, date, modifiers) => {
    let currentPrice = basePrice;
    // Cari apakah ada modifier pada tanggal tersebut
    const activeMod = modifiers.find((m) => isWithinInterval(date, { start: m.start_date, end: m.end_date }));
    if (activeMod) {
        if (!activeMod.is_available)
            throw new Error(`Kamar tidak tersedia pada ${date.toISOString()}`);
        if (activeMod.modifier_type === "FIXED")
            currentPrice += Number(activeMod.modifier_value);
        if (activeMod.modifier_type === "PERCENTAGE") {
            currentPrice += basePrice * (Number(activeMod.modifier_value) / 100);
        }
    }
    return currentPrice;
};
// 3. Fungsi Utama: Proses pembuatan booking
export const createBookingProcess = async (userId, roomTypeId, checkIn, checkOut) => {
    // ==========================================
    // TAHAP 1: VALIDASI & CARI KAMAR OTOMATIS
    // ==========================================
    // 1. Validasi Aturan Tanggal Dasar
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkIn < today) {
        throw new Error("Tidak dapat memesan kamar untuk tanggal di masa lalu");
    }
    if (checkOut <= checkIn) {
        throw new Error("Tanggal check-out harus setelah tanggal check-in");
    }
    // 2. Auto-Assign: Cari 1 unit kamar yang aktif dan TIDAK tabrakan jadwalnya
    const availableUnit = await prisma.room_unit.findFirst({
        where: {
            room_type_id: roomTypeId,
            is_active: true,
            booking: {
                none: {
                    status: { not: "CANCELED" }, // Abaikan booking yang sudah batal/kadaluarsa
                    AND: [
                        { check_in: { lt: checkOut } }, // Jadwal orang lain mulai sebelum kita checkout
                        { check_out: { gt: checkIn } }, // DAN jadwal orang lain selesai setelah kita checkin
                    ],
                },
            },
        },
        select: { id: true }, // Kita cukup ambil ID-nya saja
    });
    if (!availableUnit) {
        throw new Error("Maaf, tipe kamar ini sudah penuh untuk tanggal yang dipilih.");
    }
    const assignedUnitId = availableUnit.id;
    // ==========================================
    // TAHAP 2: KALKULASI HARGA
    // ==========================================
    // Ambil data kamar beserta modifier harganya
    const room = await prisma.room_type.findUniqueOrThrow({
        where: { id: roomTypeId },
        include: { price_modifier: true },
    });
    const stayDates = getStayDates(checkIn, checkOut);
    // Hitung total harga dari setiap malam
    const dailyPrices = stayDates.map((date) => calculateNightlyPrice(Number(room.price_per_night), date, room.price_modifier));
    const totalPrice = dailyPrices.reduce((sum, price) => sum + price, 0);
    // ==========================================
    // TAHAP 3: EKSEKUSI DATABASE
    // ==========================================
    // Buat data booking dengan batas waktu 2 jam
    return await prisma.booking.create({
        data: {
            user_id: userId,
            room_unit_id: assignedUnitId, // PERUBAHAN: Gunakan ID unit yang didapat otomatis
            check_in: checkIn,
            check_out: checkOut,
            total_price: totalPrice,
            expires_at: addHours(new Date(), 1),
            status: "WAITING_FOR_PAYMENT",
        },
    });
};
export const getBookingDetails = async (id) => {
    return await prisma.booking.findUnique({
        where: { id },
        include: {
            room_unit: {
                include: {
                    room_type: {
                        include: {
                            property: true,
                        },
                    },
                },
            },
        },
    });
};
export const cancelBookingById = async (id) => {
    return await prisma.booking.update({
        where: { id },
        data: {
            status: "CANCELED", // Pastikan "CANCELED" sesuai dengan penulisan Enum di skema Prisma kamu
        },
    });
};
export const getAllBookings = async (userId, search, date) => {
    // 1. Siapkan kondisi awal: Wajib milik user yang sedang login
    const whereClause = {
        user_id: userId,
    };
    // 2. Filter Tanggal Check-in di Database
    if (date && date.trim() !== "") {
        // Prisma akan mencari tanggal yang persis sama di database
        whereClause.check_in = new Date(date);
    }
    // 3. Tarik data dari PostgreSQL
    let bookings = await prisma.booking.findMany({
        where: whereClause,
        orderBy: {
            created_at: "desc",
        },
        include: {
            room_unit: {
                include: {
                    room_type: {
                        include: {
                            property: true,
                        },
                    },
                },
            },
        },
    });
    // 4. Pencarian Order ID (Search)
    /* 📝 Catatan Teknis Penting:
     Tipe data ID kamu di schema adalah UUID.
     Database PostgreSQL TIDAK MENGIZINKAN pencarian teks parsial (seperti "contains") pada tipe data UUID secara bawaan di Prisma.
     
     Karena jumlah pesanan milik satu user secara spesifik biasanya tidak banyak (skala kecil),
     memfilternya di level JavaScript (setelah ditarik dari DB) adalah cara paling aman, cepat, dan anti-error.
    */
    if (search && search.trim() !== "") {
        const keyword = search.toLowerCase();
        bookings = bookings.filter((booking) => booking.id.toLowerCase().includes(keyword) || // Cari berdasarkan No Order
            booking.room_unit?.room_type?.property?.name
                .toLowerCase()
                .includes(keyword));
    }
    return bookings;
};
export const getBookingsByTenant = async (tenantId, search, status) => {
    // 1. KUNCI UTAMA KEPEMILIKAN: Memfilter lewat relasi table dari Booking sampai ke Properti Tenant
    const whereClause = {
        room_unit: {
            room_type: {
                property: {
                    tenant_id: tenantId, // 👈 Catatan: Sesuaikan jika di model properti milikmu nama kolomnya 'user_id' atau 'tenantId'
                },
            },
        },
    };
    // 2. Filter berdasarkan Status jika Tenant memilih filter tertentu (selain "Semua")
    if (status && status.trim() !== "" && status !== "Semua") {
        whereClause.status = status;
    }
    // 3. Filter berdasarkan Pencarian Nama Tamu (jika ada input text)
    if (search && search.trim() !== "") {
        whereClause.users = {
            name: {
                contains: search,
                mode: "insensitive", // Ignore huruf besar/kecil
            },
        };
    }
    return await prisma.booking.findMany({
        where: whereClause,
        orderBy: {
            created_at: "desc",
        },
        include: {
            users: {
                select: {
                    name: true,
                    email: true,
                },
            },
            room_unit: {
                include: {
                    room_type: {
                        include: {
                            property: true, // Untuk menampilkan nama properti di tabel tenant
                        },
                    },
                },
            },
            payment: {
                orderBy: { confirmed_at: "desc" },
                take: 1, // Mengambil data payment terakhir untuk ditampilkan foto bukti transfernya di modal
            },
        },
    });
};
//# sourceMappingURL=booking.service.js.map