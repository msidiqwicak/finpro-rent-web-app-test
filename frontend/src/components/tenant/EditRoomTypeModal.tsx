import { useState } from 'react';
const INPUT = 'w-full px-4 py-2.5 bg-surface-low border border-outline-variant rounded-xl text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all';

interface Props { 
  roomType: any; 
  onSuccess: () => void; 
  onClose: () => void; 
}

export default function EditRoomTypeModal({ roomType, onSuccess, onClose }: Props) {
  
  const [form, setForm] = useState({
    name: roomType.name || '',
    description: roomType.description || '',
    price_per_night: roomType.price_per_night || '',
    capacity: roomType.capacity || '2',
    total_units: roomType.total_units || '1'
  });
  
  const [existingImages, setExistingImages] = useState<string[]>(roomType.image_urls || []);
  const [newImages, setNewImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true); 
    setError('');

    const oversizedFiles = newImages.filter(f => f.size > 1048576);
    if (oversizedFiles.length > 0) {
      setError('Each room image must not exceed 1 MB.');
      setLoading(false);
      return;
    }

    if (existingImages.length + newImages.length > 5) {
      setError(`A maximum of 5 photos are allowed (You selected ${existingImages.length} old + ${newImages.length} new).`);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        formData.append(key, String(val));
      });
      
      if (existingImages.length === 0) {
        formData.append('existing_images', '');
      } else {
        existingImages.forEach(url => formData.append('existing_images', url));
      }
      
      newImages.forEach(file => formData.append('images', file));

      const { default: api } = await import('../../api/axiosConfig');
      await api.put(`/properties/room-types/${roomType.id}`, formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to update room type.');
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
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} required className={INPUT} />
          </div>

          <div className="pt-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Room Photos (Max 5 total)</label>
            
            {/* Gallery Preview */}
            {(existingImages.length > 0 || newImages.length > 0) && (
              <div className="flex gap-3 overflow-x-auto pb-3 hide-scrollbar mb-2">
                {/* Existing Images */}
                {existingImages.map((url, i) => (
                  <div key={`old-${i}`} className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-outline-variant relative group">
                    <img src={`http://localhost:8000/${url.replace(/\\/g, '/')}`} alt={`Old ${i}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] font-bold text-center py-0.5">OLD</div>
                    <button 
                      type="button"
                      onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-error rounded-full flex items-center justify-center text-white transition-colors cursor-pointer border-none shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </div>
                ))}
                
                {/* New Images */}
                {newImages.map((file, i) => (
                  <div key={`new-${i}`} className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 border-primary/50 relative group">
                    <img src={URL.createObjectURL(file)} alt={`New ${i}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[9px] font-bold text-center py-0.5">NEW</div>
                    <button 
                      type="button"
                      onClick={() => setNewImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-error rounded-full flex items-center justify-center text-white transition-colors cursor-pointer border-none shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input 
              type="file" 
              accept="image/jpeg, image/png, image/gif" 
              multiple
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  setNewImages(prev => [...prev, ...Array.from(files)]);
                }
                setTimeout(() => { if (e.target) e.target.value = ''; }, 0);
              }}
              className="w-full text-[12px] file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[12px] file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />
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
