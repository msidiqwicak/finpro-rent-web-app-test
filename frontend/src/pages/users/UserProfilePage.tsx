import { useState, useEffect } from 'react';
import { useAuth }        from '../../context/AuthContext';
import Navbar             from '../../components/layout/Navbar';
import ProfileHeader      from '../../components/profile/ProfileHeader';
import ProfileInfoCard    from '../../components/profile/ProfileInfoCard';
import EmailCard          from '../../components/profile/EmailCard';
import PasswordForm       from '../../components/profile/PasswordForm';

const API = 'http://localhost:8000/api/users';

export interface ProfileData {
  name:        string;
  email:       string;
  phone:       string;
  avatar_url:  string | null;
  provider:    string | null;
  is_verified: boolean;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-surface-low flex items-center justify-center">
      <span className="material-symbols-outlined text-primary text-[48px] animate-spin">
        progress_activity
      </span>
    </div>
  );
}

function PasswordSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-primary-fixed/15 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
        </div>
        <div>
          <h2 className="font-display font-bold text-lg text-on-surface leading-tight">Password & Security</h2>
          <p className="text-on-surface-variant text-[12px]">Update your password regularly to keep your account safe.</p>
        </div>
      </div>
      <PasswordForm />
    </div>
  );
}

export default function UserProfilePage() {
  const { user }  = useAuth();
  const [profile,   setProfile]   = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;
    fetch(`${API}/profile`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.data) setProfile(d.data); })
      .finally(() => setIsLoading(false));
  }, [user?.token]);

  if (isLoading) return <LoadingScreen />;

  const isLocal = !profile?.provider || profile.provider === 'LOCAL';

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface-low py-10 px-4">
        <div className="max-w-5xl mx-auto">

          {/* ── Page Title ── */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-on-surface">My profile</h1>
            <p className="text-on-surface-variant text-[15px] mt-1">
              Manage your personal information and account security.
            </p>
          </div>

          {/* ── 2-column Layout ── */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* ── Left: Identity Card ── */}
            <div className="w-full lg:w-[280px] shrink-0">
              {profile && (
                <ProfileHeader
                  name={profile.name}
                  email={profile.email}
                  provider={profile.provider}
                  avatarUrl={profile.avatar_url}
                  onAvatarChange={(url) => setProfile((p) => p ? { ...p, avatar_url: url } : p)}
                />
              )}
            </div>

            {/* ── Right: 3 stacked cards ── */}
            <div className="flex-1 space-y-5">

              {/* Card 1: Name & Phone */}
              {profile && (
                <ProfileInfoCard
                  initialName={profile.name}
                  initialPhone={profile.phone ?? ''}
                  onSuccess={(name, phone) => setProfile((p) => p ? { ...p, name, phone } : p)}
                />
              )}

              {/* Card 2: Email (dedicated, with verification status) */}
              {profile && (
                <EmailCard
                  initialEmail={profile.email}
                  isVerified={profile.is_verified}
                  onSuccess={(email) =>
                    setProfile((p) => p ? { ...p, email, is_verified: false } : p)
                  }
                />
              )}

              {/* Card 3: Password (LOCAL accounts only) */}
              {isLocal && <PasswordSection />}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
