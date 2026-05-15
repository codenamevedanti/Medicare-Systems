import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  Plus, Search, Edit, Trash2, Stethoscope, X,
  User, Phone, Mail, Award, Clock, Calendar,
  DollarSign, ChevronRight, Filter, MoreVertical,
  Activity, Users, TrendingUp, Star
} from 'lucide-react';

const SPECIALIZATIONS = [
  'Cardiology','Neurology','Orthopedics','Pediatrics',
  'Dermatology','Gynecology','General Medicine','ENT','Ophthalmology','Psychiatry'
];

const SPEC_META = {
  Cardiology:        { color: '#e11d48', bg: '#fff1f2', label: '❤️' },
  Neurology:         { color: '#7c3aed', bg: '#f5f3ff', label: '🧠' },
  Orthopedics:       { color: '#d97706', bg: '#fffbeb', label: '🦴' },
  Pediatrics:        { color: '#db2777', bg: '#fdf2f8', label: '🧒' },
  Dermatology:       { color: '#ea580c', bg: '#fff7ed', label: '🔬' },
  Gynecology:        { color: '#9333ea', bg: '#faf5ff', label: '⚕️' },
  'General Medicine':{ color: '#0d9488', bg: '#f0fdfa', label: '🩺' },
  ENT:               { color: '#0891b2', bg: '#ecfeff', label: '👂' },
  Ophthalmology:     { color: '#4f46e5', bg: '#eef2ff', label: '👁️' },
  Psychiatry:        { color: '#059669', bg: '#ecfdf5', label: '🧘' },
};

const AVATAR_PALETTES = [
  ['#134e4a','#115e59'],['#1e3a5f','#1e40af'],['#3b0764','#6b21a8'],
  ['#450a0a','#991b1b'],['#064e3b','#065f46'],['#1c1917','#44403c'],
];

const emptyForm = {
  firstName:'',lastName:'',specialization:'',phone:'',email:'',
  qualification:'',experience:'',availableDays:'',consultationFee:''
};

/* ── Reusable Input ──────────────────────────────────────────── */
const Field = ({ label, icon: Icon, as = 'input', children, ...props }) => (
  <div>
    <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'0.08em',
      textTransform:'uppercase', color:'#94a3b8', marginBottom:'6px' }}>{label}</label>
    <div style={{ position:'relative' }}>
      {Icon && (
        <Icon style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)',
          width:'15px', height:'15px', color:'#cbd5e1', pointerEvents:'none' }} />
      )}
      {as === 'select' ? (
        <select {...props} style={{
          width:'100%', padding:'11px 14px 11px 38px',
          background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRadius:'10px',
          fontSize:'13px', color:'#334155', outline:'none', appearance:'none', cursor:'pointer',
          transition:'border-color .2s, box-shadow .2s',
          ...(props.style ?? {})
        }}
          onFocus={e => { e.target.style.borderColor='#22c55e'; e.target.style.boxShadow='0 0 0 3px rgba(34,197,94,.12)'; e.target.style.background='#fff'; }}
          onBlur={e => { e.target.style.borderColor='#e2e8f0'; e.target.style.boxShadow='none'; e.target.style.background='#f8fafc'; }}
        >{children}</select>
      ) : (
        <input {...props} style={{
          width:'100%', padding:`11px 14px 11px ${Icon ? '38px' : '14px'}`,
          background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRadius:'10px',
          fontSize:'13px', color:'#334155', outline:'none', boxSizing:'border-box',
          transition:'border-color .2s, box-shadow .2s',
          ...(props.style ?? {})
        }}
          onFocus={e => { e.target.style.borderColor='#22c55e'; e.target.style.boxShadow='0 0 0 3px rgba(34,197,94,.12)'; e.target.style.background='#fff'; }}
          onBlur={e => { e.target.style.borderColor='#e2e8f0'; e.target.style.boxShadow='none'; e.target.style.background='#f8fafc'; }}
        />
      )}
    </div>
  </div>
);

