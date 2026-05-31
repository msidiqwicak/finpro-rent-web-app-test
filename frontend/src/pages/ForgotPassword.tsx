import { useState } from 'react';
import { Link } from 'react-router-dom';

const INPUT_CLS =
  'w-full pl-11 pr-4 py-3.5 bg-surface border border-outline-variant rounded-xl text-[15px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setIsError(true); setMessage('Email wajib diisi.'); return; }

    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const res  = await fetch('http://localhost:8000/api/auth/reset-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengirim permintaan.');

      // Always show a safe generic message (security best practice)
      setMessage('Jika email Anda terdaftar, link reset password telah dikirim. Silakan cek inbox Anda.');
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-low flex items-center justify-center p-5 relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-fixed/30 blur-[80px]" />

      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_4px_24px_rgba(6,27,14,0.10)] border border-outline-variant/30 p-8 sm:p-10 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="font-display font-bold text-xl text-primary">
              Evergreen Escapes
            </Link>
          </div>

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-primary-fixed/20 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[28px] text-primary">lock_reset</span>
          </div>

          <h1 className="font-display font-bold text-3xl text-on-surface mb-2">Forgot Password?</h1>
          <p className="text-on-surface-variant text-[15px]">
            No worries. Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className="mb-6">
            <label
              htmlFor="fp-email"
              className="block text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-2"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-outline text-[20px]">mail</span>
              <input
                id="fp-email"
                type="email"
                name="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setMessage(''); setIsError(false); }}
                disabled={loading}
                className={INPUT_CLS}
              />
            </div>
          </div>

          {/* Feedback Message */}
          {message && (
            <div
              className={`flex items-start gap-2 px-4 py-3 rounded-xl text-[14px] font-semibold mb-5 ${
                isError
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-px">
                {isError ? 'error' : 'check_circle'}
              </span>
              <span>{message}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-bold text-[15px] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 cursor-pointer border-none"
          >
            {loading ? (
              'Sending...'
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">send</span>
                Send Reset Link
              </>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-8 pt-6 border-t border-surface-high text-center text-[14px] text-on-surface-variant">
          <Link
            to="/login"
            className="font-bold text-primary hover:underline flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
