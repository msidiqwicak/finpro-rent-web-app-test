import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function AuthHeader({ title, subtitle, icon, badge }: { title: string; subtitle: string; icon: string; badge: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="font-display font-bold text-xl text-[--primary]">Evergreen Escapes</Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[--secondary-container] text-[--on-secondary-container] text-[11px] font-bold uppercase rounded-full tracking-wider">
          <span className="material-symbols-outlined text-[16px]">{icon}</span>
          {badge}
        </div>
      </div>
      <h1 className="font-display font-bold text-3xl text-[--on-surface] mb-2">{title}</h1>
      <p className="text-[--on-surface-variant] text-[15px]">{subtitle}</p>
    </div>
  );
}

export default function VerifyPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: score, label: 'Weak', color: '#ba1a1a' };
    if (score === 2) return { level: score, label: 'Fair', color: '#e67e22' };
    if (score === 3) return { level: score, label: 'Strong', color: '#56642b' };
    return { level: score, label: 'Very Strong', color: '#061b0e' };
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.password) return setError('Password is required.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    if (!token) return setError('Invalid verification token.');

    setLoading(true); setError('');
    try {
      const res = await fetch('http://localhost:8000/api/auth/verify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed.');
      setSuccess(true);
    } catch (err: any) { 
      let errMsg = err.message;
      if (errMsg.includes('Token tidak valid')) errMsg = 'Invalid token.';
      if (errMsg.includes('User tidak ditemukan')) errMsg = 'User not found.';
      if (errMsg.includes('Akun sudah terverifikasi')) errMsg = 'Account already verified.';
      setError(errMsg); 
    }
    finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[--surface-low] flex items-center justify-center p-5 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[--primary-fixed]/30 blur-[80px]" />
        <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-[--shadow-raised] border border-[--outline-variant]/30 p-8 sm:p-10 relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[--primary-fixed] rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[40px] text-[--secondary]">verified</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-[--on-surface] mb-2">Account Created!</h1>
          <p className="text-[--on-surface-variant] text-[15px] mb-8">Welcome to Evergreen Escapes! You will be redirected to the login page in 3 seconds...</p>
          <Link to="/login" className="w-full bg-[--primary] text-white font-bold text-[15px] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-[20px]">login</span> Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--surface-low] flex items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[--primary-fixed]/30 blur-[80px]" />
      
      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-[--shadow-raised] border border-[--outline-variant]/30 p-8 sm:p-10 relative z-10">
        <AuthHeader title="Set Your Password" subtitle="One last step! Create a strong password to secure your account." icon="lock_open" badge="Account Verification" />

        <form onSubmit={handleSubmit} noValidate>
          {/* Password */}
          <div className="mb-5 relative">
            <label htmlFor="verify-password" className="block text-[12px] font-bold uppercase tracking-wider text-[--on-surface-variant] mb-2">New Password</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-[--outline] text-[20px]">lock</span>
              <input id="verify-password" name="password" type={showPass ? 'text' : 'password'} placeholder="At least 8 characters" value={form.password} onChange={handleChange} disabled={loading} className="w-full pl-11 pr-11 py-3.5 bg-[--surface] border border-[--outline-variant] rounded-xl text-[15px] text-[--on-surface] focus:outline-none focus:border-[--primary] focus:ring-1 focus:ring-[--primary] transition-all disabled:opacity-60" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 text-[--outline] hover:text-[--primary] transition-colors">
                <span className="material-symbols-outlined text-[20px]">{showPass ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1 h-1.5 rounded-full overflow-hidden mb-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex-1 transition-colors duration-300" style={{ background: i <= strength.level ? strength.color : 'var(--outline-variant)' }} />
                  ))}
                </div>
                <span className="text-[12px] font-bold" style={{ color: strength.color }}>{strength.label}</span>
              </div>
            )}
          </div>

          {/* Confirm */}
          <div className="mb-5 relative">
            <label htmlFor="verify-confirm" className="block text-[12px] font-bold uppercase tracking-wider text-[--on-surface-variant] mb-2">Confirm Password</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-[--outline] text-[20px]">lock_reset</span>
              <input id="verify-confirm" name="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange} disabled={loading} className="w-full pl-11 pr-11 py-3.5 bg-[--surface] border border-[--outline-variant] rounded-xl text-[15px] text-[--on-surface] focus:outline-none focus:border-[--primary] focus:ring-1 focus:ring-[--primary] transition-all disabled:opacity-60" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 text-[--outline] hover:text-[--primary] transition-colors">
                <span className="material-symbols-outlined text-[20px]">{showConfirm ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            {form.confirmPassword && (
              <span className="flex items-center gap-1 text-[12px] font-bold mt-2" style={{ color: form.password === form.confirmPassword ? 'var(--secondary)' : '#ba1a1a' }}>
                <span className="material-symbols-outlined text-[14px]">{form.password === form.confirmPassword ? 'check_circle' : 'cancel'}</span>
                {form.password === form.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
              </span>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-[14px] font-semibold mb-6 bg-[#fdf0f0] text-[#c0392b] border border-[#f5c6c6]">
              <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-[--primary] text-white font-bold text-[15px] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-70 mt-2">
            {loading ? 'Saving...' : <><span className="material-symbols-outlined text-[20px]">check_circle</span> Activate My Account</>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[--surface-high] text-center text-[14px] text-[--on-surface-variant]">
          <p>Invalid link? <Link to="/register" className="font-bold text-[--primary] hover:underline">Register again</Link></p>
        </div>
      </div>
    </div>
  );
}
