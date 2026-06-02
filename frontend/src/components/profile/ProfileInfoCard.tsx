import { useState } from 'react';
import { useAuth }  from '../../context/AuthContext';

const API = 'http://localhost:8000/api/users';

const INPUT_CLS =
  'w-full px-4 py-3 bg-surface-low border border-outline-variant rounded-xl text-[15px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all';

export interface ProfileInfoCardProps {
  initialName:  string;
  initialPhone: string;
  onSuccess:    (name: string, phone: string) => void;
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-surface-low last:border-0">
      <div className="w-9 h-9 rounded-full bg-primary-fixed/15 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-0.5">{label}</p>
        <p className="text-[15px] text-on-surface font-medium truncate">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function ProfileInfoCard({ initialName, initialPhone, onSuccess }: ProfileInfoCardProps) {
  const { user } = useAuth();

  const [isEditing, setEdit] = useState(false);
  const [name,  setName]     = useState(initialName);
  const [phone, setPhone]    = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState('');
  const [isError, setIsError] = useState(false);

  const handleSave = async () => {
    setLoading(true); setMsg('');
    try {
      const res  = await fetch(`${API}/profile`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body:    JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsError(false);
      setMsg('Profile saved successfully!');
      setEdit(false);
      onSuccess(name.trim(), phone.trim());
    } catch (err: any) {
      setIsError(true); setMsg(err.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  const handleCancel = () => {
    setName(initialName); setPhone(initialPhone);
    setMsg(''); setEdit(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display font-bold text-xl text-on-surface">Personal Information</h2>
        {!isEditing && (
          <button onClick={() => setEdit(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline bg-transparent border-none cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">edit</span>Edit
          </button>
        )}
      </div>
      <p className="text-on-surface-variant text-[13px] mb-4">
        Your name and phone number as displayed on your bookings.
      </p>

      {msg && <p className={`text-sm font-semibold mb-3 ${isError ? 'text-red-600' : 'text-emerald-600'}`}>{msg}</p>}

      {!isEditing ? (
        <div>
          <InfoRow icon="person" label="Full Name"    value={name}  />
          <InfoRow icon="phone"  label="Phone Number" value={phone} />
        </div>
      ) : (
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLS} placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={INPUT_CLS} placeholder="+62 812 3456 7890" />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} disabled={loading}
              className="flex-1 bg-primary text-on-primary font-bold text-[14px] py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer border-none">
              {loading ? 'Saving…' : 'Save changes'}
            </button>
            <button onClick={handleCancel} disabled={loading}
              className="flex-1 bg-surface-low text-on-surface font-semibold text-[14px] py-3 rounded-xl transition-colors disabled:opacity-60 cursor-pointer border border-outline-variant">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
