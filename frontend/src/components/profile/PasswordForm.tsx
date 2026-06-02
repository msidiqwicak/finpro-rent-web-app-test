import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:8000/api/users';

const INPUT_CLS =
  'w-full pl-11 pr-12 py-3 bg-surface border border-outline-variant rounded-xl text-[15px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60';

function PasswordInput({
  id, label, value, show, onToggle, onChange, disabled,
}: {
  id: string; label: string; value: string; show: boolean;
  onToggle: () => void; onChange: (v: string) => void; disabled: boolean;
}) {
  return (
    <div>
      <label className="block text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-4 text-outline text-[20px]">lock</span>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={INPUT_CLS}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 text-outline hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
        >
          <span className="material-symbols-outlined text-[20px]">
            {show ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function PasswordForm() {
  const { user } = useAuth();
  const [oldPass, setOldPass]     = useState('');
  const [newPass, setNewPass]     = useState('');
  const [confPass, setConfPass]   = useState('');
  const [showOld, setShowOld]     = useState(false);
  const [showNew, setShowNew]     = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [msg, setMsg]             = useState('');
  const [isError, setIsError]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confPass) {
      setIsError(true);
      setMsg('New password and confirmation do not match.');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res  = await fetch(`${API}/password`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body:    JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsError(false);
      setMsg('Password changed successfully!');
      setOldPass(''); setNewPass(''); setConfPass('');
    } catch (err: any) {
      setIsError(true);
      setMsg(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PasswordInput id="old-pass" label="Current Password" value={oldPass}
        show={showOld} onToggle={() => setShowOld(!showOld)}
        onChange={setOldPass} disabled={loading} />
      <PasswordInput id="new-pass" label="New Password" value={newPass}
        show={showNew} onToggle={() => setShowNew(!showNew)}
        onChange={setNewPass} disabled={loading} />
      <PasswordInput id="conf-pass" label="Confirm New Password" value={confPass}
        show={showConf} onToggle={() => setShowConf(!showConf)}
        onChange={setConfPass} disabled={loading} />

      {msg && (
        <p className={`text-sm font-semibold ${isError ? 'text-red-600' : 'text-emerald-600'}`}>
          {msg}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-secondary text-on-secondary font-bold text-[15px] py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 cursor-pointer border-none"
      >
        {loading ? 'Updating...' : 'Change Password'}
      </button>
    </form>
  );
}
