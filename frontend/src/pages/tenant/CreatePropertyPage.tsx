import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TenantLayout from '../../components/layout/TenantLayout';
import api from '../../api/axiosConfig';
import { useInputLimit } from '../../hooks/useInputLimit';

// Helper: renders a small "X / max" counter below an input
function CharCounter({ remaining, isLimitReached }: { remaining: number; isLimitReached: boolean }) {
  return (
    <p className={`text-[11px] mt-1 text-right transition-colors ${isLimitReached ? 'text-red-500 font-semibold' : 'text-on-surface-variant'}`}>
      {remaining} characters remaining
    </p>
  );
}

const INITIAL = { category_id: '' };

export default function CreatePropertyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Input Limit Hooks ──────────────────────────────────────
  const nameField        = useInputLimit('', 50);
  const descriptionField = useInputLimit('', 1000);
  const addressField     = useInputLimit('', 150);
  const cityField        = useInputLimit('', 50);
  const provinceField    = useInputLimit('', 50);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/tenant/categories', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (res.data.data) setCategories(res.data.data);
      } catch (err) {
        console.error("Gagal memuat kategori", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const oversizedFiles = imageFiles.filter(f => f.size > 1048576);
    if (oversizedFiles.length > 0) {
      setError('Each image must not exceed 1 MB.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLoading(false);
      return;
    }

    if (imageFiles.length > 5) {
      setError('A maximum of 5 photos are allowed.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      // Append limited field values
      formData.append('name',        nameField.value);
      formData.append('description', descriptionField.value);
      formData.append('address',     addressField.value);
      formData.append('city',        cityField.value);
      formData.append('province',    provinceField.value);
      formData.append('category_id', form.category_id);
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      const res = await api.post('/properties', formData, {
        headers: { 
          Authorization: `Bearer ${user?.token}`
        }
      });
      // Navigate to manage rooms for the new property
      navigate(`/tenant/properties/${res.data.data.id}/rooms`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal membuat properti.');
    } finally {
      setLoading(false);
    }
  };

  const INPUT = "w-full px-5 py-3.5 bg-surface-low border border-outline-variant/60 rounded-xl text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";
  const LABEL = "block text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-2";

  return (
    <TenantLayout title="Add Property" subtitle="List a new property">
      <div className="max-w-3xl mx-auto py-4">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="font-display font-bold text-2xl text-on-surface">Add New Property</h1>
            <p className="text-on-surface-variant text-[14px] mt-1">List a new property to start accepting bookings.</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-outline-variant/40 shadow-sm p-6 sm:p-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error/10 text-error flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <p className="text-[14px] font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Basic Info Section */}
            <div>
              <h3 className="font-display font-bold text-lg text-on-surface mb-4 pb-2 border-b border-outline-variant/30">1. Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={LABEL}>Property Name</label>
                  <input name="name" type="text" value={nameField.value} onChange={nameField.onChange} required className={INPUT} placeholder="e.g. Sunrise Villa Seminyak" />
                  <CharCounter remaining={nameField.remaining} isLimitReached={nameField.isLimitReached} />
                </div>
                <div className="md:col-span-2">
                  <label className={LABEL}>Category</label>
                  <select name="category_id" value={form.category_id} onChange={handleChange} required className={`${INPUT} appearance-none bg-white`}>
                    <option value="" disabled>Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={LABEL}>Description</label>
                  <textarea name="description" value={descriptionField.value} onChange={descriptionField.onChange} rows={4} className={INPUT} placeholder="Describe the best features of your property..." />
                  <CharCounter remaining={descriptionField.remaining} isLimitReached={descriptionField.isLimitReached} />
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="pt-4">
              <h3 className="font-display font-bold text-lg text-on-surface mb-4 pb-2 border-b border-outline-variant/30">2. Property Image</h3>
              
              {/* Images preview */}
              {imageFiles.length > 0 && (
                <div className="mb-6">
                  <p className="text-[12px] font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                    Gallery Preview ({imageFiles.length}/5)
                  </p>
                  <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                    {imageFiles.map((file, i) => (
                      <div key={`new-${i}`} className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border-2 border-primary/50 relative group transition-all">
                        <img src={URL.createObjectURL(file)} alt={`New ${i}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        <button 
                          type="button"
                          onClick={() => setImageFiles(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-error rounded-full flex items-center justify-center text-white transition-colors cursor-pointer border-none shadow-sm"
                          title="Remove photo"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <label className={LABEL}>Upload Photos (Max 5 images, Max 1MB each)</label>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/gif" 
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const newFiles = Array.from(files);
                      setImageFiles(prev => [...prev, ...newFiles]);
                    }
                    setTimeout(() => {
                      if (e.target) e.target.value = ''; 
                    }, 0);
                  }}
                  className={`${INPUT} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer`}
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="pt-4">
              <h3 className="font-display font-bold text-lg text-on-surface mb-4 pb-2 border-b border-outline-variant/30">3. Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={LABEL}>Address</label>
                  <input name="address" type="text" value={addressField.value} onChange={addressField.onChange} required className={INPUT} placeholder="Full street address" />
                  <CharCounter remaining={addressField.remaining} isLimitReached={addressField.isLimitReached} />
                </div>
                <div>
                  <label className={LABEL}>City</label>
                  <input name="city" type="text" value={cityField.value} onChange={cityField.onChange} required className={INPUT} placeholder="e.g. Badung" />
                  <CharCounter remaining={cityField.remaining} isLimitReached={cityField.isLimitReached} />
                </div>
                <div>
                  <label className={LABEL}>Province</label>
                  <input name="province" type="text" value={provinceField.value} onChange={provinceField.onChange} required className={INPUT} placeholder="e.g. Bali" />
                  <CharCounter remaining={provinceField.remaining} isLimitReached={provinceField.isLimitReached} />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-8 mt-8 border-t border-outline-variant/30 flex gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/tenant/properties')}
                className="flex-1 py-4 rounded-xl text-[14px] font-bold text-on-surface bg-surface-low border border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-[2] py-4 rounded-xl text-[14px] font-bold text-on-primary bg-primary hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer border-none shadow-sm"
              >
                {loading ? 'Saving Property...' : 'Save & Continue to Rooms'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </TenantLayout>
  );
}
