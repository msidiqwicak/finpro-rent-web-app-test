import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function VerifyEmail() {
  // 1. Ekstrak token dari URL (?token=xyz)
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // Validasi awal jika token kosong
    if (!token) {
      setStatus('error');
      return;
    }

    const verifyEmailUpdate = async () => {
      try {
        // 2. Simulasi API Call ke backend untuk konfirmasi email baru
        // Di dunia nyata: fetch('/api/auth/verify-email-update', { method: 'POST', body: JSON.stringify({ token }) })
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (token === 'invalid') reject(new Error('Invalid link'));
            else resolve('Success');
          }, 1500); // Simulasi delay jaringan 1.5 detik
        });
        
        // 3. Jika berhasil divalidasi
        setStatus('success');
      } catch (error) {
        // 4. Jika gagal
        setStatus('error');
      }
    };

    verifyEmailUpdate();
  }, [token]);

  return (
    <div className="min-h-screen bg-surface-low flex items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-fixed/30 blur-[80px]" />

      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_4px_24px_rgba(6,27,14,0.10)] border border-outline-variant/30 p-8 sm:p-10 relative z-10 text-center">
        
        <div className="w-14 h-14 rounded-2xl bg-primary-fixed mx-auto flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[28px] text-primary">mark_email_read</span>
        </div>

        <h1 className="font-display font-bold text-3xl text-on-surface mb-2">Konfirmasi Email Baru</h1>
        
        {/* State: Loading */}
        {status === 'loading' && (
          <div className="mt-8">
            <span className="material-symbols-outlined text-primary text-[40px] animate-spin block mb-4">progress_activity</span>
            <p className="text-blue-600 font-medium">Memverifikasi email Anda...</p>
          </div>
        )}

        {/* State: Success */}
        {status === 'success' && (
          <div className="mt-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[36px] text-emerald-600">check_circle</span>
            </div>
            <p className="text-green-600 font-bold text-[18px] mb-2">Verifikasi Berhasil!</p>
            <p className="text-on-surface-variant text-[15px]">Alamat email Anda telah berhasil diperbarui di sistem kami.</p>
          </div>
        )}

        {/* State: Error */}
        {status === 'error' && (
          <div className="mt-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[36px] text-red-600">error</span>
            </div>
            <p className="text-red-600 font-bold text-[18px] mb-2">Verifikasi Gagal</p>
            <p className="text-on-surface-variant text-[15px]">Link tidak valid atau sudah kadaluarsa. Silakan ajukan ulang perubahan email dari profil Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
