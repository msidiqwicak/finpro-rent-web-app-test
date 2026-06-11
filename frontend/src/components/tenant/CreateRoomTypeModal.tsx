import { useState } from 'react';
import { useAuth }  from '../../context/AuthContext';

const API = 'http://localhost:8000/api/properties';
const INPUT = 'w-full px-4 py-2.5 bg-surface-low border border-outline-variant rounded-xl text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all';

interface Props { propertyId: string; propertyName: string; onSuccess: () => void; onClose: () => void; }

const INITIAL = { name: '', description: '', price_per_night: '', capacity: '2', total_units: '1' };

export default function CreateRoomTypeModal({ propertyId, propertyName, onSuccess, onClose }: Props) {
  const { user } = useAuth();
  const [form, setForm] = useState(INITIAL);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true); 
    setError('');

    const oversizedFiles = imageFiles.filter(f => f.size > 1048576);
    if (oversizedFiles.length > 0) {
      setError('Setiap gambar kamar tidak boleh lebih dari 1 MB.');
      setLoading(false);
      return;
    }

    if (imageFiles.length > 5) {
      setError('Maksimal 5 foto kamar yang diizinkan.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        formData.append(key, val);
      });
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      const { default: api } = await import('../../api/axiosConfig');
      const res = await api.post(`/properties/${propertyId}/room-types`, formData);
      const data = res.data;
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Gagal membuat tipe kamar.');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-xl text-on-surface">Add Room Type</h2>
            <p className="text-[13px] text-on-surface-variant">For: <span className="font-semibold text-on-surface">{propertyName}</span></p>
          </div>
          <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant cursor-pointer bg-transparent border-none text-[22px]">close</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Room Name</label>
            <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="e.g. Deluxe Room" required className={INPUT} />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Base Price per Night (Rp)</label>
            <input name="price_per_night" type="number" min="0" value={form.price_per_night} onChange={handleChange} required className={INPUT} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Guest Capacity</label>
              <input name="capacity" type="number" min="1" value={form.capacity} onChange={handleChange} required className={INPUT} />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Total Units / Doors</label>
              <input name="total_units" type="number" min="1" value={form.total_units} onChange={handleChange} required className={INPUT} />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} required className={INPUT} />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Room Photos (Max 5 images, Max 1MB each)</label>
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/gif" 
              multiple
              onChange={(e) => {
                if (e.target.files) setImageFiles(Array.from(e.target.files));
              }}
              className="w-full text-[13px] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[13px] file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />
            {imageFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-[11px] font-bold text-on-surface">Selected ({imageFiles.length}):</p>
                {imageFiles.map((f, i) => (
                  <p key={i} className="text-[11px] text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">image</span>
                    <span className="truncate max-w-[200px]">{f.name}</span> ({(f.size / 1024).toFixed(1)} KB)
                  </p>
                ))}
              </div>
            )}
          </div>
          
          {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 bg-primary text-on-primary font-bold text-[14px] py-3 rounded-xl hover:opacity-90 disabled:opacity-60 cursor-pointer border-none">
              {loading ? 'Saving...' : 'Add Room Type'}
            </button>
            <button type="button" onClick={onClose}
              className="flex-1 bg-surface-low text-on-surface font-semibold text-[14px] py-3 rounded-xl cursor-pointer border border-outline-variant">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
