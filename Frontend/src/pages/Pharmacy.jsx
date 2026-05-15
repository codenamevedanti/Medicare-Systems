import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Search, Edit, Trash2, Pill, X, AlertTriangle, Package, ChevronRight, Tag, Hash, Calendar } from 'lucide-react';

const emptyForm = {
  name: '', category: '', quantity: '', unit: '',
  price: '', expiryDate: '', manufacturer: '', minStock: ''
};

const CATEGORIES = ['Antibiotic', 'Painkiller', 'Antiviral', 'Vitamin', 'Antifungal', 'Cardiovascular', 'Diabetic', 'Other'];

const CAT_COLORS = {
  Antibiotic:     'bg-blue-50 text-blue-600 border-blue-100',
  Painkiller:     'bg-rose-50 text-rose-600 border-rose-100',
  Antiviral:      'bg-violet-50 text-violet-600 border-violet-100',
  Vitamin:        'bg-amber-50 text-amber-600 border-amber-100',
  Antifungal:     'bg-orange-50 text-orange-600 border-orange-100',
  Cardiovascular: 'bg-red-50 text-red-600 border-red-100',
  Diabetic:       'bg-teal-50 text-teal-600 border-teal-100',
  Other:          'bg-slate-50 text-slate-600 border-slate-100',
};

const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="group">
    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-green-500 transition-colors" />}
      <input {...props}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl
          text-sm text-slate-700 placeholder-slate-300
          focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 focus:bg-white transition-all`}
      />
    </div>
  </div>
);

export default function Pharmacy() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMed, setEditMed] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchMedicines = () => {
    api.get(search ? `/pharmacy/search?q=${search}` : '/pharmacy')
      .then(r => setMedicines(r.data)).catch(() => setMedicines([]));
  };

  useEffect(() => { fetchMedicines(); }, [search]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      editMed
        ? await api.put(`/pharmacy/${editMed._id}`, form)
        : await api.post('/pharmacy', form);
      setShowForm(false); setEditMed(null); setForm(emptyForm); fetchMedicines();
    } finally { setSaving(false); }
  };

  const handleEdit = (m) => {
    setEditMed(m);
    setForm({ name: m.name, category: m.category, quantity: m.quantity,
      unit: m.unit, price: m.price, expiryDate: m.expiryDate?.split('T')[0] ?? '',
      manufacturer: m.manufacturer, minStock: m.minStock });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await api.delete(`/pharmacy/${id}`); setDeleteConfirm(null); fetchMedicines();
  };

  const openAdd = () => { setEditMed(null); setForm(emptyForm); setShowForm(true); };
  const isLowStock = (m) => m.quantity <= (m.minStock || 10);
  const lowStockCount = medicines.filter(isLowStock).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/40 to-white p-6 md:p-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600
            flex items-center justify-center shadow-lg shadow-green-200">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pharmacy</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              <span className="text-green-600 font-semibold">{medicines.length}</span> medicines
              {lowStockCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-amber-600 font-semibold">
                  <AlertTriangle className="w-3 h-3" /> {lowStockCount} low stock
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search medicines..."
              className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                text-slate-600 placeholder-slate-300 focus:outline-none focus:ring-2
                focus:ring-green-500/20 focus:border-green-400 transition-all w-60 shadow-sm" />
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white
              px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-green-200
              hover:shadow-lg transition-all hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> Add Medicine
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-700">{lowStockCount} medicine{lowStockCount > 1 ? 's' : ''} running low</p>
            <p className="text-xs text-amber-500 mt-0.5">Please restock soon to avoid shortages</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {medicines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
              <Pill className="w-8 h-8 text-green-300" />
            </div>
            <p className="text-slate-500 font-medium">No medicines found</p>
            <p className="text-slate-300 text-sm mt-1">Add your first medicine to inventory</p>
            <button onClick={openAdd} className="mt-5 flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium">
              <Plus className="w-4 h-4" /> Add Medicine <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Medicine', 'Category', 'Stock', 'Price', 'Expiry', 'Manufacturer', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {medicines.map(m => (
                  <tr key={m._id} className={`border-b border-slate-50 transition-colors group
                    ${isLowStock(m) ? 'bg-amber-50/40 hover:bg-amber-50/60' : 'hover:bg-green-50/30'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                          <Pill className="w-4 h-4 text-green-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-700">{m.name}</div>
                          {isLowStock(m) && (
                            <div className="text-xs text-amber-500 flex items-center gap-1 mt-0.5">
                              <AlertTriangle className="w-3 h-3" /> Low stock
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border
                        ${CAT_COLORS[m.category] ?? CAT_COLORS.Other}`}>
                        {m.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${isLowStock(m) ? 'text-amber-600' : 'text-slate-700'}`}>
                        {m.quantity}
                      </span>
                      <span className="text-slate-400 text-xs ml-1">{m.unit}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">₹{m.price}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {m.expiryDate ? new Date(m.expiryDate).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{m.manufacturer || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(m)} className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteConfirm(m)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1100] flex items-start justify-center p-4 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 animate-in">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <Pill className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">{editMed ? 'Edit Medicine' : 'Add Medicine'}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{editMed ? 'Update inventory details' : 'Add to pharmacy inventory'}</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-7 py-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Medicine Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <InputField label="Medicine Name" icon={Pill} type="text" required placeholder="Paracetamol 500mg"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <div className="group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700
                      focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 focus:bg-white
                      transition-all appearance-none cursor-pointer">
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <InputField label="Quantity" icon={Hash} type="number" required placeholder="100"
                  value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                <InputField label="Unit" icon={Package} type="text" placeholder="tablets / ml / mg"
                  value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
                <InputField label="Price (₹)" icon={Tag} type="number" placeholder="50"
                  value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                <InputField label="Min. Stock Alert" icon={AlertTriangle} type="number" placeholder="10"
                  value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} />
                <InputField label="Expiry Date" icon={Calendar} type="date"
                  value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} />
                <InputField label="Manufacturer" icon={Package} type="text" placeholder="Cipla, Sun Pharma..."
                  value={form.manufacturer} onChange={e => setForm({ ...form, manufacturer: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
                <button type="button" onClick={handleSubmit} disabled={saving}
                  className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold shadow-md shadow-green-200 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  {saving ? 'Saving…' : editMed ? 'Update Medicine' : 'Add Medicine'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1100] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 text-center animate-in">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Delete Medicine?</h3>
            <p className="text-sm text-slate-400 mb-6">
              Remove <span className="font-semibold text-slate-600">{deleteConfirm.name}</span> from inventory? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm._id)} className="flex-1 bg-red-500 hover:bg-red-400 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-red-100 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}