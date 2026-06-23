import { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';


interface Props {
  currentUrl: string | null;
  onSuccess:  (newUrl: string) => void;
}

const AVATAR_PLACEHOLDER = 'https://ui-avatars.com/api/?background=0a3622&color=fff&size=128&font-size=0.4';

export default function AvatarUpload({ currentUrl, onSuccess }: Props) {
  const { user }            = useAuth();
  const inputRef            = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState('');
  const [isError, setIsError] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setMsg('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { default: api } = await import('../../api/axiosConfig');
      const res = await api.patch('/users/avatar', formData);
      setIsError(false);
      setMsg('Profile photo updated!');
      onSuccess(res.data.data.avatar_url);
    } catch (err: any) {
      setIsError(true);
      setMsg(err.response?.data?.error || err.message || 'Upload failed. Please try again.');
      setPreview(currentUrl);
    } finally {
      setLoading(false);
    }
  };

  const avatarSrc = preview || `${AVATAR_PLACEHOLDER}&name=${encodeURIComponent(user?.name ?? 'User')}`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group cursor-pointer" onClick={() => inputRef.current?.click()}>
        <img
          src={avatarSrc}
          alt="Profile avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-primary/20 shadow-md transition-opacity group-hover:opacity-75"
        />
        <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-white text-[28px]">
            {loading ? 'hourglass_empty' : 'photo_camera'}
          </span>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={loading}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="text-sm font-semibold text-primary hover:underline disabled:opacity-50 cursor-pointer bg-transparent border-none"
      >
        {loading ? 'Uploading...' : 'Change Photo'}
      </button>

      {msg && (
        <p className={`text-xs font-semibold ${isError ? 'text-red-500' : 'text-emerald-600'}`}>
          {msg}
        </p>
      )}
    </div>
  );
}
