import { useState } from 'react';
import { useInputLimit } from '../../hooks/useInputLimit';

function CharCounter({ remaining, isLimitReached }: { remaining: number; isLimitReached: boolean }) {
  return (
    <p className={`text-[11px] mt-1 text-right transition-colors ${isLimitReached ? 'text-red-500 font-semibold' : 'text-on-surface-variant'}`}>
      {remaining} characters remaining
    </p>
  );
}

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
  const [isEditing, setEdit]  = useState(false);
  const nameField             = useInputLimit(initialName, 50);
  const phoneField            = useInputLimit(initialPhone, 15);
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState('');
  const [isError, setIsError] = useState(false);

  // Keep name in sync when parent reloads profile
  // (nameField.setValue is stable, so this is safe)

  const handleSave = async () => {
    setLoading(true); setMsg('');
    try {
      const { default: api } = await import('../../api/axiosConfig');
      await api.patch('/users/profile', { name: nameField.value.trim(), phone: phoneField.value.trim() });
      setIsError(false);
      setMsg('Profile saved successfully!');
      setEdit(false);
      onSuccess(nameField.value.trim(), phoneField.value.trim());
    } catch (err: any) {
      setIsError(true); setMsg(err.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  const handleCancel = () => {
    nameField.setValue(initialName); phoneField.setValue(initialPhone);
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
          <InfoRow icon="person" label="Full Name"    value={initialName}  />
          <InfoRow icon="phone"  label="Phone Number" value={initialPhone} />
        </div>
      ) : (
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Full Name</label>
            <input type="text" value={nameField.value} onChange={nameField.onChange} className={INPUT_CLS} placeholder="Your full name" />
            <CharCounter remaining={nameField.remaining} isLimitReached={nameField.isLimitReached} />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Phone Number</label>
            <input type="tel" value={phoneField.value} onChange={phoneField.onChange} className={INPUT_CLS} placeholder="+62 812 3456 7890" />
            <CharCounter remaining={phoneField.remaining} isLimitReached={phoneField.isLimitReached} />
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
