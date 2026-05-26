import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const INPUT_CLS = 'w-full pl-11 pr-11 py-3.5 bg-surface border border-outline-variant rounded-xl text-[15px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60';
const LABEL_CLS = 'block text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-2';

function getPasswordStrength(pwd: string) {
  if (pwd.length === 0) return { level: 0, label: '', colorClass: '' };
  let score = 0;
  if (pwd.length >= 8)         score++;
  if (/[A-Z]/.test(pwd))       score++;
  if (/[0-9]/.test(pwd))       score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { level: score, label: 'Weak',        colorClass: 'text-red-700',    bgClass: 'bg-red-500' };
  if (score === 2) return { level: score, label: 'Fair',        colorClass: 'text-amber-600',  bgClass: 'bg-amber-500' };
  if (score === 3) return { level: score, label: 'Strong',      colorClass: 'text-secondary',  bgClass: 'bg-secondary' };
  return             { level: score, label: 'Very Strong', colorClass: 'text-primary',    bgClass: 'bg-primary' };
}

function ToggleBtn({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle}
      className="absolute right-4 text-outline hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
    >
      <span className="material-symbols-outlined text-[20px]">{show ? 'visibility_off' : 'visibility'}</span>
    </button>
  );
}

function SuccessScreen() {
  return (
    <div className="min-h-screen bg-surface-low flex items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-fixed/30 blur-[80px]" />
      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_4px_24px_rgba(6,27,14,0.10)] border border-outline-variant/30 p-8 sm:p-10 relative z-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[40px] text-secondary">verified</span>
        </div>
        <h1 className="font-display font-bold text-3xl text-on-surface mb-2">Account Created!</h1>
        <p className="text-on-surface-variant text-[15px] mb-8">Welcome to Evergreen Escapes! You will be redirected to the login page in 3 seconds...</p>
        <Link to="/login" className="w-full bg-primary text-on-primary font-bold text-[15px] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[20px]">login</span> Sign In Now
        </Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  const { token } = useParams<{ token: string }>();
  const navigate  = useNavigate();
  const [form, setForm]           = useState({ password: '', confirmPassword: '' });
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState(false);

  useEffect(() => {
    if (success) { const t = setTimeout(() => navigate('/login'), 3000); return () => clearTimeout(t); }
  }, [success, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.password)                          return setError('Password is required.');
    if (form.password.length < 8)                return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirmPassword)  return setError('Passwords do not match.');
    if (!token)                                  return setError('Invalid verification token.');
    setLoading(true); setError('');
    try {
      const res  = await fetch('http://localhost:8000/api/auth/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password: form.password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed.');
      setSuccess(true);
    } catch (err: any) {
      let msg = err.message;
      if (msg.includes('Token tidak valid'))         msg = 'Invalid token.';
      if (msg.includes('User tidak ditemukan'))      msg = 'User not found.';
      if (msg.includes('Akun sudah terverifikasi'))  msg = 'Account already verified.';
      setError(msg);
    } finally { setLoading(false); }
  };

  if (success) return <SuccessScreen />;

  const strength  = getPasswordStrength(form.password);
  const passMatch = form.confirmPassword && form.password === form.confirmPassword;

  return (
    <div className="min-h-screen bg-surface-low flex items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-fixed/30 blur-[80px]" />

      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_4px_24px_rgba(6,27,14,0.10)] border border-outline-variant/30 p-8 sm:p-10 relative z-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="font-display font-bold text-xl text-primary">Evergreen Escapes</Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase rounded-full tracking-wider">
              <span className="material-symbols-outlined text-[16px]">lock_open</span>
              Account Verification
            </div>
          </div>
          <h1 className="font-display font-bold text-3xl text-on-surface mb-2">Set Your Password</h1>
          <p className="text-on-surface-variant text-[15px]">One last step! Create a strong password to secure your account.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Password field */}
          <div className="mb-5 relative">
            <label htmlFor="verify-password" className={LABEL_CLS}>New Password</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-outline text-[20px]">lock</span>
              <input id="verify-password" name="password" type={showPass ? 'text' : 'password'}
                placeholder="At least 8 characters" value={form.password} onChange={handleChange} disabled={loading} className={INPUT_CLS}
              />
              <ToggleBtn show={showPass} onToggle={() => setShowPass(!showPass)} />
            </div>
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1 h-1.5 rounded-full overflow-hidden mb-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`flex-1 transition-colors duration-300 rounded-full ${i <= strength.level ? strength.bgClass : 'bg-outline-variant'}`} />
                  ))}
                </div>
                <span className={`text-[12px] font-bold ${strength.colorClass}`}>{strength.label}</span>
              </div>
            )}
          </div>

          {/* Confirm Password field */}
          <div className="mb-5 relative">
            <label htmlFor="verify-confirm" className={LABEL_CLS}>Confirm Password</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-outline text-[20px]">lock_reset</span>
              <input id="verify-confirm" name="confirmPassword" type={showConf ? 'text' : 'password'}
                placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange} disabled={loading} className={INPUT_CLS}
              />
              <ToggleBtn show={showConf} onToggle={() => setShowConf(!showConf)} />
            </div>
            {form.confirmPassword && (
              <span className={`flex items-center gap-1 text-[12px] font-bold mt-2 ${passMatch ? 'text-secondary' : 'text-red-700'}`}>
                <span className="material-symbols-outlined text-[14px]">{passMatch ? 'check_circle' : 'cancel'}</span>
                {passMatch ? 'Passwords match' : 'Passwords do not match'}
              </span>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-[14px] font-semibold mb-6 bg-red-50 text-red-700 border border-red-200">
              <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-primary text-on-primary font-bold text-[15px] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 mt-2 cursor-pointer border-none"
          >
            {loading ? 'Saving...' : <><span className="material-symbols-outlined text-[20px]">check_circle</span> Activate My Account</>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-surface-high text-center text-[14px] text-on-surface-variant">
          <p>Invalid link? <Link to="/register" className="font-bold text-primary hover:underline">Register again</Link></p>
        </div>
      </div>
    </div>
  );
}
