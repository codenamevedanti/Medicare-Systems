import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Stethoscope, Calendar, DollarSign,
  AlertTriangle, ChevronRight, LogOut, Activity,
  Bell, Heart,
} from 'lucide-react';

const F = "'Inter', -apple-system, sans-serif";

const C = {
  bg:'#F0F4FA', white:'#FFFFFF', surface2:'#F7F9FC',
  border:'rgba(15,23,42,0.08)', borderMed:'rgba(15,23,42,0.13)',
  navy:'#0F172A', navyMid:'#1E3A5F',
  blue:'#3B82F6', blueSoft:'#EFF6FF',
  t1:'#0F172A', t2:'#475569', t3:'#94A3B8',
  green:'#059669', red:'#DC2626',
};

// ── Patient names intentionally NOT included here.
// Names are only shown in /admin/appointments (Appointments.jsx).
// Dashboard shows only patient ID + department + status for privacy.
const RECENT_PATIENTS = [
  { id:'#PT-0841', dept:'Cardiology',  status:'Admitted' },
  { id:'#PT-0842', dept:'Orthopedics', status:'Pending'  },
  { id:'#PT-0843', dept:'Neurology',   status:'Critical' },
  { id:'#PT-0844', dept:'General',     status:'Active'   },
  { id:'#PT-0845', dept:'Gynecology',  status:'Admitted' },
];

const ALERTS = [
  { level:'critical', msg:'Patient #PT-0843 — Neurology ICU critical',     time:'2 min ago' },
  { level:'warning',  msg:'OT scheduled — Dr. Priya Kulkarni at 11:00 AM', time:'8 min ago' },
  { level:'info',     msg:'3 new lab reports pending review',               time:'Just now'  },
];

const STATUS_CFG = {
  Active:   { bg:'#F0FDF4', color:'#15803D', dot:'#22C55E' },
  Admitted: { bg:'#EFF6FF', color:'#1D4ED8', dot:'#3B82F6' },
  Pending:  { bg:'#FFFBEB', color:'#B45309', dot:'#F59E0B' },
  Critical: { bg:'#FEF2F2', color:'#B91C1C', dot:'#EF4444' },
};

const DEPT_COLOR = {
  Cardiology:'#DC2626', Neurology:'#7C3AED', Orthopedics:'#D97706',
  General:'#475569', Gynecology:'#DB2777', Pediatrics:'#2563EB',
};

const ALERT_CFG = {
  critical: { bg:'#FEF2F2', border:'#FECACA', dot:'#EF4444', color:'#B91C1C' },
  warning:  { bg:'#FFFBEB', border:'#FDE68A', dot:'#F59E0B', color:'#B45309' },
  info:     { bg:'#EFF6FF', border:'#BFDBFE', dot:'#3B82F6', color:'#1D4ED8' },
};

function StatusPill({ status }) {
  const s = STATUS_CFG[status] || STATUS_CFG.Active;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px',
      borderRadius:100, fontSize:11.5, fontWeight:600, background:s.bg, color:s.color }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:s.dot }} />
      {status}
    </span>
  );
}

function QA({ icon:Icon, title, sub, color, bg, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
        background:hov ? C.surface2 : C.white,
        borderBottom:`1px solid ${C.border}`, cursor:'pointer', transition:'background 0.13s' }}>
      <div style={{ width:36, height:36, borderRadius:10, background:bg,
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon size={17} color={color} strokeWidth={1.8} />
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13.5, fontWeight:600, color:C.t1 }}>{title}</div>
        <div style={{ fontSize:12, color:C.t3 }}>{sub}</div>
      </div>
      <ChevronRight size={15} color={C.t3} />
    </div>
  );
}

