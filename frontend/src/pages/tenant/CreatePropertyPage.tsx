import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TenantLayout from '../../components/layout/TenantLayout';
import api from '../../api/axiosConfig';

const INITIAL = { name: '', description: '', address: '', city: '', province: '', category_id: '' };

export default function CreatePropertyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/properties/categories');
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
      setError('Setiap gambar tidak boleh lebih dari 1 MB.');
      setLoading(false);
      return;
    }

    if (imageFiles.length > 5) {
      setError('Maksimal 5 foto yang diizinkan.');
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
                  <input name="name" type="text" value={form.name} onChange={handleChange} required className={INPUT} placeholder="e.g. Sunrise Villa Seminyak" />
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
                  <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={INPUT} placeholder="Describe the best features of your property..." />
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="pt-4">
              <h3 className="font-display font-bold text-lg text-on-surface mb-4 pb-2 border-b border-outline-variant/30">2. Property Image</h3>
              <div className="md:col-span-2">
                <label className={LABEL}>Property Photos (Max 5 images, Max 1MB each)</label>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/gif" 
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setImageFiles(Array.from(e.target.files));
                    }
                  }}
                  className={`${INPUT} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer`}
                />
                {imageFiles.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-[12px] font-bold text-on-surface">Selected ({imageFiles.length}):</p>
                    {imageFiles.map((f, i) => (
                      <p key={i} className="text-[12px] text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">image</span>
                        {f.name} ({(f.size / 1024).toFixed(1)} KB)
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Location Section */}
            <div className="pt-4">
              <h3 className="font-display font-bold text-lg text-on-surface mb-4 pb-2 border-b border-outline-variant/30">3. Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={LABEL}>Address</label>
                  <input name="address" type="text" value={form.address} onChange={handleChange} required className={INPUT} placeholder="Full street address" />
                </div>
                <div>
                  <label className={LABEL}>City</label>
                  <input name="city" type="text" value={form.city} onChange={handleChange} required className={INPUT} placeholder="e.g. Badung" />
                </div>
                <div>
                  <label className={LABEL}>Province</label>
                  <input name="province" type="text" value={form.province} onChange={handleChange} required className={INPUT} placeholder="e.g. Bali" />
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
