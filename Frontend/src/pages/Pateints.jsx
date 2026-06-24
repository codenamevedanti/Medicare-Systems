import { useState, useEffect } from 'react';
import {
  Users, Search, Plus, X, User,
  Download, MoreHorizontal, Edit2, Trash2,
  AlertCircle, CheckCircle, Activity,
} from 'lucide-react';

const F = "'Inter', -apple-system, sans-serif";

const C = {
  bg: '#F0F4FA',
  white: '#FFFFFF',
  surface2: '#F7F9FC',
  border: 'rgba(15,23,42,0.08)',
  borderMed: 'rgba(15,23,42,0.13)',
  navy: '#0F172A',
  blue: '#3B82F6',
  blueSoft: '#EFF6FF',
  t1: '#0F172A',
  t2: '#475569',
  t3: '#94A3B8',
};

const STATUS_CFG = {
  Active:     { bg: '#F0FDF4', color: '#15803D', dot: '#22C55E' },
  Admitted:   { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  Pending:    { bg: '#FFFBEB', color: '#B45309', dot: '#F59E0B' },
  Critical:   { bg: '#FEF2F2', color: '#B91C1C', dot: '#EF4444' },
  Discharged: { bg: '#F8FAFC', color: '#475569', dot: '#94A3B8' },
};

const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const GENDERS      = ['Male','Female','Other'];
const DEPARTMENTS  = ['Cardiology','Neurology','Orthopedics','General','Gynecology','Pediatrics','Oncology','Dermatology'];

const AV_PAL = [
  { bg: '#DBEAFE', color: '#1D4ED8' },
  { bg: '#D1FAE5', color: '#065F46' },
  { bg: '#EDE9FE', color: '#5B21B6' },
  { bg: '#FCE7F3', color: '#9D174D' },
  { bg: '#FEF3C7', color: '#92400E' },
  { bg: '#CCFBF1', color: '#0F766E' },
];

const EMPTY = {
  firstName:'', lastName:'', phone:'', email:'',
  dob:'', gender:'', bloodGroup:'', address:'',
  department:'', status:'Active', notes:'',
};

function Avatar({ name, idx }) {
  const p = AV_PAL[(idx ?? 0) % AV_PAL.length];
  const init = name ? name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : '??';
  return (
    <div style={{ width:36, height:36, borderRadius:'50%', background:p.bg, color:p.color,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:12.5, fontWeight:700, flexShrink:0 }}>
      {init}
    </div>
  );
}

function StatusPill({ status }) {
  const s = STATUS_CFG[status] || STATUS_CFG.Active;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px',
      borderRadius:100, fontSize:11.5, fontWeight:600, background:s.bg, color:s.color }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:s.dot }} />
      {status}
    </span>
  );
}

function Field({ label, children, required, error }) {
  return (
    <div style={{ marginBottom:14, flex:1 }}>
      <label style={{ display:'block', fontSize:11, fontWeight:600, color:C.t3,
        marginBottom:5, textTransform:'uppercase', letterSpacing:'0.6px' }}>
        {label}{required && <span style={{ color:'#EF4444', marginLeft:3 }}>*</span>}
      </label>
      {children}
      {error && <div style={{ fontSize:11, color:'#DC2626', marginTop:4 }}>{error}</div>}
    </div>
  );
}

const fi = (err) => ({
  width:'100%', height:40, border:`1.5px solid ${err ? '#EF4444' : C.border}`,
  borderRadius:8, padding:'0 12px', fontSize:13.5, color:C.t1, background:C.white,
  fontFamily:F, appearance:'none', WebkitAppearance:'none', outline:'none',
  transition:'border-color 0.15s, box-shadow 0.15s',
});