export default function AdminDashboard() {
  const [loading,  setLoading]  = useState(true);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role  = localStorage.getItem('adminRole');
    const token = localStorage.getItem('adminToken');
    if (!token || role !== 'ADMIN') { navigate('/Adminlogin'); return; }
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, [navigate]);

  useEffect(() => {
    const saved = localStorage.getItem('hms_patients');
    if (saved) setPatients(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminUsername');
    navigate('/Adminlogin');
  };

  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday:'short', day:'2-digit', month:'short', year:'numeric',
  });

  const STATS = [
    { label:'Total Patients',       value: patients.length || 1240, sub:'+12 today',        Icon:Users,        bg:'#DBEAFE', color:'#1D4ED8' },
    { label:'Doctors On Duty',      value: 32,                      sub:'5 in surgery',      Icon:Stethoscope,  bg:'#D1FAE5', color:'#065F46' },
    { label:"Today's Revenue",      value: '₹45.2K',               sub:'+8% vs yesterday',  Icon:DollarSign,   bg:'#FEF3C7', color:'#92400E' },
    { label:'Pending Appointments', value: 18,                      sub:'3 urgent',          Icon:Calendar,     bg:'#EDE9FE', color:'#5B21B6' },
  ];

  if (loading) return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center',
      justifyContent:'center', flexDirection:'column', gap:16, fontFamily:F }}>
      <div style={{ width:40, height:40, border:`3px solid ${C.border}`, borderTopColor:C.blue,
        borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <p style={{ color:C.t3, fontSize:14 }}>Loading dashboard…</p>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:F }}>

      {/* ── Topbar ── */}
      <div style={S.topbar}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:44, height:44, background:C.navy, borderRadius:12,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Heart size={20} color="#3B82F6" strokeWidth={2} />
          </div>
          <div>
            <h1 style={{ fontSize:17, fontWeight:700, color:C.t1, letterSpacing:'-0.3px' }}>Ratnadeep HMS</h1>
            <p style={{ fontSize:11.5, color:C.t3 }}>Admin Panel</p>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px',
            background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:100 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#22C55E',
              animation:'pulse 1.5s ease-in-out infinite' }} />
            <span style={{ fontSize:12, fontWeight:600, color:'#15803D' }}>All systems live</span>
          </div>
          <span style={{ fontSize:12, color:C.t3 }}>{dateStr}</span>
          <button style={{ background:'none', border:`1px solid ${C.borderMed}`, borderRadius:8,
            padding:'7px 10px', cursor:'pointer', display:'flex', color:C.t2 }}>
            <Bell size={16} />
          </button>
          <button onClick={handleLogout}
            style={{ display:'inline-flex', alignItems:'center', gap:6, background:C.navy, color:'#fff',
              border:'none', borderRadius:9, fontFamily:F, fontSize:13, fontWeight:600,
              padding:'7px 14px', cursor:'pointer' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* ── Alert Banner ── */}
      <div style={{ background:C.navy, padding:'9px 28px', display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ width:7, height:7, borderRadius:'50%', background:'#22C55E',
          animation:'pulse 1.5s ease-in-out infinite', flexShrink:0 }} />
        <span style={{ fontSize:12, color:'rgba(255,255,255,0.6)' }}>
          All systems operational · Last backup:
        </span>
        <span style={{ fontSize:12, color:'#60A5FA', fontWeight:600 }}>today at 3:00 AM</span>
        <span style={{ marginLeft:'auto', fontSize:11, color:'rgba(255,255,255,0.3)' }}>uptime 99.98%</span>
      </div>

      <div style={{ padding:'24px 28px' }}>

        {/* Page Heading */}
        <div style={{ marginBottom:22 }}>
          <h2 style={{ fontSize:22, fontWeight:700, color:C.t1, letterSpacing:'-0.5px' }}>Hospital Command Center</h2>
          <p style={{ fontSize:13.5, color:C.t3, marginTop:3 }}>Real-time hospital statistics and management</p>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
          {STATS.map(({ label, value, sub, Icon, bg, color }) => (
            <div key={label} style={S.statCard}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                <div style={{ width:40, height:40, borderRadius:11, background:bg,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={19} color={color} strokeWidth={1.8} />
                </div>
                <span style={{ fontSize:10.5, fontWeight:600, color:'#15803D', background:'#F0FDF4',
                  padding:'2px 8px', borderRadius:100, border:'1px solid #BBF7D0' }}>LIVE</span>
              </div>
              <div style={{ fontSize:30, fontWeight:700, color:C.t1, letterSpacing:'-1.5px', lineHeight:1, marginBottom:4 }}>
                {value}
              </div>
              <div style={{ fontSize:11, color:C.t3, textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:500, marginBottom:5 }}>
                {label}
              </div>
              <div style={{ fontSize:12, color: label.includes('Pending') ? '#B91C1C' : C.green, fontWeight:500 }}>
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* ── Two Column ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:16 }}>

          {/* LEFT: Recent Patient Registrations — NO NAMES */}
          <div style={S.card}>
            <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}`,
              display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <h3 style={{ fontSize:14, fontWeight:700, color:C.t1 }}>Recent Patient Registrations</h3>
                {/* Subtitle explicitly states names are hidden here */}
                <p style={{ fontSize:11.5, color:C.t3, marginTop:2 }}>
                  IDs & departments only · go to <span style={{ color:C.blue, cursor:'pointer', fontWeight:600 }}
                    onClick={() => navigate('/admin/appointments')}>Appointments</span> for full patient details
                </p>
              </div>
              <button onClick={() => navigate('/admin/patients')}
                style={{ fontSize:12, fontWeight:600, color:C.blue, background:'none',
                  border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
                View all <ChevronRight size={13} />
              </button>
            </div>

            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:C.surface2 }}>
                  {/* ── Only 3 columns: no "Patient Name" column ── */}
                  {['Patient ID', 'Department', 'Status'].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_PATIENTS.map(p => (
                  <tr key={p.id} style={{ borderBottom:`1px solid ${C.border}` }}
                    onMouseEnter={e => e.currentTarget.style.background='#F8FAFC'}
                    onMouseLeave={e => e.currentTarget.style.background=''}>

                    {/* Patient ID badge — no name, no avatar with initials */}
                    <td style={S.td}>
                      <span style={{ fontFamily:'monospace', fontSize:13, fontWeight:700,
                        color:C.navyMid, background:C.blueSoft, padding:'4px 10px',
                        borderRadius:7, border:'1px solid rgba(59,130,246,0.15)', display:'inline-block' }}>
                        {p.id}
                      </span>
                    </td>

                    {/* Department */}
                    <td style={S.td}>
                      <span style={{ display:'inline-block', padding:'3px 9px', borderRadius:6,
                        fontSize:12, fontWeight:600,
                        background:`${DEPT_COLOR[p.dept] || '#64748B'}15`,
                        color: DEPT_COLOR[p.dept] || '#64748B' }}>
                        {p.dept}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={S.td}><StatusPill status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RIGHT column */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

            {/* Quick Actions */}
            <div style={{ ...S.card, overflow:'hidden' }}>
              <div style={{ padding:'14px 16px', borderBottom:`1px solid ${C.border}` }}>
                <h3 style={{ fontSize:14, fontWeight:700, color:C.t1 }}>Quick Actions</h3>
                <p style={{ fontSize:12, color:C.t3, marginTop:1 }}>Common admin tasks</p>
              </div>
              <QA icon={Users}        title="Manage Patients"   sub="View, add & edit records"    color="#1D4ED8" bg="#DBEAFE" onClick={() => navigate('/admin/patients')}      />
              <QA icon={Calendar}     title="View Appointments" sub="Schedule & pending list"     color="#5B21B6" bg="#EDE9FE" onClick={() => navigate('/admin/appointments')}  />
              <QA icon={Stethoscope}  title="Manage Doctors"    sub="Staff & duty schedules"      color="#065F46" bg="#D1FAE5" onClick={() => navigate('/admin/doctors')}       />
              <QA icon={DollarSign}   title="Billing & Finance" sub="Revenue, invoices & dues"    color="#92400E" bg="#FEF3C7" onClick={() => navigate('/admin/billing')}       />
              <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', cursor:'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background=C.surface2}
                onMouseLeave={e => e.currentTarget.style.background=''}>
                <div style={{ width:36, height:36, borderRadius:10, background:'#FEE2E2',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <AlertTriangle size={17} color="#B91C1C" strokeWidth={1.8} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13.5, fontWeight:600, color:C.t1 }}>Emergency Alerts</div>
                  <div style={{ fontSize:12, color:'#B91C1C', fontWeight:500 }}>3 active alerts right now</div>
                </div>
                <ChevronRight size={15} color={C.t3} />
              </div>
            </div>

            {/* Live Alerts */}
            <div style={{ ...S.card, overflow:'hidden' }}>
              <div style={{ padding:'14px 16px', borderBottom:`1px solid ${C.border}` }}>
                <h3 style={{ fontSize:14, fontWeight:700, color:C.t1 }}>Live Alerts</h3>
              </div>
              <div style={{ padding:'10px 14px', display:'flex', flexDirection:'column', gap:8 }}>
                {ALERTS.map((a, i) => {
                  const cfg = ALERT_CFG[a.level];
                  return (
                    <div key={i} style={{ padding:'10px 12px', background:cfg.bg,
                      border:`1px solid ${cfg.border}`, borderRadius:10 }}>
                      <div style={{ display:'flex', alignItems:'flex-start', gap:7, marginBottom:3 }}>
                        <span style={{ width:7, height:7, borderRadius:'50%', background:cfg.dot, flexShrink:0, marginTop:3 }} />
                        <span style={{ fontSize:12.5, fontWeight:600, color:cfg.color, lineHeight:1.4 }}>{a.msg}</span>
                      </div>
                      <div style={{ fontSize:11, color:C.t3, paddingLeft:14 }}>{a.time}</div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes spin  { to { transform:rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(15,23,42,0.1); border-radius:4px; }
      `}</style>
    </div>
  );
}

const S = {
  topbar: {
    background:'#fff', borderBottom:'1px solid rgba(15,23,42,0.08)',
    padding:'0 28px', height:68,
    display:'flex', alignItems:'center', justifyContent:'space-between',
    position:'sticky', top:0, zIndex:20,
  },
  statCard: {
    background:'#fff', border:'1px solid rgba(15,23,42,0.08)',
    borderRadius:14, padding:'18px 20px',
  },
  card: {
    background:'#fff', border:'1px solid rgba(15,23,42,0.08)', borderRadius:14,
  },
  th: {
    fontSize:10.5, fontWeight:600, color:'#94A3B8', textTransform:'uppercase',
    letterSpacing:'0.6px', padding:'9px 16px', textAlign:'left',
    borderBottom:'1px solid rgba(15,23,42,0.08)', whiteSpace:'nowrap',
  },
  td: { padding:'12px 16px', fontSize:13, color:'#0F172A' },
};