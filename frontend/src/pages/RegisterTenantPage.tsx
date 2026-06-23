import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SocialLogin from '../components/auth/SocialLogin';
import Navbar from '../components/layout/Navbar';


const INPUT_CLS = 'w-full pl-11 pr-4 py-3.5 bg-surface border border-outline-variant rounded-xl text-[15px] text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all disabled:opacity-60';

function AuthHeader() {
  return (
    <div className="mb-8">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-fixed text-on-primary-fixed text-[11px] font-bold uppercase rounded-full tracking-wider mb-4">
        <span className="material-symbols-outlined text-[16px]">home_work</span>
        Tenant Account
      </div>
      <h1 className="font-display font-bold text-3xl text-on-surface mb-2">List Your Property</h1>
      <p className="text-on-surface-variant text-[15px]">Join our community of eco-friendly hosts and start earning from your property.</p>
    </div>
  );
}

function AuthInput({ id, label, icon, type, value, onChange, disabled, placeholder }: any) {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">{label}</label>
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-4 text-outline text-[20px]">{icon}</span>
        <input id={id} name={id} type={type} placeholder={placeholder}
          value={value} onChange={onChange} disabled={disabled} className={INPUT_CLS}
        />
      </div>
    </div>
  );
}

function AlertMsg({ msg, isError }: { msg: string; isError?: boolean }) {
  if (!msg) return null;
  let displayMsg = msg;
  if (msg.includes('Email sudah terdaftar')) displayMsg = 'Email is already registered.';
  else if (msg.includes('harus diisi'))      displayMsg = 'Name and email are required.';

  return (
    <div className={`flex items-start gap-2 px-4 py-3 rounded-xl text-[14px] font-semibold mb-6 ${isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim'}`}>
      <span className="material-symbols-outlined text-[20px] shrink-0">{isError ? 'error' : 'check_circle'}</span>
      <span>{displayMsg}</span>
    </div>
  );
}

function TenantInfoBox() {
  return (
    <div className="bg-surface-high p-4 rounded-xl mb-6 flex gap-3 items-start border border-outline-variant">
      <span className="material-symbols-outlined text-secondary text-[22px]">info</span>
      <div className="text-[13px] text-on-surface-variant leading-relaxed">
        Tenant accounts are specialized for managing properties, pricing, and bookings. You <strong>cannot</strong> book properties using this account.
      </div>
    </div>
  );
}

export default function RegisterTenantPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return setError('Name and email are required.');
    setLoading(true); setError('');
    try {
      const res = await fetch('http://localhost:8000/api/auth/register/tenant', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'An error occurred.');
      if (data.token) navigate(`/verify/${data.token}`);
      else setSuccess('Success! Please check your email.');
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-72px)] bg-surface-low flex items-center justify-center p-5 py-12 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary-container/40 blur-[100px]" />

      <div className="w-full max-w-[540px] bg-white rounded-3xl shadow-[0_4px_24px_rgba(6,27,14,0.10)] border border-outline-variant/30 p-8 sm:p-10 relative z-10">
        <AuthHeader />
        <TenantInfoBox />
        <AlertMsg msg={success} />

        {!success && (
          <form onSubmit={handleSubmit} noValidate>
            <AuthInput id="name"  label="Full Name / Business Name"  icon="badge" type="text"  placeholder="e.g. Eco Retreat Indonesia" value={form.name}  onChange={handleChange} disabled={loading} />
            <AuthInput id="email" label="Business Email Address"      icon="mail"  type="email" placeholder="business@example.com"      value={form.email} onChange={handleChange} disabled={loading} />
            <AlertMsg msg={error} isError />
            <button type="submit" disabled={loading}
              className="w-full bg-secondary text-on-secondary font-bold text-[15px] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 mt-2 cursor-pointer border-none"
            >
              {loading ? 'Registering...' : <><span className="material-symbols-outlined text-[20px]">storefront</span> Register as Tenant</>}
            </button>
          </form>
        )}

        {!success && <SocialLogin action="REGISTER" requestedRole="TENANT" redirectTo="/tenant/dashboard" />}

        <div className="mt-8 pt-6 border-t border-surface-high text-center text-[14px] text-on-surface-variant">
          <p className="mb-2">Already have a Tenant account? <Link to="/login" className="font-bold text-secondary hover:underline">Log in here</Link></p>
          <p>Just looking to book stays? <Link to="/register" className="font-bold text-primary hover:underline">Register as Guest</Link></p>
        </div>
      </div>
      </div>
    </>
  );
}
