import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:8000/api/users';

const INPUT_CLS =
  'w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-[15px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60';

interface Props {
  initialName:  string;
  initialPhone: string;
  onSuccess:    (name: string, phone: string) => void;
}

export default function ProfileForm({ initialName, initialPhone, onSuccess }: Props) {
  const { user } = useAuth();
  const [name,    setName]    = useState(initialName);
  const [phone,   setPhone]   = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res  = await fetch(`${API}/profile`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body:    JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsError(false);
      setMsg('Profile updated successfully!');
      onSuccess(name.trim(), phone.trim());
    } catch (err: any) {
      setIsError(true);
      setMsg(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className={INPUT_CLS}
          placeholder="Your full name"
        />
      </div>

      <div>
        <label className="block text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
          className={INPUT_CLS}
          placeholder="+62 812 3456 7890"
        />
      </div>

      {msg && (
        <p className={`text-sm font-semibold ${isError ? 'text-red-600' : 'text-emerald-600'}`}>
          {msg}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-on-primary font-bold text-[15px] py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 cursor-pointer border-none"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
