import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import TenantLayout from '../../components/layout/TenantLayout';
import api from '../../api/axiosConfig';

// ── Types ─────────────────────────────────────────────────────
interface Category {
  id: string;
  name: string;
  _count?: { property: number };
}

interface ApiError {
  response?: { data?: { error?: string } };
  message: string;
}

// ── Skeleton Loader ───────────────────────────────────────────
function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-outline-variant/20 animate-pulse">
          <div className="w-8 h-8 bg-surface-container-high rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-surface-container-high rounded w-1/3" />
            <div className="h-3 bg-surface-container-high rounded w-1/5" />
          </div>
          <div className="flex gap-2">
            <div className="w-20 h-8 bg-surface-container-high rounded-lg" />
            <div className="w-20 h-8 bg-surface-container-high rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Toast Notification ────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] text-[14px] font-semibold animate-in slide-in-from-right duration-300 ${
      type === 'success'
        ? 'bg-primary-container text-on-primary-container'
        : 'bg-red-50 text-red-700 border border-red-200'
    }`}>
      <span className="material-symbols-outlined text-[18px]">
        {type === 'success' ? 'check_circle' : 'error'}
      </span>
      {message}
    </div>
  );
}

// ── Category Modal (Create / Edit) ────────────────────────────
function CategoryModal({
  isOpen,
  mode,
  initialName,
  loading,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialName: string;
  loading: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState(initialName);

  // Sync initialName when modal opens/changes
  useEffect(() => { setName(initialName); }, [initialName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-[0_12px_40px_rgba(6,27,14,0.15)] w-full max-w-md mx-4 p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px] text-primary">
                {mode === 'create' ? 'add_circle' : 'edit'}
              </span>
            </div>
            <h2 className="font-display font-bold text-lg text-on-surface">
              {mode === 'create' ? 'Create Category' : 'Edit Category'}
            </h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors cursor-pointer border-none bg-transparent">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="mb-6">
            <label htmlFor="category-name" className="block text-[12px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
              Category Name
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hotel, Villa, Apartment"
              autoFocus
              disabled={loading}
              className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-[15px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-bold text-[14px] hover:bg-surface-container-low transition-colors cursor-pointer bg-transparent disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-[14px] hover:opacity-90 transition-opacity cursor-pointer border-none disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">{mode === 'create' ? 'add' : 'check'}</span>
              )}
              {mode === 'create' ? 'Create' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirmation Modal ─────────────────────────────────
function DeleteModal({
  isOpen,
  categoryName,
  loading,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  categoryName: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-[0_12px_40px_rgba(6,27,14,0.15)] w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[28px] text-red-500">delete_forever</span>
          </div>
          <h3 className="font-display font-bold text-lg text-on-surface mb-2">Delete Category?</h3>
          <p className="text-[14px] text-on-surface-variant mb-6">
            Are you sure you want to delete <strong>"{categoryName}"</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-bold text-[14px] hover:bg-surface-container-low transition-colors cursor-pointer bg-transparent disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-[14px] hover:bg-red-600 transition-colors cursor-pointer border-none disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page Component ───────────────────────────────────────
export default function PropertyCategoryManagement() {
  const { user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  const getErrorMessage = (err: unknown): string => {
    const apiErr = err as ApiError;
    return apiErr.response?.data?.error || apiErr.message || 'Terjadi kesalahan.';
  };

  // ── Fetch categories ──────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/tenant/categories', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setCategories(res.data.data || []);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [user?.token, showToast]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // ── Create / Update handler ───────────────────────────────
  const handleSubmit = async (name: string) => {
    setActionLoading(true);
    try {
      if (modalMode === 'create') {
        await api.post('/tenant/categories', { name }, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        showToast(`Kategori "${name}" berhasil dibuat.`, 'success');
      } else if (editingCategory) {
        await api.put(`/tenant/categories/${editingCategory.id}`, { name }, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        showToast(`Kategori berhasil diubah menjadi "${name}".`, 'success');
      }
      setModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Delete handler ────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await api.delete(`/tenant/categories/${deleteTarget.id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      showToast(`Kategori "${deleteTarget.name}" berhasil dihapus.`, 'success');
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Open modal helpers ────────────────────────────────────
  const openCreateModal = () => {
    setModalMode('create');
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setModalMode('edit');
    setEditingCategory(cat);
    setModalOpen(true);
  };

  return (
    <TenantLayout title="Property Categories" subtitle="Manage your property categories">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-on-surface">Property Categories</h1>
            <p className="text-on-surface-variant text-[15px] mt-1">
              Create and manage categories for your properties.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary font-bold text-[14px] px-6 py-3 rounded-xl shadow-sm hover:opacity-90 hover:shadow-md transition-all cursor-pointer border-none"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Category
          </button>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <TableSkeleton />
        ) : categories.length === 0 ? (
          /* ── Empty State ── */
          <div className="text-center py-24 bg-white rounded-3xl border border-outline-variant/40 shadow-sm flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[40px] text-on-primary-container">category</span>
            </div>
            <h3 className="font-display font-bold text-xl text-on-surface">No Categories Yet</h3>
            <p className="text-on-surface-variant text-[15px] max-w-sm mt-2 mb-6">
              You haven't created any property categories. Create your first one to organize your properties.
            </p>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-primary text-on-primary font-bold text-[14px] px-6 py-3 rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create First Category
            </button>
          </div>
        ) : (
          /* ── Table ── */
          <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3.5 bg-surface-low border-b border-outline-variant/30">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Category Name</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant text-center w-24">Properties</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant text-right w-40">Actions</span>
            </div>

            {/* Table Rows */}
            {categories.map((cat, index) => (
              <div
                key={cat.id}
                className={`grid grid-cols-[1fr_auto_auto] gap-4 items-center px-6 py-4 hover:bg-surface-low/50 transition-colors ${
                  index < categories.length - 1 ? 'border-b border-outline-variant/20' : ''
                }`}
              >
                {/* Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px] text-primary">label</span>
                  </div>
                  <span className="font-semibold text-[15px] text-on-surface truncate">{cat.name}</span>
                </div>

                {/* Property Count */}
                <div className="w-24 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold ${
                    (cat._count?.property ?? 0) > 0
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[14px]">home</span>
                    {cat._count?.property ?? 0}
                  </span>
                </div>

                {/* Actions */}
                <div className="w-40 flex justify-end gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-outline-variant text-on-surface text-[12px] font-bold hover:bg-surface-container-low transition-colors cursor-pointer bg-transparent"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-50 text-red-600 text-[12px] font-bold hover:bg-red-100 transition-colors cursor-pointer border-none"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <CategoryModal
        isOpen={modalOpen}
        mode={modalMode}
        initialName={editingCategory?.name ?? ''}
        loading={actionLoading}
        onClose={() => { setModalOpen(false); setEditingCategory(null); }}
        onSubmit={handleSubmit}
      />

      <DeleteModal
        isOpen={!!deleteTarget}
        categoryName={deleteTarget?.name ?? ''}
        loading={actionLoading}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </TenantLayout>
  );
}
