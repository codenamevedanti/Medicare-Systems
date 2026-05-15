import { useState, useEffect, useCallback } from 'react';
import {
  Calendar, Search, RefreshCw, X,
  Clock, User, Stethoscope, Activity, CheckCircle,
  AlertCircle, XCircle, Download, MoreHorizontal,
  Trash2, UserCheck, FlaskConical, Pill,
  HeartPulse, BadgeCheck, Timer, Loader2,
} from 'lucide-react';
import { appointmentService } from '../api/appointmentService';
import VitalsModal from '../pages/VitalsModal';
import PrescriptionModal from '../pages/PrescriptionModal';
import LabModal from '../pages/LabReportModal';

const F = "'DM Sans', -apple-system, sans-serif";
const C = {
  navy: '#0B1628', navy60: '#2a4570',
  teal: '#00C9A7', tealMid: '#00A98F', tealSoft: '#E0F7F4',
  gold: '#F5A623', goldSoft: '#FFF3DC',
  purple: '#7C3AED', purpleSoft: '#EDE9FE',
  red: '#E74C3C', redSoft: '#FDEDEB',
  blue: '#3B82F6', blueSoft: '#EFF6FF',
  green: '#10B981', greenSoft: '#ECFDF5',
  surface: '#F7F9FC', surface2: '#EDF1F7',
  border: 'rgba(11,22,40,0.09)', borderStrong: 'rgba(11,22,40,0.16)',
  t1: '#0B1628', t2: '#4A5568', t3: '#9AA5B4',
  white: '#ffffff',
};

const STATUS_CFG = {
  SCHEDULED:   { bg: C.goldSoft,   color: '#B45309',  icon: Timer,        label: 'Scheduled' },
  CONFIRMED:   { bg: C.blueSoft,   color: '#1D4ED8',  icon: BadgeCheck,   label: 'Confirmed' },
  COMPLETED:   { bg: C.greenSoft,  color: '#065F46',  icon: CheckCircle,  label: 'Completed' },
  CANCELLED:   { bg: C.redSoft,    color: '#B91C1C',  icon: XCircle,      label: 'Cancelled' },
  NO_SHOW:     { bg: C.surface2,   color: C.t2,       icon: AlertCircle,  label: 'No Show'   },
  IN_PROGRESS: { bg: C.purpleSoft, color: '#6D28D9',  icon: Activity,     label: 'In Progress'},
};

const DEPT_COLORS = [
  { bg: C.tealSoft,   color: C.tealMid },
  { bg: C.goldSoft,   color: '#B45309' },
  { bg: C.purpleSoft, color: '#6D28D9' },
  { bg: C.blueSoft,   color: '#1D4ED8' },
  { bg: C.redSoft,    color: '#B91C1C' },
  { bg: C.greenSoft,  color: '#065F46' },
];
const deptColor = (d = '') => DEPT_COLORS[(d && d.length > 0 ? d.charCodeAt(0) : 0) % DEPT_COLORS.length];

function StatusPill({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.SCHEDULED;
  const Icon = cfg.icon;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:100, fontSize:11.5, fontWeight:600, background:cfg.bg, color:cfg.color, whiteSpace:'nowrap' }}>
      <Icon size={11} strokeWidth={2.2} />{cfg.label}
    </span>
  );
}

function Av({ name='', size=34 }) {
  const ini = (name||'').trim().split(' ').filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase() || '?';
  const idx = (name && name.length > 0 ? name.charCodeAt(0) : 0) % DEPT_COLORS.length;
  const { bg, color } = DEPT_COLORS[idx];
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:bg, color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.33, fontWeight:600, flexShrink:0 }}>
      {ini}
    </div>
  );
}

