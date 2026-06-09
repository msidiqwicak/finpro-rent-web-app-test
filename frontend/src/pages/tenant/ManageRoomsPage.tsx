import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TenantLayout from '../../components/layout/TenantLayout';
import api from '../../api/axiosConfig';
import CreateRoomTypeModal from '../../components/tenant/CreateRoomTypeModal';
import EditRoomTypeModal from '../../components/tenant/EditRoomTypeModal';
import SetPriceModifierModal from '../../components/tenant/SetPriceModifierModal';

interface RoomType { id: string; name: string; price_per_night: number; capacity: number; }
interface Property { id: string; name: string; city: string; province: string; address: string; room_type: RoomType[]; }

export default function ManageRoomsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [showSetPrice, setShowSetPrice] = useState(false);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const res = await api.get('/properties/my', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      // Find the specific property from the list
      const prop = res.data.data.find((p: Property) => p.id === id);
      if (prop) setProperty(prop);
      else navigate('/tenant/properties');
    } catch (error) {
      console.error("Gagal memuat properti", error);
      navigate('/tenant/properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Hapus tipe kamar ini?')) return;
    try {
      await api.delete(`/properties/room-types/${roomId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      fetchProperty();
    } catch (error) {
      alert("Gagal menghapus tipe kamar.");
    }
  };

  if (loading) return <TenantLayout title="Manage Rooms" subtitle="Loading..."><div className="flex justify-center py-20"><span className="material-symbols-outlined text-primary text-[48px] animate-spin">progress_activity</span></div></TenantLayout>;
  if (!property) return null;

  return (
    <TenantLayout title="Manage Rooms" subtitle={property.name}>
      <div className="max-w-5xl mx-auto py-4">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/tenant/properties')}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">Property Management</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-on-surface">{property.name}</h1>
            <p className="text-on-surface-variant text-[14px] flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              {property.address}, {property.city}, {property.province}
            </p>
          </div>
        </div>

        {/* Dynamic Pricing / Actions Banner */}
        <div className="relative overflow-hidden bg-primary rounded-3xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container rounded-full blur-[80px] opacity-10 -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10 text-on-primary">
            <h2 className="font-display font-bold text-2xl mb-2 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-container text-[28px]">payments</span>
              Dynamic Pricing
            </h2>
            <p className="text-[15px] max-w-lg opacity-80 leading-relaxed font-body">
              Maximize your revenue by adjusting prices during holidays or weekends. Select your rooms and set custom price modifiers easily.
            </p>
          </div>
          <button 
            onClick={() => setShowSetPrice(true)}
            disabled={property.room_type.length === 0}
            className="relative z-10 w-full md:w-auto flex items-center justify-center gap-2 bg-secondary-container text-on-secondary-container font-bold text-[14px] px-6 py-4 rounded-xl hover:bg-[#c5d88f] transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            Set Dynamic Price
          </button>
        </div>

        {/* Room Types Section */}
        <div className="bg-white rounded-3xl border border-outline-variant/40 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-xl text-on-surface">Room Types</h2>
              <p className="text-[14px] text-on-surface-variant mt-1">Manage the different types of rooms available in this property.</p>
            </div>
            <button 
              onClick={() => setShowAddRoom(true)}
              className="flex items-center justify-center gap-2 bg-primary text-on-primary font-bold text-[14px] px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Room Type
            </button>
          </div>

          {property.room_type.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <span className="material-symbols-outlined text-[48px] text-outline mb-3">meeting_room</span>
              <p className="text-[15px] font-bold text-on-surface">No Room Types</p>
              <p className="text-[14px] text-on-surface-variant max-w-xs mt-1">You need to add at least one room type before you can accept bookings or set pricing.</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/30">
              {property.room_type.map((rt) => (
                <div key={rt.id} className="p-6 hover:bg-surface-low transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[28px] text-outline">bed</span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-on-surface">{rt.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-[13px] text-on-surface-variant font-medium">
                          <span className="material-symbols-outlined text-[16px]">group</span>
                          Up to {rt.capacity} guests
                        </span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                        <span className="text-[14px] font-bold text-primary-container">
                          Rp {Number(rt.price_per_night).toLocaleString('id-ID')} <span className="font-normal text-on-surface-variant text-[13px]">/ night</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingRoomType(rt)}
                      className="px-4 py-2 rounded-lg border border-outline-variant text-[13px] font-bold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteRoom(rt.id)}
                      className="px-4 py-2 rounded-lg bg-error/10 text-error text-[13px] font-bold hover:bg-error/20 transition-colors border-none cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddRoom && (
        <CreateRoomTypeModal 
          propertyId={property.id} 
          propertyName={property.name}
          onSuccess={() => { setShowAddRoom(false); fetchProperty(); }} 
          onClose={() => setShowAddRoom(false)} 
        />
      )}

      {editingRoomType && (
        <EditRoomTypeModal 
          roomType={editingRoomType}
          onSuccess={() => { setEditingRoomType(null); fetchProperty(); }} 
          onClose={() => setEditingRoomType(null)} 
        />
      )}

      {showSetPrice && (
        <SetPriceModifierModal 
          roomTypes={property.room_type} 
          onSuccess={() => { setShowSetPrice(false); fetchProperty(); }} 
          onClose={() => setShowSetPrice(false)} 
        />
      )}
    </TenantLayout>
  );
}
