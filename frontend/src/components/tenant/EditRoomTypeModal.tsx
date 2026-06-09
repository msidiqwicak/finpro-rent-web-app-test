import { useState, useEffect } from 'react';
import { useAuth }  from '../../context/AuthContext';

const API = 'http://localhost:8000/api/properties/room-types';
const INPUT = 'w-full px-4 py-2.5 bg-surface-low border border-outline-variant rounded-xl text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all';

interface Props { 
  roomType: any; 
  onSuccess: () => void; 
  onClose: () => void; 
}

export default function EditRoomTypeModal({ roomType, onSuccess, onClose }: Props) {
  const { user } = useAuth();
  
  const [form, setForm] = useState({
    name: roomType.name || '',
    description: roomType.description || '',
    price_per_night: roomType.price_per_night || '',
    capacity: roomType.capacity || '2',
    total_units: roomType.total_units || '1'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true); 
    setError('');

    try {
      const { default: api } = await import('../../api/axiosConfig');
      const res = await api.put(`/properties/room-types/${roomType.id}`, form);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Gagal memperbarui tipe kamar.');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-xl text-on-surface">Edit Room Type</h2>
            <p className="text-[13px] text-on-surface-variant">Editing: <span className="font-semibold text-on-surface">{roomType.name}</span></p>
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
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Description (Optional)</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} className={INPUT} />
          </div>

          <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 mt-2">
            <p className="text-[11px] text-on-surface-variant flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary">info</span>
              <span>Note: Image updates are not supported in this quick edit form.</span>
            </p>
          </div>
          
          {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 bg-primary text-on-primary font-bold text-[14px] py-3 rounded-xl hover:opacity-90 disabled:opacity-60 cursor-pointer border-none">
              {loading ? 'Saving...' : 'Save Changes'}
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
