import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function VerifyPassword() {
  // 1. Mengekstrak token dari parameter URL (?token=xyz)
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // 2. State untuk menangani kondisi loading, success, dan error
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // Jika tidak ada token di URL, langsung set status error
    if (!token) {
      setStatus('error');
      return;
    }

    // Fungsi asinkron untuk memvalidasi token
    const verifyToken = async () => {
      try {
        // 3. Simulasi pemanggilan API (sesuai instruksi mentor)
        // Di dunia nyata, ini akan berupa: await fetch('/api/auth/verify-reset-token', { ... })
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulasi: jika token valid, kita resolve. Jika invalid, kita reject.
            // Di sini kita anggap selalu valid untuk keperluan testing
            if (token === 'invalid') reject(new Error('Invalid token'));
            else resolve('Success');
          }, 1500); // Simulasi waktu tunggu server selama 1.5 detik
        });

        // 4. Jika API berhasil (token valid), set status ke success
        setStatus('success');
      } catch (error) {
        // Jika token tidak valid / kadaluarsa
        setStatus('error');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-surface-low flex items-center justify-center p-5 relative overflow-hidden">
      {/* Efek dekorasi background */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary-container/40 blur-[80px]" />

      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_4px_24px_rgba(6,27,14,0.10)] border border-outline-variant/30 p-8 sm:p-10 relative z-10 text-center">
        
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-secondary-container mx-auto flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[28px] text-on-secondary-container">key</span>
        </div>

        <h1 className="font-display font-bold text-3xl text-on-surface mb-2">Verifikasi Reset Password</h1>
        
        {/* Render UI responsif terhadap status */}
        {status === 'loading' && (
          <div className="mt-8">
            <span className="material-symbols-outlined text-primary text-[40px] animate-spin block mb-4">progress_activity</span>
            <p className="text-blue-600 font-medium">Sedang memverifikasi token Anda...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[36px] text-emerald-600">check_circle</span>
            </div>
            <p className="text-green-600 font-bold text-[18px] mb-2">Verifikasi Berhasil!</p>
            <p className="text-on-surface-variant text-[15px]">Token valid. Anda sekarang dapat mengatur ulang password Anda.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[36px] text-red-600">error</span>
            </div>
            <p className="text-red-600 font-bold text-[18px] mb-2">Verifikasi Gagal</p>
            <p className="text-on-surface-variant text-[15px]">Link tidak valid atau sudah kadaluarsa. Silakan minta link baru.</p>
          </div>
        )}
      </div>
    </div>
  );
}
