import AvatarUpload from './AvatarUpload';

interface Props {
  name:       string;
  email:      string;
  providers:  string[];
  avatarUrl:  string | null;
  onAvatarChange: (url: string) => void;
}

// Badge config for each provider type
const PROVIDER_BADGES: Record<string, { icon: string; label: string; cls: string }> = {
  LOCAL:    { icon: 'lock',      label: 'Local Account', cls: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  GOOGLE:   { icon: 'verified',  label: 'via Google',    cls: 'bg-blue-50 text-blue-600 border-blue-100'          },
  FACEBOOK: { icon: 'thumb_up',  label: 'via Facebook',  cls: 'bg-indigo-50 text-indigo-600 border-indigo-100'    },
};

function ProviderBadge({ providerKey }: { providerKey: string }) {
  const cfg = PROVIDER_BADGES[providerKey] ?? {
    icon: 'link', label: `via ${providerKey}`, cls: 'bg-surface-low text-on-surface-variant border-outline-variant',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border ${cfg.cls}`}>
      <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

export default function ProfileHeader({ name, email, providers, avatarUrl, onAvatarChange }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-8 flex flex-col items-center text-center gap-3 sticky top-24">
      <AvatarUpload currentUrl={avatarUrl} onSuccess={onAvatarChange} />

      <div className="mt-1">
        <p className="font-display font-bold text-xl text-on-surface leading-tight">{name}</p>
        <p className="text-on-surface-variant text-sm mt-1">{email}</p>
      </div>

      {/* Render one badge per linked provider */}
      {providers.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {providers.map((p) => <ProviderBadge key={p} providerKey={p} />)}
        </div>
      )}
    </div>
  );
}
