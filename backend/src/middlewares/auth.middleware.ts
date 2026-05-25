import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import type { TokenPayload } from '../utils/jwt.js';

// ============================================================
// EXTEND REQUEST OBJECT
// ============================================================
// Secara default, Express tidak tahu bahwa kita akan menambahkan
// properti 'user' ke dalam objek 'req'. Kita perlu menambahkan
// deklarasi tipe supaya TypeScript tidak error.
//
// Setelah middleware ini berjalan, 'req.user' akan berisi data
// dari JWT token (id, email, role) dan bisa diakses oleh
// controller mana pun yang ada di belakangnya.
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// ============================================================
// MIDDLEWARE: authenticate
// ============================================================
// Fungsi ini memverifikasi bahwa user sudah login dengan cara
// mengecek JWT token yang dikirim di header Authorization.
//
// Cara penggunaannya di route:
//   router.get('/profile', authenticate, controller);
//
// Alur kerja:
//   1. Baca header 'Authorization: Bearer <token>'
//   2. Jika tidak ada → 401 Unauthorized
//   3. Verifikasi token dengan JWT_SECRET
//   4. Jika token expired/invalid → 401
//   5. Jika token valid → simpan data ke req.user, lanjut ke controller
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Ambil nilai dari header Authorization
    const authHeader = req.headers['authorization'];

    // Format header harus: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Akses ditolak. Token tidak ditemukan.' });
      return;
    }

    // Ambil token-nya saja (hapus kata "Bearer " di depan secara aman)
    let token = authHeader.substring(7).trim();

    // Hapus duplikasi "Bearer " jika ada (misal karena salah paste di Postman)
    if (token.toLowerCase().startsWith('bearer ')) {
      token = token.substring(7).trim();
    }

    // Hapus tanda kurung siku < > jika user tidak sengaja menyertakannya
    if (token.startsWith('<') && token.endsWith('>')) {
      token = token.substring(1, token.length - 1).trim();
    }

    // Guard tambahan: jika token kosong, tolak request
    if (!token) {
      res.status(401).json({ error: 'Token tidak ditemukan dalam header.' });
      return;
    }

    // Verifikasi token menggunakan JWT_SECRET dari .env
    // Jika token expired atau tanda tangannya palsu, akan throw error
    const decoded = verifyToken(token);

    // Pastikan token ini adalah 'access' token, bukan token verifikasi email
    if (decoded.purpose !== 'access') {
      res.status(401).json({ error: 'Token tidak valid untuk akses ini.' });
      return;
    }

    // Simpan data user dari token ke req.user agar bisa diakses controller
    req.user = decoded;

    // Lanjut ke middleware/controller berikutnya
    next();
  } catch (err: any) {
    res.status(401).json({
      error: 'Token tidak valid atau sudah kadaluarsa.',
      details: err.message
    });
  }
};

// ============================================================
// MIDDLEWARE: authorizeRole
// ============================================================
// Fungsi ini memastikan user yang sudah login memiliki role yang
// dibutuhkan untuk mengakses sebuah endpoint.
//
// PENTING: Middleware ini HARUS digunakan SETELAH 'authenticate'
// karena ia membutuhkan req.user yang di-set oleh 'authenticate'.
//
// Cara penggunaannya di route:
//   router.get('/dashboard', authenticate, authorizeRole('TENANT'), controller);
//   router.get('/bookings', authenticate, authorizeRole('USER'), controller);
export const authorizeRole = (...roles: Array<'USER' | 'TENANT'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Cek apakah user ada dan role-nya masuk dalam daftar yang diizinkan
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        error: `Akses ditolak. Fitur ini hanya untuk: ${roles.join(', ')}.`,
      });
      return;
    }

    // Role cocok, lanjut ke controller
    next();
  };
};