/* ── Avatar ──────────────────────────────────────────────────── */
const Avatar = ({ doctor, size = 38 }) => {
  const idx = (doctor.firstName?.charCodeAt(0) ?? 0) % AVATAR_PALETTES.length;
  const [g1, g2] = AVATAR_PALETTES[idx];
  const initials = `${doctor.firstName?.[0]??''}${doctor.lastName?.[0]??''}`.toUpperCase();
  return (
    <div style={{
      width:size, height:size, borderRadius: size > 40 ? '14px' : '10px', flexShrink:0,
      background:`linear-gradient(135deg, ${g1}, ${g2})`,
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'#fff', fontSize: size > 40 ? '16px' : '12px', fontWeight:700, letterSpacing:'0.5px',
      boxShadow:`0 4px 12px ${g2}55`
    }}>{initials}</div>
  );
};

/* ── Spec Badge ──────────────────────────────────────────────── */
const SpecBadge = ({ spec }) => {
  const m = SPEC_META[spec] ?? { color:'#64748b', bg:'#f1f5f9' };
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:'4px',
      padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:600,
      color: m.color, background: m.bg, whiteSpace:'nowrap',
      border:`1px solid ${m.color}22`
    }}>{spec}</span>
  );
};

/* ── Stat Card ───────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div style={{
    background:'#fff', borderRadius:'16px', padding:'20px 24px',
    border:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:'16px',
    boxShadow:'0 1px 4px rgba(0,0,0,.04)'
  }}>
    <div style={{ width:44, height:44, borderRadius:'12px', background:bg,
      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <Icon style={{ width:20, height:20, color }} />
    </div>
    <div>
      <div style={{ fontSize:'22px', fontWeight:800, color:'#0f172a', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:'12px', color:'#94a3b8', fontWeight:500, marginTop:'3px' }}>{label}</div>
    </div>
  </div>
);

/* ── Main Component ──────────────────────────────────────────── */
export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [filterSpec, setFilterSpec] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const fetchDoctors = () => {
    api.get(search ? `/doctors/search?q=${search}` : '/doctors').then(r => setDoctors(r.data));
  };
  useEffect(() => { fetchDoctors(); }, [search]);

  const filtered = filterSpec ? doctors.filter(d => d.specialization === filterSpec) : doctors;

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (editDoctor) {
        await api.put(`/doctors/${editDoctor.id}`, form);
      } else {
        await api.post('/doctors', form);
      }
      setShowForm(false);
      setEditDoctor(null);
      setForm(emptyForm);
      await fetchDoctors(); 
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save doctor: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (d) => {
    setEditDoctor(d);
    setForm({
      firstName: d.firstName ?? '',
      lastName: d.lastName ?? '',
      specialization: d.specialization ?? '',
      phone: d.phone ?? '',
      email: d.email ?? '',
      qualification: d.qualification ?? '',
      experience: d.experience ?? '',
      availableDays: d.availableDays ?? '',
      consultationFee: d.consultationFee ?? '' 
    });
    setShowForm(true);
  };
  const handleDelete = async (id) => {
    await api.delete(`/doctors/${id}`); setDeleteConfirm(null); fetchDoctors();
  };

  const openAdd = () => { setEditDoctor(null); setForm(emptyForm); setShowForm(true); };
  const specCounts = doctors.reduce((acc, d) => { acc[d.specialization] = (acc[d.specialization]||0)+1; return acc; }, {});
  const topSpec = Object.entries(specCounts).sort((a,b) => b[1]-a[1])[0]?.[0] ?? '—';
  const avgFee = doctors.length ? Math.round(doctors.reduce((s,d) => s + (+d.consultationFee||0), 0) / doctors.length) : 0;

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:"'DM Sans', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── Top bar ── */}
      <div style={{ background:'#fff', borderBottom:'1px solid #f1f5f9', padding:'0 32px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          height:'64px', maxWidth:'1400px', margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ width:36, height:36, borderRadius:'10px',
              background:'linear-gradient(135deg,#16a34a,#059669)',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 4px 12px rgba(22,163,74,.3)' }}>
              <Stethoscope style={{ width:18, height:18, color:'#fff' }} />
            </div>
            <div>
              <span style={{ fontSize:'16px', fontWeight:800, color:'#0f172a', letterSpacing:'-0.3px' }}>Doctors</span>
              <span style={{ fontSize:'12px', color:'#94a3b8', marginLeft:'8px', fontWeight:500 }}>
                {doctors.length} physicians
              </span>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            {/* Search */}
            <div style={{ position:'relative' }}>
              <Search style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)',
                width:'15px', height:'15px', color:'#cbd5e1' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search physicians…"
                style={{ padding:'9px 14px 9px 36px', border:'1.5px solid #e2e8f0', borderRadius:'10px',
                  fontSize:'13px', color:'#334155', outline:'none', width:'220px', background:'#f8fafc',
                  transition:'border-color .2s' }}
                onFocus={e => e.target.style.borderColor='#22c55e'}
                onBlur={e => e.target.style.borderColor='#e2e8f0'}
              />
            </div>

            {/* Spec filter */}
            <div style={{ position:'relative' }}>
              <Filter style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)',
                width:'14px', height:'14px', color:'#cbd5e1' }} />
              <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)}
                style={{ padding:'9px 14px 9px 32px', border:'1.5px solid #e2e8f0', borderRadius:'10px',
                  fontSize:'13px', color: filterSpec ? '#16a34a' : '#94a3b8', outline:'none',
                  background:'#f8fafc', appearance:'none', cursor:'pointer', minWidth:'160px',
                  transition:'border-color .2s' }}
                onFocus={e => e.target.style.borderColor='#22c55e'}
                onBlur={e => e.target.style.borderColor='#e2e8f0'}
              >
                <option value="">All Specializations</option>
                {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <button onClick={openAdd} style={{
              display:'flex', alignItems:'center', gap:'7px', padding:'9px 18px',
              background:'linear-gradient(135deg,#16a34a,#059669)', color:'#fff',
              border:'none', borderRadius:'10px', fontSize:'13px', fontWeight:700,
              cursor:'pointer', boxShadow:'0 4px 14px rgba(22,163,74,.35)',
              transition:'transform .15s, box-shadow .15s', whiteSpace:'nowrap'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(22,163,74,.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 14px rgba(22,163,74,.35)'; }}
            >
              <Plus style={{ width:15, height:15 }} /> Add Doctor
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'28px 32px' }}>

        {/* ── Stats Row ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px' }}>
            <StatCard key="total" icon={Users} label="Total Physicians" value={doctors.length} color="#16a34a" bg="#f0fdf4" />
            <StatCard key="specs" icon={Activity} label="Specializations" value={new Set(doctors.map(d => d.specialization).filter(Boolean)).size} color="#7c3aed" bg="#f5f3ff" />
            <StatCard key="top" icon={Star} label="Top Specialty" value={topSpec} color="#d97706" bg="#fffbeb" />
            <StatCard key="avg" icon={DollarSign} label="Avg. Consultation" value={avgFee ? `₹${avgFee}` : '—'} color="#0891b2" bg="#ecfeff" />
          </div>
        {/* ── Table Card ── */}
        <div style={{ background:'#fff', borderRadius:'18px', border:'1px solid #f1f5f9',
          boxShadow:'0 1px 6px rgba(0,0,0,.05)', overflow:'hidden' }}>

          {/* table header row */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'18px 24px', borderBottom:'1px solid #f8fafc' }}>
            <span style={{ fontSize:'14px', fontWeight:700, color:'#0f172a' }}>
              Physician Registry
              {filterSpec && (
                <span style={{ marginLeft:'10px', padding:'3px 10px', borderRadius:'20px',
                  background:'#f0fdf4', color:'#16a34a', fontSize:'12px', fontWeight:600, border:'1px solid #bbf7d0' }}>
                  {filterSpec} <button onClick={() => setFilterSpec('')}
                    style={{ background:'none', border:'none', cursor:'pointer', color:'#16a34a', marginLeft:'4px', padding:0, fontSize:'13px' }}>×</button>
                </span>
              )}
            </span>
            <span style={{ fontSize:'12px', color:'#94a3b8', fontWeight:500 }}>
              {filtered.length} of {doctors.length} results
            </span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              padding:'72px 24px', textAlign:'center' }}>
              <div style={{ width:64, height:64, borderRadius:'18px', background:'#f0fdf4',
                display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'16px' }}>
                <Stethoscope style={{ width:28, height:28, color:'#86efac' }} />
              </div>
              <p style={{ fontSize:'15px', fontWeight:700, color:'#334155', margin:'0 0 6px' }}>No physicians found</p>
              <p style={{ fontSize:'13px', color:'#94a3b8', margin:'0 0 20px' }}>Add your first doctor to get started</p>
              <button onClick={openAdd} style={{
                display:'flex', alignItems:'center', gap:'6px', padding:'9px 18px',
                background:'#f0fdf4', color:'#16a34a', border:'1.5px dashed #86efac',
                borderRadius:'10px', fontSize:'13px', fontWeight:600, cursor:'pointer'
              }}>
                <Plus style={{ width:14, height:14 }} /> Add Doctor
              </button>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'#fafafa' }}>
                    {['Physician','Specialization','Qualification','Experience','Contact','Fee',''].map((h, i) => (
                      <th key={i} style={{
                        padding:'11px 20px', textAlign:'left',
                        fontSize:'11px', fontWeight:700, letterSpacing:'0.07em',
                        textTransform:'uppercase', color:'#94a3b8',
                        borderBottom:'1px solid #f1f5f9', whiteSpace:'nowrap'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d, idx) => (
                    <tr key={d.id}
                      style={{ borderBottom: idx < filtered.length-1 ? '1px solid #f8fafc' : 'none',
                        transition:'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background='#fafffe'}
                      onMouseLeave={e => e.currentTarget.style.background=''}
                    >
                      {/* Physician */}
                      <td style={{ padding:'14px 20px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                          <Avatar doctor={d} />
                          <div>
                            <div style={{ fontSize:'13px', fontWeight:700, color:'#0f172a' }}>
                              Dr. {d.firstName} {d.lastName}
                            </div>
                            <div style={{ fontSize:'12px', color:'#94a3b8', marginTop:'2px' }}>{d.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Spec */}
                      <td style={{ padding:'14px 20px' }}><SpecBadge spec={d.specialization} /></td>

                      {/* Qualification */}
                      <td style={{ padding:'14px 20px', fontSize:'13px', color:'#475569', fontWeight:500 }}>
                        {d.qualification}
                      </td>

                      {/* Experience */}
                      <td style={{ padding:'14px 20px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                          <div style={{ display:'flex', gap:'2px' }}>
                            {Array.from({length:5}).map((_,i) => {
                              const exp = +d.experience || 0;
                              const filled = exp === 0 ? 0 : Math.max(1, Math.round((exp / 30) * 5));
                              return (
                                <div key={i} style={{ width:4, height:16, borderRadius:2,
                                  background: i < filled ? '#16a34a' : '#e2e8f0' }} />
                              );
                            })}
                          </div>
                          <span style={{ fontSize:'13px', color:'#334155', fontWeight:600 }}>
                            {d.experience || '—'} <span style={{ color:'#94a3b8', fontWeight:400, fontSize:'12px' }}>{d.experience ? 'yrs' : ''}</span>
                          </span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td style={{ padding:'14px 20px', fontSize:'13px', color:'#475569' }}>
                        {d.phone}
                      </td>

                      {/* Fee */}
                      <td style={{ padding:'14px 20px' }}>
                        <span style={{ fontSize:'14px', fontWeight:800, color:'#0f172a' }}>₹{d.consultationFee}</span>
                      </td>

                      {/* Actions — kebab */}
                      <td style={{ padding:'14px 16px', position:'relative' }}>
                        <button onClick={() => setOpenMenu(openMenu === d._id ? null : d.id)}
                          style={{ padding:'6px', borderRadius:'8px', background:'none', border:'none',
                            cursor:'pointer', color:'#94a3b8', display:'flex', alignItems:'center',
                            transition:'background .15s, color .15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background='#f1f5f9'; e.currentTarget.style.color='#334155'; }}
                          onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='#94a3b8'; }}
                        >
                          <MoreVertical style={{ width:16, height:16 }} />
                        </button>
                        {openMenu === d.id && (
                          <div style={{
                            position:'absolute', right:'12px', top:'44px', zIndex:100,
                            background:'#fff', borderRadius:'12px', boxShadow:'0 8px 30px rgba(0,0,0,.12)',
                            border:'1px solid #f1f5f9', padding:'6px', minWidth:'140px'
                          }}
                            onMouseLeave={() => setOpenMenu(null)}
                          >
                            <button onClick={() => handleEdit(d)} style={{
                              display:'flex', alignItems:'center', gap:'8px', width:'100%',
                              padding:'9px 12px', borderRadius:'8px', background:'none', border:'none',
                              fontSize:'13px', color:'#334155', fontWeight:500, cursor:'pointer',
                              transition:'background .12s'
                            }}
                              onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                              onMouseLeave={e => e.currentTarget.style.background='none'}
                            >
                              <Edit style={{ width:14, height:14, color:'#64748b' }} /> Edit Doctor
                            </button>
                            <button onClick={() => { setDeleteConfirm(d); setOpenMenu(null); }} style={{
                              display:'flex', alignItems:'center', gap:'8px', width:'100%',
                              padding:'9px 12px', borderRadius:'8px', background:'none', border:'none',
                              fontSize:'13px', color:'#ef4444', fontWeight:500, cursor:'pointer',
                              transition:'background .12s'
                            }}
                              onMouseEnter={e => e.currentTarget.style.background='#fef2f2'}
                              onMouseLeave={e => e.currentTarget.style.background='none'}
                            >
                              <Trash2 style={{ width:14, height:14 }} /> Remove
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}
          style={{ position:'fixed', inset:0, background:'rgba(15,23,42,.55)',
            backdropFilter:'blur(6px)', zIndex:1100,
            display:'flex', alignItems:'flex-start', justifyContent:'center',
            padding:'32px 16px', overflowY:'auto' }}>
          <div style={{ background:'#fff', borderRadius:'22px', width:'100%', maxWidth:'620px',
            boxShadow:'0 24px 60px rgba(0,0,0,.2)', margin:'auto', overflow:'hidden' }}>

            {/* Modal header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'22px 28px', borderBottom:'1px solid #f1f5f9', background:'#fafffe' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:40, height:40, borderRadius:'12px',
                  background:'linear-gradient(135deg,#16a34a,#059669)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:'0 4px 14px rgba(22,163,74,.3)' }}>
                  <Stethoscope style={{ width:18, height:18, color:'#fff' }} />
                </div>
                <div>
                  <div style={{ fontSize:'15px', fontWeight:800, color:'#0f172a' }}>
                    {editDoctor ? 'Edit Physician' : 'Add New Physician'}
                  </div>
                  <div style={{ fontSize:'12px', color:'#94a3b8', marginTop:'2px' }}>
                    {editDoctor ? 'Update physician details' : 'Register a new physician in the system'}
                  </div>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} style={{
                padding:'8px', borderRadius:'10px', background:'none', border:'none',
                cursor:'pointer', color:'#94a3b8', display:'flex', alignItems:'center',
                transition:'background .15s'
              }}
                onMouseEnter={e => e.currentTarget.style.background='#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background='none'}
              ><X style={{ width:18, height:18 }} /></button>
            </div>

            <div style={{ padding:'28px' }}>
              {/* Section label */}
              <SectionLabel>Personal Information</SectionLabel>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'24px' }}>
                <Field label="First Name" icon={User} type="text" required placeholder="John"
                  value={form.firstName} onChange={e => setForm({...form, firstName:e.target.value})} />
                <Field label="Last Name" icon={User} type="text" required placeholder="Smith"
                  value={form.lastName} onChange={e => setForm({...form, lastName:e.target.value})} />
                <Field label="Phone" icon={Phone} type="tel" required placeholder="+91 99999 00000"
                  value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
                <Field label="Email" icon={Mail} type="email" required placeholder="doctor@hospital.com"
                  value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
              </div>

              <SectionLabel>Professional Details</SectionLabel>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'24px' }}>
                <Field label="Qualification" icon={Award} type="text" required placeholder="MBBS, MD"
                  value={form.qualification} onChange={e => setForm({...form, qualification:e.target.value})} />
                <Field label="Experience (yrs)" icon={Clock} type="text" required placeholder="5"
                  value={form.experience} onChange={e => setForm({...form, experience:e.target.value})} />
                <Field label="Available Days" icon={Calendar} type="text" required placeholder="Mon, Wed, Fri"
                  value={form.availableDays} onChange={e => setForm({...form, availableDays:e.target.value})} />
                <Field label="Consultation Fee (₹)" icon={DollarSign} type="text" required placeholder="500" value={form.consultationFee} onChange={e => setForm({...form, consultationFee:e.target.value})} />
              </div>

              <div style={{ marginBottom:'28px' }}>
                <Field as="select" label="Specialization" icon={Activity} required
                  value={form.specialization} onChange={e => setForm({...form, specialization:e.target.value})}>
                  <option value="">Select specialization</option>
                  {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </Field>
              </div>

              <div style={{ display:'flex', gap:'12px' }}>
                <button onClick={() => setShowForm(false)} style={{
                  flex:1, padding:'12px', borderRadius:'12px',
                  border:'1.5px solid #e2e8f0', background:'#fff',
                  fontSize:'13px', fontWeight:600, color:'#64748b', cursor:'pointer',
                  transition:'background .15s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background='#fff'}
                >Cancel</button>
                <button onClick={handleSubmit} disabled={saving} style={{
                  flex:1, padding:'12px', borderRadius:'12px', border:'none',
                  background: saving ? '#86efac' : 'linear-gradient(135deg,#16a34a,#059669)',
                  color:'#fff', fontSize:'13px', fontWeight:700, cursor: saving ? 'default' : 'pointer',
                  boxShadow:'0 4px 14px rgba(22,163,74,.35)', transition:'transform .15s, box-shadow .15s'
                }}
                  onMouseEnter={e => { if (!saving) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(22,163,74,.45)'; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 14px rgba(22,163,74,.35)'; }}
                >
                  {saving ? 'Saving…' : editDoctor ? 'Update Physician' : 'Register Physician'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (
        <div onClick={e => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}
          style={{ position:'fixed', inset:0, background:'rgba(15,23,42,.55)',
            backdropFilter:'blur(6px)', zIndex:1100,
            display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
          <div style={{ background:'#fff', borderRadius:'22px', width:'100%', maxWidth:'380px',
            padding:'32px', textAlign:'center', boxShadow:'0 24px 60px rgba(0,0,0,.2)' }}>
            <div style={{ width:56, height:56, borderRadius:'16px', background:'#fef2f2',
              display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <Trash2 style={{ width:24, height:24, color:'#ef4444' }} />
            </div>
            <h3 style={{ fontSize:'17px', fontWeight:800, color:'#0f172a', margin:'0 0 8px' }}>Remove Physician?</h3>
            <p style={{ fontSize:'13px', color:'#64748b', margin:'0 0 24px', lineHeight:1.6 }}>
              You're about to remove{' '}
              <strong style={{ color:'#0f172a' }}>Dr. {deleteConfirm.firstName} {deleteConfirm.lastName}</strong>{' '}
              from the registry. This action cannot be undone.
            </p>
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{
                flex:1, padding:'11px', borderRadius:'12px',
                border:'1.5px solid #e2e8f0', background:'#fff',
                fontSize:'13px', fontWeight:600, color:'#64748b', cursor:'pointer'
              }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} style={{
                flex:1, padding:'11px', borderRadius:'12px', border:'none',
                background:'linear-gradient(135deg,#ef4444,#dc2626)',
                color:'#fff', fontSize:'13px', fontWeight:700, cursor:'pointer',
                boxShadow:'0 4px 14px rgba(239,68,68,.35)'
              }}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const SectionLabel = ({ children }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
    <span style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.08em',
      textTransform:'uppercase', color:'#94a3b8' }}>{children}</span>
    <div style={{ flex:1, height:'1px', background:'#f1f5f9' }} />
  </div>
);