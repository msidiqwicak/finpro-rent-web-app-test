import { useState } from 'react';
import { useAuth }  from '../../context/AuthContext';

const API   = 'http://localhost:8000/api/properties/room-types';
const INPUT = 'w-full px-4 py-2.5 bg-surface-low border border-outline-variant rounded-xl text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all';

interface RoomType { id: string; name: string; price_per_night: number; }
interface Props    { roomTypes: RoomType[]; onSuccess: () => void; onClose: () => void; }

const INITIAL = { roomTypeId: '', startDate: '', endDate: '', type: 'PERCENTAGE', value: '', reason: '' };

export default function SetPriceModifierModal({ roomTypes, onSuccess, onClose }: Props) {
  const { user }            = useAuth();
  const [form, setForm]     = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { default: api } = await import('../../api/axiosConfig');
      await api.post(`/properties/room-types/${form.roomTypeId}/price-modifier`, {
        startDate: form.startDate, endDate: form.endDate, type: form.type, value: Number(form.value), reason: form.reason
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Gagal menyimpan price modifier.');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-xl text-on-surface">Set Special Price</h2>
          <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant cursor-pointer bg-transparent border-none text-[22px]">close</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Room Type</label>
            <select name="roomTypeId" value={form.roomTypeId} onChange={handleChange} required className={INPUT}>
              <option value="">-- Select Room Type --</option>
              {roomTypes.map((rt) => (
                <option key={rt.id} value={rt.id}>{rt.name} (Base: Rp {rt.price_per_night.toLocaleString('id-ID')})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Start Date</label>
              <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required className={INPUT} />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">End Date</label>
              <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required className={INPUT} />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Modifier Type</label>
            <select name="type" value={form.type} onChange={handleChange} className={INPUT}>
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (Rp)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
              {form.type === 'PERCENTAGE' ? 'Percentage (e.g. 20 for +20%)' : 'Fixed Amount (Rp)'}
            </label>
            <input name="value" type="number" min="0" value={form.value} onChange={handleChange} required className={INPUT} />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Reason (optional)</label>
            <input name="reason" type="text" value={form.reason} onChange={handleChange} className={INPUT} placeholder="e.g. Holiday season" />
          </div>
          {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 bg-primary text-on-primary font-bold text-[14px] py-3 rounded-xl hover:opacity-90 disabled:opacity-60 cursor-pointer border-none">
              {loading ? 'Saving…' : 'Save Price Rule'}
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
