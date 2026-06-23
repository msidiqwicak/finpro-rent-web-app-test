import { useState, useEffect } from "react";

const INPUT =
  "w-full px-4 py-2.5 bg-surface-low border border-outline-variant rounded-xl text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

const INITIAL = {
  name: "",
  description: "",
  address: "",
  city: "",
  province: "",
  category_id: "",
};

export default function CreatePropertyModal({ onSuccess, onClose }: Props) {
  const [form, setForm] = useState(INITIAL);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { default: api } = await import("../../api/axiosConfig");
        const res = await api.get("/properties/categories");
        if (res.data.data) setCategories(res.data.data);
      } catch (err) {
        console.error("Gagal memuat kategori", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { default: api } = await import("../../api/axiosConfig");
      await api.post("/properties", form);
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Gagal membuat properti.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-xl text-on-surface">
            Add New Property
          </h2>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-on-surface-variant hover:text-on-surface cursor-pointer bg-transparent border-none text-[22px]"
          >
            close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { name: "name", label: "Property Name", type: "text" },
            { name: "address", label: "Address", type: "text" },
            { name: "city", label: "City", type: "text" },
            { name: "province", label: "Province", type: "text" },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                {label}
              </label>
              <input
                name={name}
                type={type}
                value={(form as any)[name]}
                onChange={handleChange}
                required
                className={INPUT}
              />
            </div>
          ))}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
              Category
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              className={INPUT}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={INPUT}
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 font-semibold">{error}</p>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-on-primary font-bold text-[14px] py-3 rounded-xl hover:opacity-90 disabled:opacity-60 cursor-pointer border-none"
            >
              {loading ? "Creating…" : "Create Property"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface-low text-on-surface font-semibold text-[14px] py-3 rounded-xl cursor-pointer border border-outline-variant"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
