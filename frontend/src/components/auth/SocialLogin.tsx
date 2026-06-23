import { useState, useEffect } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, facebookProvider } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';

// ─── Types ────────────────────────────────────────────────────
type SocialProvider = 'GOOGLE' | 'FACEBOOK';

export interface SocialLoginProps {
  /** Whether this is a login or registration flow */
  action:        'LOGIN' | 'REGISTER';
  /** Which role this login/register flow is for */
  requestedRole: 'USER' | 'TENANT';
  /** Redirect path after a successful login. Defaults to '/' */
  redirectTo?:   string;
}

// ─── Icon Components ──────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
      <path fill="#3F51B5" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"/>
      <path fill="#FFF" d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-4.078,2.214-5.966,6.053-5.966c1.711,0,3.185,0.123,3.617,0.18L35.6,16.58c-0.207-0.024-0.893-0.08-1.79-0.08c-1.921,0-2.81,0.92-2.81,2.793V21h4.485L34.368,25z"/>
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function SocialLogin({ action, requestedRole, redirectTo = '/' }: SocialLoginProps) {
  const { login }                   = useAuth();
  const navigate                    = useNavigate();
  const [loading, setLoading]       = useState<SocialProvider | null>(null);
  const [error, setError]           = useState('');

  const processAuthResult = async (firebaseUser: any, provider: SocialProvider, act: string, role: string) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await api.post('/auth/social-login', {
        idToken,
        provider,
        action: act,
        requestedRole: role
      });

      const data = res.data.data ?? res.data;
      login({ ...data.user });
      
      sessionStorage.removeItem('social_login_state');
      navigate(redirectTo);
    } catch (err: any) {
      setError(err.response?.data?.error ?? err.message ?? 'Social login failed.');
      setLoading(null);
    }
  };

  // Mengecek apakah user baru saja kembali dari redirect login (contoh di mobile browser)
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          const storedState = sessionStorage.getItem('social_login_state');
          if (storedState) {
            const { provider, action: storedAction, requestedRole: storedRole } = JSON.parse(storedState);
            setLoading(provider);
            await processAuthResult(result.user, provider, storedAction, storedRole);
          }
        }
      } catch (err: any) {
        setError(err.message ?? 'An error occurred during redirect login.');
      }
    };
    checkRedirect();
  }, []);

  const handleSocialLogin = async (provider: SocialProvider) => {
    setError('');
    setLoading(provider);

    const firebaseProvider = provider === 'GOOGLE' ? googleProvider : facebookProvider;

    try {
      const result = await signInWithPopup(auth, firebaseProvider);
      if (result.user) {
        await processAuthResult(result.user, provider, action, requestedRole);
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked') {
        // Fallback jika popup diblokir oleh browser
        sessionStorage.setItem('social_login_state', JSON.stringify({ provider, action, requestedRole }));
        await signInWithRedirect(auth, firebaseProvider);
      } else if (err?.code !== 'auth/popup-closed-by-user') {
        setError(err.message ?? 'An error occurred. Please try again.');
        setLoading(null);
      } else {
        // User menutup popup secara manual
        setLoading(null);
      }
    }
  };

  return (
    <div className="mt-6">
      <div className="relative flex items-center justify-center mb-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant" />
        </div>
        <span className="relative bg-white px-4 text-[12px] font-bold text-on-surface-variant uppercase tracking-widest">
          Or continue with
        </span>
      </div>

      {error && (
        <p className="text-[13px] text-red-600 text-center mb-3 font-semibold">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          id="btn-social-google"
          onClick={() => handleSocialLogin('GOOGLE')}
          disabled={!!loading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded-xl hover:bg-surface-low transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer bg-transparent"
        >
          {loading === 'GOOGLE'
            ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            : <GoogleIcon />}
          <span className="text-[14px] font-bold text-on-surface">Google</span>
        </button>

        <button
          type="button"
          id="btn-social-facebook"
          onClick={() => handleSocialLogin('FACEBOOK')}
          disabled={!!loading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded-xl hover:bg-surface-low transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer bg-transparent"
        >
          {loading === 'FACEBOOK'
            ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            : <FacebookIcon />}
          <span className="text-[14px] font-bold text-on-surface">Facebook</span>
        </button>
      </div>
    </div>
  );
}
