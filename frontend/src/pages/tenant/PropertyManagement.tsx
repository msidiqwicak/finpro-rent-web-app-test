import { useState, useEffect } from 'react';
import { useAuth }              from '../../context/AuthContext';
import CreatePropertyModal      from '../../components/tenant/CreatePropertyModal';
import SetPriceModifierModal    from '../../components/tenant/SetPriceModifierModal';
import CreateRoomTypeModal      from '../../components/tenant/CreateRoomTypeModal';

const API = 'http://localhost:8000/api/properties';

interface RoomType  { id: string; name: string; price_per_night: number; }
interface Property  { id: string; name: string; city: string; province: string; address: string; room_type: RoomType[]; }

function PropertyCard({ prop, onAddRoom, onSetPrice, onDelete }: {
  prop: Property; 
  onAddRoom: (p: Property) => void;
  onSetPrice: (rt: RoomType[]) => void; 
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="font-display font-bold text-lg text-on-surface">{prop.name}</h3>
          <p className="text-on-surface-variant text-[13px]">{prop.address}, {prop.city}, {prop.province}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => onAddRoom(prop)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors cursor-pointer border-none">
            <span className="material-symbols-outlined text-[15px]">add_box</span>Add Room
          </button>
          {prop.room_type.length > 0 && (
            <button onClick={() => onSetPrice(prop.room_type)}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer border-none">
              <span className="material-symbols-outlined text-[15px]">sell</span>Set Price
            </button>
          )}
          <button onClick={() => onDelete(prop.id)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer border-none">
            <span className="material-symbols-outlined text-[15px]">delete</span>Delete
          </button>
        </div>
      </div>
      {prop.room_type.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {prop.room_type.map((rt) => (
            <span key={rt.id} className="text-[12px] px-2.5 py-1 rounded-full bg-surface-low text-on-surface-variant font-medium border border-outline-variant/50">
              {rt.name} — Rp {Number(rt.price_per_night).toLocaleString('id-ID')}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[12px] text-on-surface-variant italic mt-2">No room types added yet.</p>
      )}
    </div>
  );
}

export default function PropertyManagement() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading,    setLoading]    = useState(true);
  
  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [addRoomProp, setAddRoomProp] = useState<Property | null>(null);
  const [priceRoomTypes, setPriceRoomTypes] = useState<RoomType[] | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/my`, { headers: { Authorization: `Bearer ${user?.token}` } });
      const data = await res.json();
      if (data.data) setProperties(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus properti ini?')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${user?.token}` } });
    fetchProperties();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-on-surface">My Properties</h2>
          <p className="text-on-surface-variant text-[14px]">Manage your rental properties and room pricing.</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-primary text-on-primary font-bold text-[13px] px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none">
          <span className="material-symbols-outlined text-[18px]">add</span>Add Property
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="material-symbols-outlined text-primary text-[48px] animate-spin">progress_activity</span>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-outline-variant/30">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-3 block">home_work</span>
          <p className="font-bold text-on-surface">No properties yet</p>
          <p className="text-on-surface-variant text-sm mt-1">Click "Add Property" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((p) => (
            <PropertyCard 
              key={p.id} 
              prop={p} 
              onAddRoom={setAddRoomProp}
              onSetPrice={setPriceRoomTypes} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreate && (
        <CreatePropertyModal onSuccess={() => { setShowCreate(false); fetchProperties(); }} onClose={() => setShowCreate(false)} />
      )}
      
      {addRoomProp && (
        <CreateRoomTypeModal 
          propertyId={addRoomProp.id} 
          propertyName={addRoomProp.name}
          onSuccess={() => { setAddRoomProp(null); fetchProperties(); }} 
          onClose={() => setAddRoomProp(null)} 
        />
      )}

      {priceRoomTypes && (
        <SetPriceModifierModal 
          roomTypes={priceRoomTypes} 
          onSuccess={() => { setPriceRoomTypes(null); fetchProperties(); }} 
          onClose={() => setPriceRoomTypes(null)} 
        />
      )}
    </div>
  );
}
