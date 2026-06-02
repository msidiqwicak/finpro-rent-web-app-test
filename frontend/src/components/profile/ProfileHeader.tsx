import AvatarUpload from './AvatarUpload';

interface Props {
  name:       string;
  email:      string;
  provider:   string | null;
  avatarUrl:  string | null;
  createdAt?: string;
  onAvatarChange: (url: string) => void;
}

export default function ProfileHeader({ name, email, provider, avatarUrl, onAvatarChange }: Props) {
  const isLocal = !provider || provider === 'LOCAL';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-8 flex flex-col items-center text-center gap-3 sticky top-24">
      <AvatarUpload currentUrl={avatarUrl} onSuccess={onAvatarChange} />

      <div className="mt-1">
        <p className="font-display font-bold text-xl text-on-surface leading-tight">{name}</p>
        <p className="text-on-surface-variant text-sm mt-1">{email}</p>
      </div>

      {!isLocal && (
        <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
          <span className="material-symbols-outlined text-[14px]">verified</span>
          via {provider}
        </span>
      )}

      {isLocal && (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          Local Account
        </span>
      )}
    </div>
  );
}