export default function Patients() {
  const [patients,     setPatients]     = useState([]);
  const [search,       setSearch]       = useState('');
  const [showForm,     setShowForm]     = useState(false);
  const [form,         setForm]         = useState(EMPTY);
  const [formErrors,   setFormErrors]   = useState({});
  const [editingId,    setEditingId]    = useState(null);
  const [activeMenu,   setActiveMenu]   = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [submitting,   setSubmitting]   = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hms_patients');
    if (saved) setPatients(JSON.parse(saved));
  }, []);

  const persist = list => { setPatients(list); localStorage.setItem('hms_patients', JSON.stringify(list)); };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.phone.trim())     e.phone     = 'Required';
    if (!form.gender)           e.gender    = 'Required';
    setFormErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      if (editingId) {
        persist(patients.map(p => p.id === editingId ? { ...p, ...form } : p));
      } else {
        persist([{
          ...form,
          id: `PT-${String(patients.length + 1).padStart(4,'0')}`,
          registeredAt: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
          avIndex: patients.length % AV_PAL.length,
        }, ...patients]);
      }
      setForm(EMPTY); setEditingId(null); setShowForm(false); setSubmitting(false);
    }, 380);
  };

  const handleEdit = p => {
    setForm({ firstName:p.firstName, lastName:p.lastName, phone:p.phone, email:p.email,
      dob:p.dob, gender:p.gender, bloodGroup:p.bloodGroup, address:p.address,
      department:p.department, status:p.status, notes:p.notes||'' });
    setEditingId(p.id); setShowForm(true); setActiveMenu(null);
  };

  const handleDelete = id => { persist(patients.filter(p => p.id !== id)); setActiveMenu(null); };

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    const ok = !q || `${p.firstName} ${p.lastName} ${p.id} ${p.department}`.toLowerCase().includes(q);
    return ok && (filterStatus === 'All' || p.status === filterStatus);
  });

  const stats = {
    total:    patients.length,
    active:   patients.filter(p => p.status === 'Active').length,
    admitted: patients.filter(p => p.status === 'Admitted').length,
    critical: patients.filter(p => p.status === 'Critical').length,
  };

  const STAT_CARDS = [
    { label:'Total Patients', value:stats.total,    Icon:Users,        bg:'#DBEAFE', color:'#1D4ED8' },
    { label:'Active',         value:stats.active,   Icon:CheckCircle,  bg:'#D1FAE5', color:'#065F46' },
    { label:'Admitted',       value:stats.admitted, Icon:Activity,     bg:'#EDE9FE', color:'#5B21B6' },
    { label:'Critical',       value:stats.critical, Icon:AlertCircle,  bg:'#FEE2E2', color:'#991B1B' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:F }}>

      {/* Top Bar */}
      <div style={S.topbar}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:44, height:44, background:C.navy, borderRadius:12,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Users size={20} color="#fff" strokeWidth={1.8} />
          </div>
          <div>
            <h1 style={{ fontSize:20, fontWeight:700, color:C.t1, letterSpacing:'-0.4px' }}>Patients</h1>
            <p style={{ fontSize:12.5, color:C.t3, marginTop:1 }}>
              {patients.length} registered patient{patients.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button style={S.btnOutline}><Download size={14} /> Export</button>
          <button style={S.btnPrimary} onClick={() => { setForm(EMPTY); setEditingId(null); setShowForm(true); }}>
            <Plus size={15} /> Add Patient
          </button>
        </div>
      </div>

      <div style={{ padding:'24px 28px' }}>

        {/* Stat Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
          {STAT_CARDS.map(({ label, value, Icon, bg, color }) => (
            <div key={label} style={S.statCard}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:bg,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={18} color={color} strokeWidth={1.8} />
                </div>
                <span style={{ fontSize:28, fontWeight:700, color:C.t1, letterSpacing:'-1px', lineHeight:1 }}>
                  {value}
                </span>
              </div>
              <div style={{ fontSize:12, color:C.t3, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.5px' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18, flexWrap:'wrap' }}>
          <div style={S.searchWrap}>
            <Search size={15} color={C.t3} style={{ flexShrink:0 }} />
            <input placeholder="Search by name, ID, department..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex:1, border:'none', outline:'none', fontSize:13.5, color:C.t1, background:'transparent', fontFamily:F }} />
            {search && (
              <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:0 }}>
                <X size={14} color={C.t3} />
              </button>
            )}
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {['All','Active','Admitted','Pending','Critical','Discharged'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ ...S.chip, ...(filterStatus === s ? S.chipOn : {}) }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div style={S.empty}>
            <div style={{ width:60, height:60, borderRadius:'50%', background:C.surface2,
              display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
              <Users size={26} color={C.t3} strokeWidth={1.4} />
            </div>
            <h3 style={{ fontSize:16, fontWeight:700, color:C.t1, marginBottom:6 }}>
              {search || filterStatus !== 'All' ? 'No patients match' : 'No patients yet'}
            </h3>
            <p style={{ fontSize:13.5, color:C.t3, marginBottom:20 }}>
              {search || filterStatus !== 'All' ? 'Try adjusting filters.' : 'Register your first patient.'}
            </p>
            {!search && filterStatus === 'All' && (
              <button style={S.btnPrimary} onClick={() => { setForm(EMPTY); setEditingId(null); setShowForm(true); }}>
                <Plus size={15} /> Add Patient
              </button>
            )}
          </div>
        ) : (
          <div style={S.tableCard}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:C.surface2 }}>
                  {['Patient','ID','Department','Contact','Blood','Registered','Status',''].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom:`1px solid ${C.border}` }}
                    onMouseEnter={e => e.currentTarget.style.background='#F8FAFC'}
                    onMouseLeave={e => e.currentTarget.style.background=''}>

                    <td style={S.td}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <Avatar name={`${p.firstName} ${p.lastName}`} idx={p.avIndex ?? i} />
                        <div>
                          <div style={{ fontSize:13.5, fontWeight:600, color:C.t1 }}>{p.firstName} {p.lastName}</div>
                          {p.email && <div style={{ fontSize:11.5, color:C.t3 }}>{p.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ ...S.td, fontFamily:'monospace', fontSize:12, color:C.t3 }}>#{p.id}</td>
                    <td style={{ ...S.td, fontSize:13, color:C.t2 }}>{p.department || '—'}</td>
                    <td style={{ ...S.td, fontSize:13, color:C.t2 }}>{p.phone}</td>
                    <td style={S.td}>
                      {p.bloodGroup
                        ? <span style={{ background:'#FEE2E2', color:'#991B1B', fontSize:11.5, fontWeight:700, padding:'3px 8px', borderRadius:6 }}>{p.bloodGroup}</span>
                        : <span style={{ color:C.t3 }}>—</span>}
                    </td>
                    <td style={{ ...S.td, fontSize:12, color:C.t3 }}>{p.registeredAt}</td>
                    <td style={S.td}><StatusPill status={p.status} /></td>
                    <td style={{ ...S.td, position:'relative' }}>
                      <button onClick={() => setActiveMenu(activeMenu === p.id ? null : p.id)}
                        style={{ background:'none', border:'none', cursor:'pointer', padding:5, borderRadius:6, color:C.t3, display:'flex' }}>
                        <MoreHorizontal size={15} />
                      </button>
                      {activeMenu === p.id && (
                        <div style={S.menu}>
                          <div style={S.menuItem} onClick={() => handleEdit(p)}><Edit2 size={13} /> Edit</div>
                          <div style={{ ...S.menuItem, color:'#DC2626' }} onClick={() => handleDelete(p.id)}><Trash2 size={13} /> Delete</div>
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

      {/* Modal */}
      {showForm && (
        <div style={S.overlay}
          onClick={e => { if (e.target === e.currentTarget) { setShowForm(false); setFormErrors({}); } }}>
          <div style={S.modal}>
            <div style={S.modalHead}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, background:C.blueSoft, borderRadius:10,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <User size={17} color={C.blue} strokeWidth={1.8} />
                </div>
                <div>
                  <h2 style={{ fontSize:16, fontWeight:700, color:C.t1 }}>{editingId ? 'Edit Patient' : 'Register Patient'}</h2>
                  <p style={{ fontSize:12, color:C.t3 }}>{editingId ? 'Update patient record' : 'Add a new patient to the system'}</p>
                </div>
              </div>
              <button onClick={() => { setShowForm(false); setFormErrors({}); }} style={S.closeBtn}><X size={16} /></button>
            </div>

            <div style={{ padding:'20px 24px', overflowY:'auto', flex:1 }}>
              <form onSubmit={handleSubmit}>
                <SecLabel>Personal Information</SecLabel>
                <div style={{ display:'flex', gap:12 }}>
                  <Field label="First Name" required error={formErrors.firstName}>
                    <input style={fi(formErrors.firstName)} placeholder="John" value={form.firstName}
                      onChange={e => setForm({ ...form, firstName:e.target.value })} />
                  </Field>
                  <Field label="Last Name" required error={formErrors.lastName}>
                    <input style={fi(formErrors.lastName)} placeholder="Doe" value={form.lastName}
                      onChange={e => setForm({ ...form, lastName:e.target.value })} />
                  </Field>
                </div>
                <div style={{ display:'flex', gap:12 }}>
                  <Field label="Phone" required error={formErrors.phone}>
                    <input style={fi(formErrors.phone)} placeholder="99999 00000" value={form.phone}
                      onChange={e => setForm({ ...form, phone:e.target.value })} />
                  </Field>
                  <Field label="Email">
                    <input style={fi()} type="email" placeholder="patient@email.com" value={form.email}
                      onChange={e => setForm({ ...form, email:e.target.value })} />
                  </Field>
                </div>
                <div style={{ display:'flex', gap:12 }}>
                  <Field label="Date of Birth">
                    <input style={fi()} type="date" value={form.dob}
                      onChange={e => setForm({ ...form, dob:e.target.value })} />
                  </Field>
                  <Field label="Gender" required error={formErrors.gender}>
                    <select style={fi(formErrors.gender)} value={form.gender}
                      onChange={e => setForm({ ...form, gender:e.target.value })}>
                      <option value="">Select gender</option>
                      {GENDERS.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </Field>
                </div>
                <div style={{ display:'flex', gap:12 }}>
                  <Field label="Blood Group">
                    <select style={fi()} value={form.bloodGroup}
                      onChange={e => setForm({ ...form, bloodGroup:e.target.value })}>
                      <option value="">Select</option>
                      {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </Field>
                  <Field label="Department">
                    <select style={fi()} value={form.department}
                      onChange={e => setForm({ ...form, department:e.target.value })}>
                      <option value="">Select</option>
                      {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Address">
                  <input style={fi()} placeholder="Street, City, State" value={form.address}
                    onChange={e => setForm({ ...form, address:e.target.value })} />
                </Field>
                <SecLabel>Status & Notes</SecLabel>
                <Field label="Status">
                  <select style={fi()} value={form.status}
                    onChange={e => setForm({ ...form, status:e.target.value })}>
                    {Object.keys(STATUS_CFG).map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Clinical Notes">
                  <textarea style={{ ...fi(), height:72, resize:'vertical', paddingTop:10, paddingBottom:10 }}
                    placeholder="Relevant clinical notes..." value={form.notes}
                    onChange={e => setForm({ ...form, notes:e.target.value })} />
                </Field>
                <div style={{ display:'flex', justifyContent:'flex-end', gap:10,
                  paddingTop:16, borderTop:`1px solid ${C.border}`, marginTop:4 }}>
                  <button type="button" onClick={() => { setShowForm(false); setFormErrors({}); }} style={S.btnOutline}>Cancel</button>
                  <button type="submit" disabled={submitting} style={{ ...S.btnPrimary, opacity:submitting?0.75:1 }}>
                    {submitting ? <><span style={S.spin} /> Saving...</> : editingId ? 'Save Changes' : '+ Register Patient'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeMenu && <div style={{ position:'fixed', inset:0, zIndex:9 }} onClick={() => setActiveMenu(null)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        input:focus, select:focus, textarea:focus { border-color:#3B82F6 !important; box-shadow:0 0 0 3px rgba(59,130,246,0.12) !important; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-thumb { background:rgba(15,23,42,0.1); border-radius:4px; }
      `}</style>
    </div>
  );
}

function SecLabel({ children }) {
  return (
    <div style={{ fontSize:10.5, fontWeight:700, color:'#94A3B8', textTransform:'uppercase',
      letterSpacing:'1px', marginBottom:14, marginTop:4, paddingBottom:10,
      borderBottom:'1px solid rgba(15,23,42,0.08)' }}>{children}</div>
  );
}

const S = {
  topbar: { background:'#fff', borderBottom:'1px solid rgba(15,23,42,0.08)', padding:'0 28px', height:68,
    display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:20 },
  btnPrimary: { display:'inline-flex', alignItems:'center', gap:6, background:'#0F172A', color:'#fff',
    border:'none', borderRadius:9, fontFamily:F, fontSize:13.5, fontWeight:600,
    padding:'0 18px', height:40, cursor:'pointer' },
  btnOutline: { display:'inline-flex', alignItems:'center', gap:6, background:'#fff', color:'#475569',
    border:'1px solid rgba(15,23,42,0.13)', borderRadius:9, fontFamily:F, fontSize:13.5, fontWeight:500,
    padding:'0 16px', height:40, cursor:'pointer' },
  statCard: { background:'#fff', border:'1px solid rgba(15,23,42,0.08)', borderRadius:14, padding:'16px 18px' },
  searchWrap: { display:'flex', alignItems:'center', gap:10, background:'#fff',
    border:'1.5px solid rgba(15,23,42,0.08)', borderRadius:10, padding:'0 14px', height:42, flex:1, minWidth:260 },
  chip: { padding:'6px 14px', borderRadius:100, fontSize:12.5, fontWeight:500, border:'1px solid rgba(15,23,42,0.08)',
    background:'#fff', color:'#475569', cursor:'pointer', fontFamily:F },
  chipOn: { background:'#0F172A', color:'#fff', border:'1px solid #0F172A' },
  tableCard: { background:'#fff', border:'1px solid rgba(15,23,42,0.08)', borderRadius:14, overflow:'hidden' },
  th: { fontSize:10.5, fontWeight:600, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.6px',
    padding:'10px 16px', textAlign:'left', borderBottom:'1px solid rgba(15,23,42,0.08)', whiteSpace:'nowrap' },
  td: { padding:'12px 16px', fontSize:13, color:'#0F172A' },
  menu: { position:'absolute', right:8, top:36, zIndex:30, background:'#fff',
    border:'1px solid rgba(15,23,42,0.08)', borderRadius:10,
    boxShadow:'0 8px 24px rgba(15,23,42,0.1)', minWidth:130, overflow:'hidden' },
  menuItem: { display:'flex', alignItems:'center', gap:8, padding:'10px 14px',
    fontSize:13, fontWeight:500, color:'#0F172A', cursor:'pointer' },
  empty: { background:'#fff', border:'1px solid rgba(15,23,42,0.08)', borderRadius:16,
    padding:'60px 24px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' },
  overlay: { position:'fixed', inset:0, zIndex:100, background:'rgba(15,23,42,0.4)',
    backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 },
  modal: { background:'#fff', borderRadius:18, width:'100%', maxWidth:620, maxHeight:'92vh',
    overflow:'hidden', display:'flex', flexDirection:'column', animation:'slideUp 0.2s ease',
    boxShadow:'0 24px 64px rgba(15,23,42,0.16)' },
  modalHead: { padding:'18px 24px', borderBottom:'1px solid rgba(15,23,42,0.08)',
    display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 },
  closeBtn: { width:32, height:32, borderRadius:8, background:'#F8FAFC',
    border:'1px solid rgba(15,23,42,0.08)', display:'flex', alignItems:'center',
    justifyContent:'center', cursor:'pointer', color:'#475569' },
  spin: { display:'inline-block', width:13, height:13, border:'2px solid rgba(255,255,255,0.3)',
    borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' },
};