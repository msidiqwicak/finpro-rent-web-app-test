import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const INPUT_CLS =
  'w-full pl-11 pr-12 py-3.5 bg-surface border border-outline-variant rounded-xl text-[15px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60';

export default function ResetPassword() {
  const { token }                     = useParams<{ token: string }>();
  const navigate                      = useNavigate();
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass,        setShowPass]        = useState(false);
  const [showConf,        setShowConf]        = useState(false);
  const [loading,    setLoading]      = useState(false);
  const [message,    setMessage]      = useState('');
  const [isError,    setIsError]      = useState(false);
  const [isDone,     setIsDone]       = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setIsError(true);
      setMessage('Password minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setIsError(true);
      setMessage('Password dan Konfirmasi Password tidak cocok.');
      return;
    }
    if (!token) {
      setIsError(true);
      setMessage('Token tidak ditemukan di URL. Silakan minta link baru.');
      return;
    }

    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      await api.post('/auth/confirm-reset', { token, newPassword: password });
      
      setIsDone(true);
      setIsError(false);
      setMessage('Password berhasil direset! Anda akan diarahkan ke halaman login...');

      // Redirect to login after short delay
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setIsError(true);
      setMessage(
        err.message.includes('invalid signature') || err.message.includes('Token tidak valid')
          ? 'Link reset ini sudah tidak valid atau sudah pernah digunakan. Silakan minta link baru.'
          : err.message || 'Terjadi kesalahan. Silakan coba lagi.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-low flex items-center justify-center p-5 relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary-container/40 blur-[80px]" />

      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_4px_24px_rgba(6,27,14,0.10)] border border-outline-variant/30 p-8 sm:p-10 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="font-display font-bold text-xl text-primary">
              Evergreen Escapes
            </Link>
          </div>

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[28px] text-on-secondary-container">key</span>
          </div>

          <h1 className="font-display font-bold text-3xl text-on-surface mb-2">Create New Password</h1>
          <p className="text-on-surface-variant text-[15px]">
            Your new password must be at least 6 characters long.
          </p>
        </div>

        {!isDone ? (
          <form onSubmit={handleSubmit} noValidate>
            {/* Password Field */}
            <div className="mb-6">
              <label
                htmlFor="rp-password"
                className="block text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-2"
              >
                New Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-outline text-[20px]">lock</span>
                <input
                  id="rp-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setMessage(''); setIsError(false); }}
                  disabled={loading}
                  className={INPUT_CLS}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 text-outline hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6">
              <label
                htmlFor="rp-confirm"
                className="block text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-2"
              >
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-outline text-[20px]">lock_reset</span>
                <input
                  id="rp-confirm"
                  name="confirmPassword"
                  type={showConf ? 'text' : 'password'}
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setMessage(''); setIsError(false); }}
                  disabled={loading}
                  className={INPUT_CLS}
                />
                <button
                  type="button"
                  onClick={() => setShowConf(!showConf)}
                  className="absolute right-4 text-outline hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
                  aria-label={showConf ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConf ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {message && isError && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-[14px] font-semibold mb-5 bg-red-50 text-red-700 border border-red-200">
                <span className="material-symbols-outlined text-[20px] shrink-0 mt-px">error</span>
                <span>{message}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-on-secondary font-bold text-[15px] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 cursor-pointer border-none"
            >
              {loading ? (
                'Resetting...'
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  Reset Password
                </>
              )}
            </button>
          </form>
        ) : (
          /* Success State */
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[36px] text-emerald-600">check_circle</span>
            </div>
            <p className="text-[15px] font-semibold text-emerald-800">{message}</p>
          </div>
        )}

        {/* Link to request new token if expired */}
        {isError && (
          <div className="mt-6 pt-5 border-t border-surface-high text-center text-[14px] text-on-surface-variant">
            <Link to="/forgot-password" className="font-bold text-primary hover:underline">
              Request a new reset link
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
