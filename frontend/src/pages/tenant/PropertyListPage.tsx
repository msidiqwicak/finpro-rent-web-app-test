import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUrl';
import { useAuth } from '../../context/AuthContext';
import TenantLayout from '../../components/layout/TenantLayout';
import api from '../../api/axiosConfig';

interface RoomType { id: string; name: string; price_per_night: number; }
interface Property { id: string; name: string; city: string; province: string; address: string; room_type: RoomType[]; image_urls: string[]; }

export default function PropertyListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get('/properties/my', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.data.data) setProperties(res.data.data);
    } catch (error) {
      console.error("Gagal memuat properti", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus properti ini?')) return;
    try {
      await api.delete(`/properties/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      fetchProperties();
    } catch (error) {
      alert("Gagal menghapus properti.");
    }
  };

  return (
    <TenantLayout title="My Properties" subtitle="Manage your properties, rooms, and dynamic pricing">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-end gap-4 mb-8">
          <button
            onClick={() => navigate('/tenant/properties/create')}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary font-bold text-[14px] px-6 py-3 rounded-xl shadow-sm hover:opacity-90 hover:shadow-md transition-all cursor-pointer border-none"
          >
            <span className="material-symbols-outlined text-[20px]">add_home</span>
            Add Property
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined text-primary text-[48px] animate-spin">progress_activity</span>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-outline-variant/40 shadow-sm flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[40px] text-on-primary-container">domain_disabled</span>
            </div>
            <h3 className="font-display font-bold text-xl text-on-surface">No Properties Found</h3>
            <p className="text-on-surface-variant text-[15px] max-w-sm mt-2 mb-6">
              You haven't listed any properties yet. Create your first property to start receiving bookings.
            </p>
            <button
              onClick={() => navigate('/tenant/properties/create')}
              className="flex items-center gap-2 bg-primary text-on-primary font-bold text-[14px] px-6 py-3 rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="h-48 bg-surface-container-high relative flex-shrink-0 overflow-hidden">
                  {p.image_urls && p.image_urls.length > 0 ? (
                    <img 
                      src={getImageUrl(p.image_urls[0])} 
                      alt={p.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Property';
                      }}
                    />
                  ) : (
                    <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[48px] text-outline opacity-50">holiday_village</span>
                  )}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-bold text-on-surface z-10 shadow-sm">
                    {p.room_type.length} Room Types
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-display font-bold text-lg text-on-surface leading-tight mb-1">{p.name}</h3>
                  <p className="text-[13px] text-on-surface-variant mb-4 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {p.city}, {p.province}
                  </p>
                  
                  <div className="mt-auto space-y-3 pt-4 border-t border-outline-variant/30">
                    <button
                      onClick={() => navigate(`/tenant/properties/${p.id}/rooms`)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary-container text-on-secondary-container text-[13px] font-bold hover:opacity-90 transition-opacity cursor-pointer border-none"
                    >
                      <span className="material-symbols-outlined text-[18px]">meeting_room</span>
                      Manage Rooms & Pricing
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/tenant/properties/${p.id}/edit`)}
                        className="flex-1 flex items-center justify-center py-2 rounded-xl border border-outline-variant text-on-surface text-[12px] font-bold hover:bg-surface-container-low transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] mr-1">edit</span> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="flex-1 flex items-center justify-center py-2 rounded-xl bg-error/10 text-error text-[12px] font-bold hover:bg-error/20 transition-colors cursor-pointer border-none"
                      >
                        <span className="material-symbols-outlined text-[16px] mr-1">delete</span> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </TenantLayout>
  );
}
