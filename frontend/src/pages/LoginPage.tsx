import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SocialLogin from '../components/SocialLogin';

type LoginMode = 'USER' | 'TENANT';

const INPUT_CLS = 'w-full pl-11 pr-11 py-3.5 bg-surface border border-outline-variant rounded-xl text-[15px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60';

function AuthHeader() {
  return (
    <div className="mb-1">
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="font-display font-bold text-xl text-primary">Evergreen Escapes</Link>
      </div>
      <h1 className="font-display font-bold text-3xl text-on-surface mb-2">Welcome Back</h1>
      <p className="text-on-surface-variant text-[15px]">Sign in to your account to continue.</p>
    </div>
  );
}

function AuthInput({ id, label, icon, type, value, onChange, disabled, placeholder, togglePass }: any) {
  return (
    <div className="mb-5 relative">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="block text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">{label}</label>
        {togglePass && <Link to="/forgot-password" className="text-[12px] font-bold text-primary hover:underline">Forgot password?</Link>}
      </div>
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-4 text-outline text-[20px]">{icon}</span>
        <input id={id} name={id} type={type} placeholder={placeholder}
          value={value} onChange={onChange} disabled={disabled} className={INPUT_CLS}
        />
        {togglePass && (
          <button type="button" onClick={togglePass.onClick}
            className="absolute right-4 text-outline hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
          >
            <span className="material-symbols-outlined text-[20px]">{togglePass.show ? 'visibility_off' : 'visibility'}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<LoginMode>('USER');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) { navigate(user.role === 'TENANT' ? '/tenant/dashboard' : '/'); }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError('Email and password are required.');
    setLoading(true); setError('');
    try {
      const endpoint = mode === 'TENANT' ? 'http://localhost:8000/api/auth/login/tenant' : 'http://localhost:8000/api/auth/login';
      const res  = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email.trim(), password: form.password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');
      login({ id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role, token: data.token });
      navigate(data.user.role === 'TENANT' ? '/tenant/dashboard' : '/');
    } catch (err: any) {
      setError(err.message.includes('Login gagal') ? 'Login failed. Please check your email and password.' : err.message);
    } finally { setLoading(false); }
  };

  const isTenant = mode === 'TENANT';

  return (
    <div className="min-h-screen bg-surface-low flex items-center justify-center p-5 relative overflow-hidden">
      <div className={`absolute top-[-10%] ${isTenant ? 'right-[-10%] bg-secondary-container/40' : 'left-[-10%] bg-primary-fixed/30'} w-[500px] h-[500px] rounded-full blur-[80px] transition-all duration-700`} />

      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_4px_24px_rgba(6,27,14,0.10)] border border-outline-variant/30 p-8 sm:p-10 relative z-10">
        <AuthHeader />

        <div className="flex bg-surface-high p-1.5 rounded-xl mb-8">
          <button onClick={() => { setMode('USER'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[14px] font-bold transition-all cursor-pointer border-none ${!isTenant ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-on-surface-variant hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-[18px]">person</span> Guest
          </button>
          <button onClick={() => { setMode('TENANT'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[14px] font-bold transition-all cursor-pointer border-none ${isTenant ? 'bg-secondary text-on-secondary shadow-sm' : 'bg-transparent text-on-surface-variant hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-[18px]">home_work</span> Tenant
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <AuthInput id="email"    label="Email Address" icon="mail" type="email"                          placeholder="john@example.com"    value={form.email}    onChange={handleChange} disabled={loading} />
          <AuthInput id="password" label="Password"      icon="lock" type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={form.password} onChange={handleChange} disabled={loading} togglePass={{ show: showPass, onClick: () => setShowPass(!showPass) }} />

          {error && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-[14px] font-semibold mb-6 bg-red-50 text-red-700 border border-red-200">
              <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={loading}
            className={`w-full text-on-primary font-bold text-[15px] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 mt-2 cursor-pointer border-none ${isTenant ? 'bg-secondary' : 'bg-primary'}`}
          >
            {loading ? 'Signing in...' : <><span className="material-symbols-outlined text-[20px]">login</span> Sign In as {isTenant ? 'Tenant' : 'Guest'}</>}
          </button>
        </form>

        <SocialLogin
          action="LOGIN"
          requestedRole={mode}
          redirectTo={isTenant ? '/tenant/dashboard' : '/'}
        />

        <div className="mt-8 pt-6 border-t border-surface-high text-center text-[14px] text-on-surface-variant">
          <p>Don't have an account? <Link to={isTenant ? '/tenant/register' : '/register'} className={`font-bold hover:underline ${isTenant ? 'text-secondary' : 'text-primary'}`}>Sign up {isTenant ? 'as Tenant' : 'now'}</Link></p>
        </div>
      </div>
    </div>
  );
}
