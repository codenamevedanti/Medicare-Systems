// src/pages/Billing.jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Search, Eye, Trash2, X, Printer, ReceiptText, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { createBill } from '../api/billingService';

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (raw) => {
  if (!raw) return '—';
  const d = new Date(raw);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatINR = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? '₹0' : `₹${n.toLocaleString('en-IN')}`;
};

const STATUS_CFG = {
  paid:    { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', dot: '#22c55e', label: 'Paid' },
  pending: { bg: '#fffbeb', color: '#b45309', border: '#fde68a', dot: '#f59e0b', label: 'Pending' },
  overdue: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', dot: '#ef4444', label: 'Overdue' },
  unpaid:  { bg: '#fffbeb', color: '#b45309', border: '#fde68a', dot: '#f59e0b', label: 'Unpaid' },
  partial: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', dot: '#3b82f6', label: 'Partial' },
  refunded:{ bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe', dot: '#8b5cf6', label: 'Refunded' },
};
const getStatus = (s) => STATUS_CFG[s?.toLowerCase()] ?? STATUS_CFG.pending;

// ── Helper: get patient display name from bill object ─────────────────────────
const getPatientName = (bill) => {
  if (!bill.patient) return '—';
  const { firstName, lastName } = bill.patient;
  return `${firstName || ''} ${lastName || ''}`.trim() || '—';
};

// ── Helper: get subtotal from items array ─────────────────────────────────────
const getSubtotal = (items) =>
  (items || []).reduce((s, i) => s + (parseFloat(i.totalPrice) || 0), 0);

const emptyForm = {
  patientName: '', patientId: '', doctorName: '',
  date: new Date().toISOString().split('T')[0],
  services: [{ description: '', amount: '' }],
  discount: 0, notes: '',
};

// ── Sub-components ────────────────────────────────────────────────────────────
const StatusPill = ({ status }) => {
  const s = getStatus(status);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 20,
      fontSize: 11.5, fontWeight: 700,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, color, bg, sub }) => (
  <div style={{
    background: '#fff', borderRadius: 16, padding: '20px 22px',
    border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    display: 'flex', alignItems: 'center', gap: 16,
  }}>
    <div style={{ width: 46, height: 46, borderRadius: 13, background: bg, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={20} color={color} strokeWidth={1.8} />
    </div>
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.5px' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>{label}</div>
      {sub && <div style={{ fontSize: 11.5, color, fontWeight: 600, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

const inputSt = {
  width: '100%', padding: '10px 14px',
  background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10,
  fontSize: 13, color: '#334155', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', transition: 'border-color .2s, box-shadow .2s',
};
const focusBlue = (e) => { e.target.style.borderColor = '#1d4ed8'; e.target.style.boxShadow = '0 0 0 3px rgba(29,78,216,.1)'; e.target.style.background = '#fff'; };
const blurReset = (e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; };

const Field = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>{label}</label>
    {children}
  </div>
);

const SLabel = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: '#94a3b8', whiteSpace: 'nowrap' }}>{children}</span>
    <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Billing() {
  const [bills, setBills]           = useState([]);
  const [search, setSearch]         = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [viewBill, setViewBill]     = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [delConfirm, setDelConfirm] = useState(null);

  useEffect(() => {
    fetchBills();
  }, [search]);

  const fetchBills = () => {
    api.get(search ? `/billing/search?q=${search}` : '/billing')
      .then(r => {
        const data = r.data;
        setBills(Array.isArray(data) ? data : []);
      })
      .catch(() => setBills([]));
  };

  const addService    = () => setForm(f => ({ ...f, services: [...f.services, { description: '', amount: '' }] }));
  const removeService = (i) => setForm(f => ({ ...f, services: f.services.filter((_, idx) => idx !== i) }));
  const updateService = (i, field, value) => {
    const s = [...form.services]; s[i][field] = value;
    setForm(f => ({ ...f, services: s }));
  };

  const subtotal = form.services.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
  const total    = subtotal - (parseFloat(form.discount) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        items: form.services.map(s => ({
          itemName: s.description,
          category: 'GENERAL',
          quantity: 1,
          price: parseFloat(s.amount) || 0,
          totalPrice: parseFloat(s.amount) || 0,
        })),
        doctorName: form.doctorName,
        date: form.date,
        notes: form.notes,
        discountAmount: parseFloat(form.discount) || 0,
        totalAmount: total,
      };

      await createBill(form.patientId, payload);

      setShowForm(false);
      setForm(emptyForm);
      fetchBills();
    } catch (err) {
      console.error('Invoice creation failed:', err.response?.data);
      alert(err.response?.data?.message || 'An unexpected error occurred');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/billing/${id}`);
    setDelConfirm(null); fetchBills();
  };

  const handleMarkPaid = async (id) => {
    try {
      await api.put(`/billing/${id}/pay`);
      fetchBills();
    } catch (err) {
      console.error('Failed to mark as paid:', err);
      alert('Could not mark bill as paid.');
    }
  };

  // ── FIX: use backend field names (paymentStatus, totalAmount) ──
  const paidBills    = bills.filter(b => b.paymentStatus === 'PAID');
  const pendingBills = bills.filter(b => !b.paymentStatus || b.paymentStatus === 'PENDING' || b.paymentStatus === 'UNPAID');
  const totalRev     = bills.reduce((s, b) => s + (parseFloat(b.totalAmount) || 0), 0);  // FIX: was b.total

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── Topbar ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '0 32px', height: 64,
        position: 'sticky', top: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg,#0b2545,#1e40af)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(30,64,175,.3)' }}>
            <ReceiptText size={17} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>Billing & Finance</span>
            <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 8, fontWeight: 500 }}>{bills.length} invoice{bills.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#cbd5e1' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient, doctor…"
              style={{ ...inputSt, paddingLeft: 34, width: 230 }} onFocus={focusBlue} onBlur={blurReset} />
          </div>
          <button onClick={() => { setForm(emptyForm); setShowForm(true); }} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px',
            background: 'linear-gradient(135deg,#0b2545,#1e40af)', color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(30,64,175,.35)', whiteSpace: 'nowrap',
            transition: 'transform .15s, box-shadow .15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(30,64,175,.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(30,64,175,.35)'; }}
          >
            <Plus size={15} /> New Invoice
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '28px 32px' }}>

        {/* ── Explainer strip ── */}
        <div style={{
          background: 'linear-gradient(135deg,#0b2545,#1e3a5f)', borderRadius: 16,
          padding: '18px 24px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 14, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160,
            borderRadius: '50%', background: 'rgba(59,130,246,0.1)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#fff', margin: '0 0 5px' }}>💡 What is calculated here?</p>
            <p style={{ fontSize: 12.5, color: 'rgba(180,210,240,0.65)', margin: 0, maxWidth: 560 }}>
              Each invoice records <strong style={{ color: 'rgba(200,225,245,0.9)' }}>services rendered</strong> (consultation, tests, procedures, medicines) →{' '}
              <strong style={{ color: 'rgba(200,225,245,0.9)' }}>subtotal</strong> → minus{' '}
              <strong style={{ color: 'rgba(200,225,245,0.9)' }}>discount</strong> →{' '}
              <strong style={{ color: '#60a5fa' }}>final payable amount</strong>. Mark as Paid once settled.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', position: 'relative' }}>
            {['🩺 Consultation', '🔬 Lab Tests', '⚕️ Procedures', '💊 Medicines'].map(t => (
              <span key={t} style={{ fontSize: 12, fontWeight: 600, color: 'rgba(200,220,245,0.8)',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8, padding: '5px 12px' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          <StatCard icon={ReceiptText} label="Total Invoices" value={bills.length}        color="#1d4ed8" bg="#dbeafe" />
          {/* FIX: use totalAmount for paid revenue sum */}
          <StatCard icon={CheckCircle} label="Paid"           value={paidBills.length}    color="#15803d" bg="#dcfce7"
            sub={formatINR(paidBills.reduce((s, b) => s + (b.totalAmount || 0), 0)) + ' collected'} />
          <StatCard icon={Clock}       label="Pending"        value={pendingBills.length}  color="#b45309" bg="#fef3c7" sub="Awaiting payment" />
          <StatCard icon={TrendingUp}  label="Total Revenue"  value={formatINR(totalRev)}  color="#0b2545" bg="#e0e7ff" />
        </div>

        {/* ── Table ── */}
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #f1f5f9',
          boxShadow: '0 1px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #f8fafc',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Invoice Registry</span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{bills.length} records</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  {['Patient', 'Doctor', 'Date', 'Items', 'Subtotal', 'Discount', 'Total', 'Status', ''].map((h, i) => (
                    <th key={i} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 10.5, fontWeight: 700,
                      letterSpacing: '0.07em', textTransform: 'uppercase', color: '#94a3b8',
                      borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr><td colSpan={9} style={{ padding: '60px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: '#eff6ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ReceiptText size={22} color="#93c5fd" />
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#334155', margin: 0 }}>No invoices yet</p>
                      <p style={{ fontSize: 12.5, color: '#94a3b8', margin: 0 }}>Click "New Invoice" to generate the first bill</p>
                    </div>
                  </td></tr>
                ) : bills.map((b, idx) => (
                  <tr key={b.id}
                    style={{ borderBottom: idx < bills.length - 1 ? '1px solid #f8fafc' : 'none', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafffe'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>

                    {/* FIX: was b.patientName — now reads from b.patient object */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{getPatientName(b)}</div>
                      <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>ID: {b.patient?.id || '—'}</div>
                    </td>

                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#475569', fontWeight: 500 }}>{b.doctorName || '—'}</td>

                    {/* FIX: was b.date — backend stores createdAt */}
                    <td style={{ padding: '14px 20px', fontSize: 12.5, color: '#64748b', whiteSpace: 'nowrap' }}>{formatDate(b.createdAt)}</td>

                    {/* FIX: was b.services — backend field is items */}
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#1d4ed8', background: '#eff6ff', borderRadius: 6, padding: '3px 8px' }}>
                        {b.items?.length ?? 0} item{(b.items?.length ?? 0) !== 1 ? 's' : ''}
                      </span>
                    </td>

                    {/* FIX: was b.subtotal — calculate from items */}
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#475569' }}>{formatINR(getSubtotal(b.items))}</td>

                    {/* FIX: was b.discount — backend field is discountAmount */}
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#dc2626' }}>
                      {b.discountAmount ? `− ${formatINR(b.discountAmount)}` : '—'}
                    </td>

                    {/* FIX: was b.total — backend field is totalAmount */}
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{formatINR(b.totalAmount)}</span>
                    </td>

                    {/* FIX: was b.status — backend field is paymentStatus */}
                    <td style={{ padding: '14px 20px' }}><StatusPill status={b.paymentStatus} /></td>

                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[
                          { icon: Eye, onClick: () => setViewBill(b), hover: { bg: '#eff6ff', color: '#1d4ed8' } },
                          // FIX: was b.status — backend field is paymentStatus
                          ...(b.paymentStatus !== 'PAID' ? [{ icon: CheckCircle, onClick: () => handleMarkPaid(b.id), hover: { bg: '#f0fdf4', color: '#15803d' } }] : []),
                          { icon: Trash2, onClick: () => setDelConfirm(b), hover: { bg: '#fef2f2', color: '#ef4444' } },
                        ].map(({ icon: Ic, onClick, hover }, i) => (
                          <button key={i} onClick={onClick} style={{ padding: 6, borderRadius: 8, background: 'none',
                            border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', transition: 'all .15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = hover.bg; e.currentTarget.style.color = hover.color; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}>
                            <Ic size={15} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Create Invoice Modal ── */}
      {showForm && (
        <div onClick={e => e.target === e.currentTarget && setShowForm(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.55)', backdropFilter: 'blur(6px)',
            zIndex: 1100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '32px 16px', overflowY: 'auto' }}>
          <div style={{ background: '#fff', borderRadius: 22, width: '100%', maxWidth: 640,
            boxShadow: '0 24px 60px rgba(0,0,0,.2)', margin: 'auto', overflow: 'hidden' }}>

            <div style={{ padding: '20px 26px', borderBottom: '1px solid #f1f5f9',
              background: 'linear-gradient(135deg,#0b2545,#1e3a5f)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ReceiptText size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>New Invoice</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(180,210,240,0.55)', marginTop: 1 }}>Fill in billing details below</div>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} style={{ padding: 8, borderRadius: 10,
                background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
                display: 'flex', color: 'rgba(255,255,255,0.7)' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: 26 }}>
              <SLabel>Patient & Doctor</SLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
                {[
                  { label: 'Patient Name', key: 'patientName', type: 'text', ph: 'Full name' },
                  { label: 'Patient ID',   key: 'patientId',   type: 'text', ph: 'PT-XXXX' },
                  { label: 'Doctor Name',  key: 'doctorName',  type: 'text', ph: 'Dr. Name' },
                  { label: 'Invoice Date', key: 'date',        type: 'date', ph: '' },
                ].map(({ label, key, type, ph }) => (
                  <Field key={key} label={label}>
                    <input type={type} required value={form[key]} placeholder={ph}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={inputSt} onFocus={focusBlue} onBlur={blurReset} />
                  </Field>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <SLabel>Services / Items</SLabel>
                <button type="button" onClick={addService} style={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8',
                  background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  + Add Row
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {form.services.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input placeholder="e.g. Consultation, CBC Test, X-Ray…" value={s.description}
                      onChange={e => updateService(i, 'description', e.target.value)}
                      style={{ ...inputSt, flex: 1 }} onFocus={focusBlue} onBlur={blurReset} />
                    <input placeholder="₹ Amount" type="number" value={s.amount}
                      onChange={e => updateService(i, 'amount', e.target.value)}
                      style={{ ...inputSt, width: 110 }} onFocus={focusBlue} onBlur={blurReset} />
                    {form.services.length > 1 && (
                      <button type="button" onClick={() => removeService(i)} style={{ width: 32, height: 32, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: '#fef2f2', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                        <X size={13} color="#ef4444" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                <Field label="Discount (₹)">
                  <input type="number" value={form.discount}
                    onChange={e => setForm({ ...form, discount: e.target.value })}
                    style={inputSt} onFocus={focusBlue} onBlur={blurReset} />
                </Field>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  background: 'linear-gradient(135deg,#0b2545,#1e3a5f)', borderRadius: 10, padding: '10px 16px' }}>
                  <div style={{ fontSize: 11.5, color: 'rgba(180,210,240,0.5)', marginBottom: 4 }}>
                    Subtotal {formatINR(subtotal)} {form.discount > 0 && `− ${formatINR(form.discount)}`}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#60a5fa', letterSpacing: '-0.5px' }}>{formatINR(total)}</div>
                  <div style={{ fontSize: 10.5, color: 'rgba(180,210,240,0.4)', marginTop: 2 }}>Total payable</div>
                </div>
              </div>

              <Field label="Notes (optional)">
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
                  placeholder="Any special instructions…"
                  style={{ ...inputSt, resize: 'none', lineHeight: 1.5 }} onFocus={focusBlue} onBlur={blurReset} />
              </Field>

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: 12, borderRadius: 12,
                  border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg,#0b2545,#1e40af)', color: '#fff',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(30,64,175,.35)' }}>
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Bill Modal ── */}
      {viewBill && (
        <div onClick={e => e.target === e.currentTarget && setViewBill(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.55)', backdropFilter: 'blur(6px)',
            zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 22, width: '100%', maxWidth: 480,
            boxShadow: '0 24px 60px rgba(0,0,0,.2)', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg,#0b2545,#1e3a5f)', padding: '22px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ReceiptText size={17} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Invoice</div>
                    <div style={{ fontSize: 11, color: 'rgba(180,210,240,0.5)' }}>Ratnadeep Hospital</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => window.print()} style={{ padding: '6px 12px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                    color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'inherit' }}>
                    <Printer size={13} /> Print
                  </button>
                  <button onClick={() => setViewBill(null)} style={{ padding: 7, borderRadius: 8,
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                    cursor: 'pointer', display: 'flex', color: 'rgba(255,255,255,0.7)' }}>
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  // FIX: was viewBill.patientName — now reads from viewBill.patient object
                  { label: 'Patient', value: getPatientName(viewBill) },
                  { label: 'Doctor',  value: viewBill.doctorName || '—' },
                  // FIX: was viewBill.date — backend stores createdAt
                  { label: 'Date',    value: formatDate(viewBill.createdAt) },
                  // FIX: was viewBill.status — backend field is paymentStatus
                  { label: 'Status',  value: <StatusPill status={viewBill.paymentStatus} /> },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(180,210,240,0.4)',
                      textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '18px 26px' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Services</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* FIX: was viewBill.services — backend field is items; s.description→s.itemName, s.amount→s.totalPrice */}
                {(viewBill.items || []).map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '9px 12px', background: '#f8fafc', borderRadius: 9 }}>
                    <span style={{ fontSize: 13, color: '#334155' }}>{s.itemName || '—'}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{formatINR(s.totalPrice)}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, borderTop: '1px solid #f1f5f9', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* FIX: was viewBill.subtotal — calculate from items */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b' }}>
                  <span>Subtotal</span><span>{formatINR(getSubtotal(viewBill.items))}</span>
                </div>
                {/* FIX: was viewBill.discount — backend field is discountAmount */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#dc2626' }}>
                  <span>Discount</span><span>− {formatINR(viewBill.discountAmount || 0)}</span>
                </div>
                {/* FIX: was viewBill.total — backend field is totalAmount */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, color: '#0f172a',
                  paddingTop: 8, borderTop: '1px solid #f1f5f9', marginTop: 2 }}>
                  <span>Total Payable</span><span>{formatINR(viewBill.totalAmount)}</span>
                </div>
              </div>
              {viewBill.notes && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: '#f8fafc', borderRadius: 9, border: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notes </span>
                  <span style={{ fontSize: 12.5, color: '#475569' }}>{viewBill.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {delConfirm && (
        <div onClick={e => e.target === e.currentTarget && setDelConfirm(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.55)', backdropFilter: 'blur(6px)',
            zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 22, width: '100%', maxWidth: 360,
            padding: 32, textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,.2)' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fef2f2',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Trash2 size={22} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Delete Invoice?</h3>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 22px', lineHeight: 1.6 }}>
              Bill for <strong style={{ color: '#0f172a' }}>{getPatientName(delConfirm)}</strong> ({formatDate(delConfirm.createdAt)}) will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDelConfirm(null)} style={{ flex: 1, padding: 11, borderRadius: 12,
                border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(delConfirm.id)} style={{ flex: 1, padding: 11, borderRadius: 12,
                border: 'none', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(239,68,68,.35)' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`* { box-sizing:border-box; margin:0; padding:0; } ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:rgba(15,23,42,.1);border-radius:4px}`}</style>
    </div>
  );
}