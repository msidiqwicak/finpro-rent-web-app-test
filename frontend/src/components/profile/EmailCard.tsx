import { useState } from 'react';
import { useAuth }  from '../../context/AuthContext';

const API_USER = 'http://localhost:8000/api/users';
const API_AUTH = 'http://localhost:8000/api/auth';

const INPUT_CLS =
  'w-full px-4 py-3 bg-surface-low border border-outline-variant rounded-xl text-[15px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all';

export interface EmailCardProps {
  initialEmail: string;
  isVerified:   boolean;
  isLocal:      boolean;
  onSuccess:    (newEmail: string) => void;
}

function VerificationBadge({ email, onResend, resending }: {
  email: string; onResend: () => void; resending: boolean;
}) {
  return (
    <div className="flex items-center gap-2 mt-1 flex-wrap">
      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
        Unverified
      </span>
      <button
        onClick={onResend}
        disabled={resending}
        className="text-xs font-semibold text-primary hover:underline disabled:opacity-50 bg-transparent border-none cursor-pointer"
      >
        {resending ? 'Sending…' : 'Resend link'}
      </button>
    </div>
  );
}

export default function EmailCard({ initialEmail, isVerified, isLocal, onSuccess }: EmailCardProps) {
  const { user } = useAuth();

  const [isEditing, setEdit]    = useState(false);
  const [email,     setEmail]   = useState(initialEmail);
  const [loading,   setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [msg,     setMsg]       = useState('');
  const [isError, setIsError]   = useState(false);

  const handleResend = async () => {
    setResending(true); setMsg('');
    try {
      const { default: api } = await import('../../api/axiosConfig');
      await api.post('/auth/resend-verification', { email: initialEmail });
      setMsg('Verification link sent! Please check your inbox.');
      setIsError(false);
    } catch {
      setMsg('Failed to send link. Try again later.');
      setIsError(true);
    } finally { setResending(false); }
  };

  const handleSave = async () => {
    if (email.trim() === initialEmail) { setEdit(false); return; }
    setLoading(true); setMsg('');
    try {
      const { default: api } = await import('../../api/axiosConfig');
      await api.patch('/users/profile', { email: email.trim() });
      setMsg('Email updated! Please verify your new email address.');
      setIsError(false);
      setEdit(false);
      onSuccess(email.trim());
    } catch (err: any) {
      setIsError(true); setMsg(err.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  const handleCancel = () => { setEmail(initialEmail); setMsg(''); setEdit(false); };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-6">
      {/* ── Card Header ── */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-fixed/15 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-[18px]">mail</span>
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-on-surface leading-tight">Account Email</h2>
            <p className="text-on-surface-variant text-[12px]">Used for login and important notifications.</p>
          </div>
        </div>
        {!isEditing && isLocal && (
          <button onClick={() => setEdit(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline bg-transparent border-none cursor-pointer shrink-0">
            <span className="material-symbols-outlined text-[18px]">edit</span>Change
          </button>
        )}
      </div>

      {msg && (
        <p className={`text-sm font-semibold mt-3 ${isError ? 'text-red-600' : 'text-emerald-600'}`}>{msg}</p>
      )}

      {/* ── Read Mode ── */}
      {!isEditing && (
        <div className="mt-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Email Address</p>
          <p className="text-[15px] text-on-surface font-medium">{initialEmail}</p>
          {!isVerified && (
            <VerificationBadge email={initialEmail} onResend={handleResend} resending={resending} />
          )}
          {isVerified && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold mt-1 text-emerald-700">
              <span className="material-symbols-outlined text-[14px]">verified</span>Verified
            </span>
          )}
        </div>
      )}

      {/* ── Edit Mode ── */}
      {isEditing && (
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
              New Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT_CLS}
              placeholder="your@email.com"
            />
            <p className="text-[11px] text-amber-600 mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">warning</span>
              Changing your email will require re-verification before you can use it.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={loading}
              className="flex-1 bg-primary text-on-primary font-bold text-[14px] py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer border-none">
              {loading ? 'Saving…' : 'Save Email'}
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