function ActionBtn({ icon: Icon, label, onClick, color=C.t2, bg=C.surface2 }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={()=>setH(true)}
      onMouseLeave={()=>setH(false)}
      title={label}
      style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 9px', borderRadius:7, border:`1px solid ${C.border}`, background: h ? bg : C.white, color, fontSize:11, fontWeight:500, cursor:'pointer', transition:'all 0.12s', fontFamily:F }}
    >
      <Icon size={12} strokeWidth={2} />{label}
    </button>
  );
}

// Normalise raw appointment from your Spring Boot DTO
function normalise(a, i) {
  return {
    id: a.id ?? a.appointmentId ?? i,
    patientName: a.patientName ?? `${a.patient?.firstName??''} ${a.patient?.lastName??''}`.trim(),
    patientPhone: a.patientPhone ?? a.patient?.phone ?? '',
    department: a.department ?? a.departmentName ?? '',
    date: a.appointmentDate ?? a.date ?? '',
    slot: a.timeSlot ?? a.slot ?? '',
    visitType: a.visitType ?? a.type ?? 'Consultation',
    doctorName: a.doctorName ?? (a.doctor ? `Dr. ${a.doctor.name ?? a.doctor.firstName}` : null),
    status: (a.status ?? 'SCHEDULED').toUpperCase(),
    source: a.source ? a.source.toString().toUpperCase() : 'PATIENT',
    notes: a.notes ?? '',
    // keep the raw object so modals can access patient/doctor sub-objects
    _raw: a,
  };
}

