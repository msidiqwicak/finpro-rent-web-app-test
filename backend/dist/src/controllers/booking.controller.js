import { createBookingProcess, getBookingDetails, cancelBookingById, getAllBookings, } from "../services/booking.service.js";
export const createBooking = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { roomTypeId, checkIn, checkOut } = req.body;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized. Harap login." });
            return;
        }
        const booking = await createBookingProcess(userId, roomTypeId, new Date(checkIn), new Date(checkOut));
        res.status(201).json({ message: "Booking berhasil dibuat", data: booking });
    }
    catch (error) {
        res
            .status(400)
            .json({ error: error.message || "Terjadi kesalahan pada server" });
    }
};
export const getBookingById = async (req, res) => {
    try {
        // 1. Ambil userId dari token JWT
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized. Harap login." });
            return;
        }
        if (!id || typeof id !== "string") {
            res.status(400).json({ error: "ID pesanan tidak valid" });
            return;
        }
        // 2. Panggil Service
        const booking = await getBookingDetails(id);
        if (!booking) {
            res.status(404).json({ error: "Pesanan tidak ditemukan" });
            return;
        }
        // 3. 🚨 INLINE OWNERSHIP CHECK: Pastikan pesanan milik user yang sedang login
        if (booking.user_id !== userId) {
            res.status(403).json({
                error: "Forbidden. Akses ditolak karena ini bukan pesanan Anda.",
            });
            return;
        }
        res.status(200).json({ data: booking });
    }
    catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server." });
    }
};
export const cancelBookingProcess = async (req, res) => {
    try {
        // 1. Ambil userId dari token JWT
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized. Harap login." });
            return;
        }
        if (!userId) {
            res.status(401).json({ error: "Unauthorized. Harap login." });
            return;
        }
        if (!id || typeof id !== "string") {
            res.status(400).json({ error: "ID pesanan tidak valid." });
            return;
        }
        // 2. 🚨 INLINE OWNERSHIP CHECK: Cek dulu datanya sebelum dibatalkan
        const booking = await getBookingDetails(id);
        if (!booking) {
            res.status(404).json({ error: "Pesanan tidak ditemukan" });
            return;
        }
        if (booking.user_id !== userId) {
            res.status(403).json({
                error: "Forbidden. Anda tidak memiliki izin untuk membatalkan pesanan ini.",
            });
            return;
        }
        // 3. Lakukan proses update status
        await cancelBookingById(id);
        res.status(200).json({ message: "Pesanan berhasil dibatalkan." });
    }
    catch (error) {
        console.error("Error canceling booking:", error);
        res
            .status(500)
            .json({ error: "Terjadi kesalahan saat membatalkan pesanan." });
    }
};
export const getBookings = async (req, res) => {
    try {
        const { search, date } = req.query;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Akses ditolak. Harap login." });
            return;
        }
        const searchQuery = typeof search === "string" ? search : undefined;
        const dateQuery = typeof date === "string" ? date : undefined;
        const bookings = await getAllBookings(userId, searchQuery, dateQuery);
        res.status(200).json({ data: bookings });
    }
    catch (error) {
        console.error("Error fetching bookings history:", error);
        res
            .status(500)
            .json({ error: "Terjadi kesalahan saat mengambil riwayat pesanan." });
    }
};
//# sourceMappingURL=booking.controller.js.map