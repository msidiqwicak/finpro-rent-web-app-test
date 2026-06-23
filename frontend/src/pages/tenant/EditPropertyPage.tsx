import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TenantLayout from '../../components/layout/TenantLayout';
import api from '../../api/axiosConfig';

const INITIAL = { name: '', description: '', address: '', city: '', province: '', category_id: '' };

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState(INITIAL);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch categories
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

  // 2. Fetch property details
  const fetchProperty = useCallback(async () => {
    try {
      const res = await api.get('/properties/my', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      const prop = res.data.data.find((p: any) => p.id === id);
      if (prop) {
        setForm({
          name: prop.name || '',
          description: prop.description || '',
          address: prop.address || '',
          city: prop.city || '',
          province: prop.province || '',
          category_id: prop.category_id || ''
        });
        setExistingImages(prop.image_urls || []);
      } else {
        navigate('/tenant/properties');
      }
    } catch (err) {
      console.error("Gagal memuat detail properti", err);
      navigate('/tenant/properties');
    } finally {
      setLoading(false);
    }
  }, [id, user?.token, navigate]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const totalImages = existingImages.length + imageFiles.length;
    if (totalImages > 5) {
      setError('Maksimal total 5 foto yang diizinkan (gabungan foto lama dan baru).');
      setSaving(false);
      return;
    }

    const oversizedFiles = imageFiles.filter(f => f.size > 1048576);
    if (oversizedFiles.length > 0) {
      setError('Setiap gambar tidak boleh lebih dari 1 MB.');
      setSaving(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        formData.append(key, val);
      });
      
      // Append kept existing images
      if (existingImages.length === 0) {
        formData.append('existing_images', ''); // Send empty to tell backend we deleted all
      } else {
        existingImages.forEach(url => {
          formData.append('existing_images', url);
        });
      }

      // Append new images
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      await api.put(`/properties/${id}`, formData, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      navigate('/tenant/properties');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal memperbarui properti.');
    } finally {
      setSaving(false);
    }
  };

  const INPUT = "w-full px-5 py-3.5 bg-surface-low border border-outline-variant/60 rounded-xl text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";
  const LABEL = "block text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-2";

  if (loading) {
    return (
      <TenantLayout title="Edit Property" subtitle="Loading data...">
        <div className="flex justify-center py-20">
          <span className="material-symbols-outlined text-primary text-[48px] animate-spin">progress_activity</span>
        </div>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout title="Edit Property" subtitle="Update your property details">
      <div className="max-w-3xl mx-auto py-4">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/tenant/properties')}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer border-none shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="font-display font-bold text-2xl text-on-surface">Edit Property</h1>
            <p className="text-on-surface-variant text-[14px] mt-1">Update basic information and location.</p>
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

          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 mb-8 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary mt-0.5">info</span>
            <div className="text-[13px] text-on-surface-variant leading-relaxed">
              <strong>Photo Upload Info:</strong> 
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>You can delete specific photos you no longer want.</li>
                <li>You can upload new photos to add to your property.</li>
                <li>Maximum limit is <strong>5 photos total</strong> (combined existing and new photos).</li>
                <li className="text-primary font-bold">Important: Deletions and additions are only saved after you click "Save Changes".</li>
              </ul>
            </div>
          </div>

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
              
              {/* Images preview (Combined Existing and New) */}
              {(existingImages.length > 0 || imageFiles.length > 0) && (
                <div className="mb-6">
                  <p className="text-[12px] font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                    Gallery Preview ({existingImages.length + imageFiles.length}/5)
                  </p>
                  <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                    
                    {/* Render Existing Images */}
                    {existingImages.map((url, i) => (
                      <div key={`existing-${i}`} className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border-2 border-transparent hover:border-error/50 relative group transition-all">
                        <img src={`http://localhost:8000/${url.replace(/\\/g, '/')}`} alt={`Property ${i}`} className="w-full h-full object-cover" onError={(e) => {
                          if (url.startsWith('http')) (e.target as HTMLImageElement).src = url;
                          else (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Image';
                        }} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        <button 
                          type="button"
                          onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-error rounded-full flex items-center justify-center text-white transition-colors cursor-pointer border-none shadow-sm"
                          title="Remove photo"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    ))}

                    {/* Render New Uploaded Images */}
                    {imageFiles.map((file, i) => (
                      <div key={`new-${i}`} className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border-2 border-primary/50 relative group transition-all">
                        <img src={URL.createObjectURL(file)} alt={`New ${i}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        <span className="absolute bottom-1 left-1 text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded">NEW</span>
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
                <label className={LABEL}>Upload New Photos (Max 1MB each)</label>
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
                    // Delay the reset slightly so browser has time to read the FileList
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
                disabled={saving}
                className="flex-[2] py-4 rounded-xl text-[14px] font-bold text-on-primary bg-primary hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer border-none shadow-sm flex justify-center items-center gap-2"
              >
                {saving && <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </TenantLayout>
  );
}
