import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const API = 'http://localhost:8000/api/auth/verify-email-update';

type Status = 'loading' | 'success' | 'error';

function LoadingView() {
  return (
    <div className="text-center">
      <span className="material-symbols-outlined text-primary text-[56px] animate-spin block mb-4">
        progress_activity
      </span>
      <h1 className="font-display font-bold text-2xl text-on-surface mb-2">
        Verifying your email…
      </h1>
      <p className="text-on-surface-variant text-[15px]">
        Please wait, this will only take a moment.
      </p>
    </div>
  );
}

function SuccessView() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
        <span className="material-symbols-outlined text-emerald-600 text-[36px]">check_circle</span>
      </div>
      <h1 className="font-display font-bold text-2xl text-on-surface mb-2">
        Email Verified!
      </h1>
      <p className="text-on-surface-variant text-[15px] mb-6">
        Your new email address has been successfully confirmed.
      </p>
      <Link
        to="/profile"
        className="inline-block bg-primary text-on-primary font-bold text-[14px] px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
      >
        Back to Profile
      </Link>
    </div>
  );
}

function ErrorView({ message }: { message: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
        <span className="material-symbols-outlined text-red-500 text-[36px]">error</span>
      </div>
      <h1 className="font-display font-bold text-2xl text-on-surface mb-2">
        Verification Failed
      </h1>
      <p className="text-on-surface-variant text-[15px] mb-2">{message}</p>
      <p className="text-on-surface-variant text-[13px] mb-6">
        The link may have expired. Please request a new one from your profile page.
      </p>
      <Link
        to="/profile"
        className="inline-block bg-primary text-on-primary font-bold text-[14px] px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
      >
        Go to Profile
      </Link>
    </div>
  );
}

export default function VerifyEmailUpdatePage() {
  const { token }          = useParams<{ token: string }>();
  const navigate           = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setErrorMsg('Invalid link.'); return; }

    fetch(API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.message) {
          setStatus('success');
          setTimeout(() => navigate('/profile'), 2500);
        } else {
          throw new Error(d.error || 'Verification failed.');
        }
      })
      .catch((err) => { setStatus('error'); setErrorMsg(err.message); });
  }, [token]);

  return (
    <div className="min-h-screen bg-surface-low flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-10 max-w-md w-full">
        {status === 'loading' && <LoadingView />}
        {status === 'success' && <SuccessView />}
        {status === 'error'   && <ErrorView message={errorMsg} />}
      </div>
    </div>
  );
}