// ── Demo fallback ─────────────────────────────────────────────────────────────
const DEMO = [
  { id:1, patientName:'Vedanti Deshmukh', patientPhone:'9000000000', department:'Paediatrics', date:'2026-04-03', slot:'12:00 PM', visitType:'New Consultation', doctorName:null, status:'COMPLETED', source:'PATIENT', notes:'Routine checkup' },
  { id:2, patientName:'Vedanti Deshmukh', patientPhone:'9000000000', department:'Cardiology',  date:'2026-04-04', slot:'12:00 PM', visitType:'Follow-up Visit',   doctorName:null, status:'COMPLETED', source:'PATIENT', notes:'' },
  { id:3, patientName:'Ram Chopra',       patientPhone:'1234567890', department:'Neurology',   date:'2026-04-24', slot:'12:00 PM', visitType:'Consultation',      doctorName:'Dr. Manish', status:'COMPLETED', source:'PATIENT', notes:'' },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterSource, setFilterSource] = useState('ALL');
  const [activeMenu, setActiveMenu] = useState(null);

  // ── Modal state ──────────────────────────────────────────────────────────────
  const [vitalsAppt, setVitalsAppt]   = useState(null); // appointment object or null
  const [rxAppt, setRxAppt]           = useState(null);
  const [labAppt, setLabAppt]         = useState(null);

  const fetchAll = useCallback(async (silent=false) => {
    silent ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const raw = await appointmentService.getAllAppointments();
      setAppointments((Array.isArray(raw) ? raw : []).map(normalise));
    } catch (e) {
      setError('API unavailable — showing demo data.');
      setAppointments(DEMO.map(normalise));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const changeStatus = async (id, st) => {
    try { await appointmentService.updateAppointmentStatus(id, st); } catch {}
    setAppointments(p => p.map(a => a.id===id ? {...a, status:st} : a));
    setActiveMenu(null);
  };

  const deleteAppt = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try { await appointmentService.deleteAppointment(id); } catch {}
    setAppointments(p => p.filter(a => a.id!==id));
    setActiveMenu(null);
  };

  // Stats
  const tot = appointments.length;
  const byStatus = (s) => appointments.filter(a=>a.status===s).length;
  const bySource = (s) => appointments.filter(a=>(a.source ?? 'PATIENT')===s).length;

  // Filter
  const filtered = appointments.filter(a => {
    const q = search.toLowerCase();
    const mQ = !q || [a.patientName,a.department,a.doctorName,a.visitType,String(a.id)].join(' ').toLowerCase().includes(q);
    const mS = filterStatus==='ALL' || a.status===filterStatus;
    const mSr = filterSource === 'ALL' || (a.source ?? 'PATIENT') === filterSource;
    return mQ && mS && mSr;
  });

  console.log('appointments:', appointments);
  console.log('filtered:', filtered);
  console.log('filterSource:', filterSource);
  console.log('filterStatus:', filterStatus);

  // Group by date desc
  const grouped = filtered.reduce((acc,a) => { const k=a.date||'Undated'; (acc[k]||(acc[k]=[])).push(a); return acc; }, {});
  const dates = Object.keys(grouped).sort((a,b)=>new Date(b)-new Date(a));

  const fmtDate = d => {
    const dt = new Date(d);
    return isNaN(dt) ? d : dt.toLocaleDateString('en-IN',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
  };
  const isToday = d => new Date(d).toDateString()===new Date().toDateString();

  return (
    <div style={{ minHeight:'100vh', background:C.surface, fontFamily:F }}>

      {/* ── Modals ── */}
      {vitalsAppt && (
        <VitalsModal
          appointment={vitalsAppt._raw ?? vitalsAppt}
          onClose={() => setVitalsAppt(null)}
          onSaved={() => { setVitalsAppt(null); fetchAll(true); }}
        />
      )}
      {rxAppt && (
        <PrescriptionModal
          appointment={rxAppt._raw ?? rxAppt}
          onClose={() => setRxAppt(null)}
          onSaved={() => { setRxAppt(null); fetchAll(true); }}
        />
      )}
      {labAppt && (
        <LabModal
          appointment={labAppt._raw ?? labAppt}
          onClose={() => setLabAppt(null)}
          onSaved={() => { setLabAppt(null); fetchAll(true); }}
        />
      )}

      {/* Topbar */}
      <div style={S.topbar}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={S.topbarIcon}><Calendar size={18} color={C.teal} strokeWidth={1.8}/></div>
          <div>
            <h1 style={S.pageTitle}>Appointments</h1>
            <p style={S.pageSub}>{tot} total · {bySource('PATIENT')} from patients · {bySource('ADMIN')} by admin</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button style={S.btnSec} onClick={()=>fetchAll(true)} disabled={refreshing}>
            <RefreshCw size={14} style={{ animation: refreshing?'spin 1s linear infinite':'none' }}/>
            Refresh
          </button>
          <button style={S.btnSec}><Download size={14}/> Export</button>
        </div>
      </div>

      <div style={{ padding:'22px 28px' }}>

        {/* Stat cards */}
        <div style={S.statsGrid}>
          {[
            { label:'Total',      v:tot,                icon:Calendar,    bg:C.surface2,   color:C.t2 },
            { label:'Scheduled',  v:byStatus('SCHEDULED'),  icon:Timer,       bg:C.goldSoft,   color:'#B45309' },
            { label:'Confirmed',  v:byStatus('CONFIRMED'),  icon:BadgeCheck,  bg:C.blueSoft,   color:'#1D4ED8' },
            { label:'In Progress',v:byStatus('IN_PROGRESS'),icon:Activity,    bg:C.purpleSoft, color:'#6D28D9' },
            { label:'Completed',  v:byStatus('COMPLETED'),  icon:CheckCircle, bg:C.greenSoft,  color:'#065F46' },
            { label:'Cancelled',  v:byStatus('CANCELLED'),  icon:XCircle,     bg:C.redSoft,    color:'#B91C1C' },
            { label:'From Patients',v:bySource('PATIENT'),  icon:User,        bg:C.tealSoft,   color:C.tealMid },
            { label:'By Admin',   v:bySource('ADMIN'),      icon:UserCheck,   bg:C.purpleSoft, color:'#6D28D9' },
          ].map(s=>(
            <div key={s.label} style={S.statCard}>
              <div style={{ width:32, height:32, borderRadius:9, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
                <s.icon size={15} color={s.color} strokeWidth={1.8}/>
              </div>
              <div style={{ fontSize:22, fontWeight:600, color:C.t1, letterSpacing:'-0.5px', fontVariantNumeric:'tabular-nums' }}>{s.v}</div>
              <div style={{ fontSize:10.5, color:C.t3, textTransform:'uppercase', letterSpacing:'0.4px', marginTop:3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Source tabs */}
        <div style={S.sourceTabs}>
          {[
            { key:'ALL',     label:'All',            ct:tot },
            { key:'PATIENT', label:'Patient Portal', ct:bySource('PATIENT'), icon:User },
            { key:'ADMIN',   label:'Admin Booked',   ct:bySource('ADMIN'),   icon:UserCheck },
          ].map(t=>(
            <button key={t.key} onClick={()=>setFilterSource(t.key)}
              style={{ ...S.sourceTab, ...(filterSource===t.key ? S.sourceTabOn:{}) }}>
              {t.icon && <t.icon size={13} strokeWidth={1.8}/>}
              {t.label}
              <span style={{ ...S.tabBadge, ...(filterSource===t.key?{background:C.navy,color:C.white}:{}) }}>{t.ct}</span>
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div style={S.filtersRow}>
          <div style={S.searchBox}>
            <Search size={15} color={C.t3} style={{ flexShrink:0 }}/>
            <input placeholder="Search patient, dept, doctor, ID..." value={search}
              onChange={e=>setSearch(e.target.value)} style={S.searchInput}/>
            {search && <button onClick={()=>setSearch('')} style={S.xBtn}><X size={13} color={C.t3}/></button>}
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {['ALL','SCHEDULED','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED','NO_SHOW'].map(s=>(
              <button key={s} onClick={()=>setFilterStatus(s)}
                style={{ ...S.chip, ...(filterStatus===s?S.chipOn:{}) }}>
                {s==='ALL'?'All':(STATUS_CFG[s]?.label??s)}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ display:'flex', alignItems:'center', gap:10, background:C.redSoft, border:`1px solid rgba(185,28,28,0.15)`, borderRadius:10, padding:'10px 16px', marginBottom:16 }}>
            <AlertCircle size={15} color="#B91C1C"/>
            <span style={{ fontSize:13, color:'#B91C1C' }}>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'80px 0' }}>
            <Loader2 size={26} color={C.teal} style={{ animation:'spin 1s linear infinite' }}/>
            <span style={{ fontSize:13, color:C.t3, marginTop:14 }}>Loading appointments...</span>
          </div>
        ) : filtered.length===0 ? (
          <div style={S.empty}>
            <div style={S.emptyIcon}><Calendar size={28} color={C.t3} strokeWidth={1.4}/></div>
            <h3 style={{ fontSize:16, fontWeight:600, color:C.t1, marginBottom:6 }}>No appointments found</h3>
            <p style={{ fontSize:13.5, color:C.t3 }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          dates.map(date=>(
            <div key={date} style={{ marginBottom:28 }}>
              {/* Date group header */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:8, background: isToday(date)?C.navy:C.tealSoft, color: isToday(date)?C.white:C.tealMid, fontSize:13, fontWeight:600, padding:'7px 16px', borderRadius:100 }}>
                  <Calendar size={13} strokeWidth={2}/>
                  {isToday(date) ? `Today — ${fmtDate(date)}` : fmtDate(date)}
                </div>
                <span style={{ fontSize:12, color:C.t3 }}>{grouped[date].length} appointment{grouped[date].length!==1?'s':''}</span>
              </div>

              <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, overflow:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:900 }}>
                  <thead>
                    <tr>
                      {['#','Patient','Dept','Time','Visit Type','Doctor','Source','Status','Actions'].map(h=>(
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {grouped[date].map((a,idx)=>{
                      const dc = deptColor(a.department);
                      return (
                        <tr key={a.id}>
                          <td style={{ ...S.td, color:C.t3, fontSize:12, width:38, textAlign:'center' }}>{idx+1}</td>

                          <td style={S.td}>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                              <Av name={a.patientName}/>
                              <div>
                                <div style={{ fontSize:13.5, fontWeight:500, color:C.t1 }}>{a.patientName||'—'}</div>
                                {a.patientPhone && <div style={{ fontSize:11.5, color:C.t3 }}>{a.patientPhone}</div>}
                              </div>
                            </div>
                          </td>

                          <td style={S.td}>
                            <span style={{ background:dc.bg, color:dc.color, fontSize:12, fontWeight:500, padding:'3px 10px', borderRadius:6, whiteSpace:'nowrap' }}>
                              {a.department||'—'}
                            </span>
                          </td>

                          <td style={S.td}>
                            <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:C.t1, whiteSpace:'nowrap' }}>
                              <Clock size={13} color={C.t3} strokeWidth={1.8}/>{a.slot||'—'}
                            </div>
                          </td>

                          <td style={{ ...S.td, fontSize:13, color:C.t2, whiteSpace:'nowrap' }}>{a.visitType||'—'}</td>

                          <td style={S.td}>
                            {a.doctorName
                              ? <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                                  <div style={{ width:26, height:26, borderRadius:'50%', background:C.purpleSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                    <Stethoscope size={12} color="#6D28D9" strokeWidth={2}/>
                                  </div>
                                  <span style={{ fontSize:13, color:C.t1, whiteSpace:'nowrap' }}>{a.doctorName}</span>
                                </div>
                              : <span style={{ fontSize:12, color:C.t3, fontStyle:'italic' }}>Unassigned</span>
                            }
                          </td>

                          <td style={S.td}>
                            <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:100, background: a.source==='PATIENT'?C.tealSoft:C.purpleSoft, color: a.source==='PATIENT'?C.tealMid:'#6D28D9', whiteSpace:'nowrap' }}>
                              {a.source==='PATIENT'
                                ? <><User size={10} strokeWidth={2}/> Patient</>
                                : <><UserCheck size={10} strokeWidth={2}/> Admin</>
                              }
                            </span>
                          </td>

                          <td style={S.td}><StatusPill status={a.status}/></td>

                          {/* ── Actions ── */}
                          <td style={{ ...S.td, position:'relative' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:5 }}>

                              {/* VITALS — opens VitalsModal */}
                              <ActionBtn
                                icon={HeartPulse}
                                label="Vitals"
                                color="#B91C1C"
                                bg={C.redSoft}
                                onClick={() => setVitalsAppt(a)}
                              />

                              {/* RX — opens PrescriptionModal */}
                              <ActionBtn
                                icon={Pill}
                                label="Rx"
                                color="#6D28D9"
                                bg={C.purpleSoft}
                                onClick={() => setRxAppt(a)}
                              />

                              {/* LAB — opens LabModal */}
                              <ActionBtn
                                icon={FlaskConical}
                                label="Lab"
                                color="#1D4ED8"
                                bg={C.blueSoft}
                                onClick={() => setLabAppt(a)}
                              />

                              {/* ⋯ More menu */}
                              <div style={{ position:'relative' }}>
                                <button onClick={()=>setActiveMenu(activeMenu===a.id?null:a.id)} style={S.moreBtn}>
                                  <MoreHorizontal size={15}/>
                                </button>
                                {activeMenu===a.id && (
                                  <div style={S.ctxMenu}>
                                    <div style={S.ctxLabel}>Update Status</div>
                                    {Object.entries(STATUS_CFG).map(([k,v])=>(
                                      <div key={k} style={S.ctxItem} onClick={()=>changeStatus(a.id,k)}>{v.label}</div>
                                    ))}
                                    <div style={{ height:1, background:C.border, margin:'4px 0' }}/>
                                    <div style={{ ...S.ctxItem, color:'#B91C1C' }} onClick={()=>deleteAppt(a.id)}>
                                      <Trash2 size={12}/> Delete
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {activeMenu && <div style={{ position:'fixed', inset:0, zIndex:9 }} onClick={()=>setActiveMenu(null)}/>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes spin{to{transform:rotate(360deg)}}
        input{font-family:${F};}
        input:focus{outline:none;}
        tr:hover td{background:${C.surface}!important;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(11,22,40,0.12);border-radius:4px;}
      `}</style>
    </div>
  );
}

const S = {
  topbar:{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:'0 28px', height:68, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:20 },
  topbarIcon:{ width:42, height:42, background:C.navy, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center' },
  pageTitle:{ fontSize:20, fontWeight:600, color:C.t1, letterSpacing:'-0.5px' },
  pageSub:{ fontSize:12, color:C.t3, marginTop:2 },
  btnSec:{ display:'inline-flex', alignItems:'center', gap:6, background:C.white, color:C.t2, border:`1px solid ${C.borderStrong}`, borderRadius:9, fontFamily:F, fontSize:13, fontWeight:500, padding:'0 16px', height:38, cursor:'pointer' },

  statsGrid:{ display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap:11, marginBottom:20 },
  statCard:{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:'15px 14px 13px' },

  sourceTabs:{ display:'flex', gap:4, marginBottom:16, background:C.surface2, padding:4, borderRadius:12, width:'fit-content' },
  sourceTab:{ display:'inline-flex', alignItems:'center', gap:7, padding:'7px 16px', borderRadius:9, border:'none', background:'transparent', fontFamily:F, fontSize:13, fontWeight:500, color:C.t2, cursor:'pointer', transition:'all 0.15s' },
  sourceTabOn:{ background:C.white, color:C.t1, boxShadow:'0 1px 4px rgba(11,22,40,0.1)' },
  tabBadge:{ fontSize:11, fontWeight:600, padding:'2px 7px', borderRadius:100, background:C.surface2, color:C.t3 },

  filtersRow:{ display:'flex', alignItems:'center', gap:12, marginBottom:18, flexWrap:'wrap' },
  searchBox:{ display:'flex', alignItems:'center', gap:10, background:C.white, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'0 14px', height:42, flex:'1 1 280px' },
  searchInput:{ flex:1, border:'none', outline:'none', fontSize:13.5, color:C.t1, background:'transparent', fontFamily:F },
  xBtn:{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:2 },
  chip:{ padding:'6px 13px', borderRadius:100, fontSize:12.5, fontWeight:500, border:`1px solid ${C.border}`, background:C.white, color:C.t2, cursor:'pointer', fontFamily:F, transition:'all 0.12s' },
  chipOn:{ background:C.navy, color:C.white, border:`1px solid ${C.navy}` },

  empty:{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:'60px 24px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' },
  emptyIcon:{ width:64, height:64, borderRadius:'50%', background:C.surface2, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 },

  th:{ fontSize:10.5, fontWeight:600, color:C.t3, textTransform:'uppercase', letterSpacing:'0.6px', padding:'10px 14px', textAlign:'left', background:C.surface, borderBottom:`1px solid ${C.border}`, whiteSpace:'nowrap' },
  td:{ padding:'12px 14px', fontSize:13, color:C.t1, borderBottom:`1px solid ${C.border}`, transition:'background 0.1s', verticalAlign:'middle' },

  moreBtn:{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:7, padding:'5px 7px', cursor:'pointer', display:'flex', alignItems:'center', color:C.t2 },
  ctxMenu:{ position:'absolute', right:0, top:34, zIndex:40, background:C.white, border:`1px solid ${C.border}`, borderRadius:11, boxShadow:'0 8px 28px rgba(11,22,40,0.13)', minWidth:170, overflow:'hidden' },
  ctxLabel:{ fontSize:10, fontWeight:600, color:C.t3, textTransform:'uppercase', letterSpacing:'0.8px', padding:'9px 14px 5px' },
  ctxItem:{ display:'flex', alignItems:'center', gap:7, padding:'9px 14px', fontSize:13, color:C.t1, cursor:'pointer', transition:'background 0.1s' },
};