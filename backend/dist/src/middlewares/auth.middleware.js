import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../utils/prisma.js";
// ============================================================
// MIDDLEWARE: authenticate
// ============================================================
export const authenticate = (req, res, next) => {
    try {
        let token = req.cookies?.token;
        if (!token) {
            const authHeader = req.headers["authorization"];
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7).trim();
            }
        }
        if (!token) {
            res.status(401).json({ error: "Akses ditolak. Token tidak ditemukan." });
            return;
        }
        if (token.toLowerCase().startsWith("bearer ")) {
            token = token.substring(7).trim();
        }
        if (token.startsWith("<") && token.endsWith(">")) {
            token = token.substring(1, token.length - 1).trim();
        }
        const decoded = verifyToken(token);
        if (decoded.purpose !== "access") {
            res.status(401).json({ error: "Token tidak valid untuk akses ini." });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({
            error: "Token tidak valid atau sudah kadaluarsa.",
            details: err.message,
        });
    }
};
// ============================================================
// MIDDLEWARE: authorizeRole
// ============================================================
export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                error: `Akses ditolak. Fitur ini hanya untuk: ${roles.join(", ")}.`,
            });
            return;
        }
        next();
    };
};
// ============================================================
// MIDDLEWARE: verifyBookingOwnership
// ============================================================
// Memastikan bahwa booking yang diakses adalah milik user yang sedang login.
// Booking ID diambil dari req.params.id ATAU req.body.bookingId.
//
// PENTING: Middleware ini HARUS digunakan SETELAH 'authenticate'.
//
// Cara penggunaannya di route:
//   router.get('/:id', authenticate, authorizeRole('USER'), verifyBookingOwnership, controller);
//   router.post('/upload', authenticate, authorizeRole('USER'), verifyBookingOwnership, controller);
export const verifyBookingOwnership = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Akses ditolak. User tidak terautentikasi." });
            return;
        }
        // Cek booking ID dari params (GET/PUT/DELETE /:id) atau dari body (POST upload)
        const bookingId = req.params.id || req.body.bookingId;
        if (!bookingId) {
            res.status(400).json({ error: "Booking ID tidak ditemukan dalam request." });
            return;
        }
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            select: { user_id: true },
        });
        if (!booking) {
            res.status(404).json({ error: "Pesanan tidak ditemukan." });
            return;
        }
        if (booking.user_id !== userId) {
            res.status(403).json({ error: "Akses ditolak. Pesanan ini bukan milik Anda." });
            return;
        }
        next();
    }
    catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan saat memverifikasi kepemilikan pesanan." });
    }
};
//# sourceMappingURL=auth.middleware.js.map