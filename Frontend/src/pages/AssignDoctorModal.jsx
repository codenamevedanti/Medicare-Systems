import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserCheck, CheckCircle, Clock, Stethoscope, Calendar, User } from 'lucide-react';
import api from '../api/axios';

const parseDept = (notes) => {
  if (!notes) return '—';
  if (notes.includes('Dept:')) return notes.split('Dept:')[1].split('|')[0].trim();
  return '—';
};

const DEPT_COLORS = {
  Cardiology:   { main: '#dc2626', light: '#fef2f2', border: '#fecaca' },
  Neurology:    { main: '#7c3aed', light: '#f5f3ff', border: '#ddd6fe' },
  Oncology:     { main: '#059669', light: '#ecfdf5', border: '#a7f3d0' },
  Gynaecology:  { main: '#db2777', light: '#fdf2f8', border: '#fbcfe8' },
  Orthopaedics: { main: '#d97706', light: '#fffbeb', border: '#fde68a' },
  Paediatrics:  { main: '#2563eb', light: '#eff6ff', border: '#bfdbfe' },
};

const DEFAULT_COLOR = { main: '#0f4c81', light: '#eff6ff', border: '#bfdbfe' };

export default function AssignDoctorModal({ appointment, onClose, onAssigned }) {
  const dept = parseDept(appointment.notes);
  const color = DEPT_COLORS[dept] || DEFAULT_COLOR;

  const [deptDoctors,      setDeptDoctors]      = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [saving,           setSaving]           = useState(false);
  const [error,            setError]            = useState('');
  const [loadingDoctors,   setLoadingDoctors]   = useState(true);

  useEffect(() => {
    if (!dept || dept === '—') { setLoadingDoctors(false); return; }
    const token = localStorage.getItem('adminToken');
    api.get(`/doctors/department/${encodeURIComponent(dept.trim())}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(r => { setDeptDoctors(r.data || []); setLoadingDoctors(false); })
    .catch(() => { setDeptDoctors([]); setLoadingDoctors(false); });
  }, [dept]);

  const handleAssign = async () => {
    if (!selectedDoctorId) { setError('Please select a doctor.'); return; }
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      await api.put(
        `/appointments/${appointment.id}/assign-doctor`,
        { doctorId: Number(selectedDoctorId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onAssigned?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign doctor.');
    } finally {
      setSaving(false);
    }
  };

  const selectedDoc = deptDoctors.find(d => d.id === Number(selectedDoctorId));

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(2, 8, 23, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
        overflow: 'hidden',
        animation: 'slideUp 0.2s ease-out',
      }}>

        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${color.main}15, ${color.main}05)`,
          borderBottom: `1px solid ${color.border}`,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${color.main}, ${color.main}cc)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 12px ${color.main}40`,
            }}>
              <UserCheck size={20} color="white" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>
                Assign Doctor
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Appointment #{appointment.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              border: 'none', background: '#f1f5f9', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#64748b', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.target.style.background = '#e2e8f0'}
            onMouseLeave={e => e.target.style.background = '#f1f5f9'}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Appointment Info Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px',
          }}>
            {[
              { icon: <User size={14} />, label: 'Patient', value: `${appointment.patient?.firstName ?? ''} ${appointment.patient?.lastName ?? ''}` },
              { icon: <Stethoscope size={14} />, label: 'Department', value: dept },
              { icon: <Calendar size={14} />, label: 'Date', value: appointment.appointmentDate ?? '—' },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '12px',
                border: '1px solid #e2e8f0',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94a3b8', marginBottom: '4px' }}>
                  {icon}
                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#1e293b', wordBreak: 'break-word' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Doctor Selection */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Select Doctor
              </label>
              <span style={{
                fontSize: '10px', fontWeight: 700,
                color: color.main,
                background: color.light,
                border: `1px solid ${color.border}`,
                padding: '2px 8px', borderRadius: '20px',
              }}>
                {dept}
              </span>
            </div>

            {loadingDoctors ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', gap: '10px' }}>
                <div style={{
                  width: '20px', height: '20px',
                  border: `2px solid ${color.main}30`,
                  borderTopColor: color.main,
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Loading doctors...</span>
              </div>
            ) : deptDoctors.length === 0 ? (
              <div style={{
                background: '#fffbeb', border: '1px solid #fde68a',
                borderRadius: '12px', padding: '14px 16px',
                fontSize: '13px', color: '#92400e',
              }}>
                ⚠️ No doctors found for <strong>{dept}</strong>.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto', paddingRight: '2px' }}>
                {deptDoctors.map(doc => {
                  const isSelected = Number(selectedDoctorId) === doc.id;
                  return (
                    <label key={doc.id} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: `2px solid ${isSelected ? color.main : '#e2e8f0'}`,
                      background: isSelected ? color.light : '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}>
                      <input
                        type="radio" name="doctor" value={doc.id}
                        checked={isSelected}
                        onChange={e => { setSelectedDoctorId(e.target.value); setError(''); }}
                        style={{ display: 'none' }}
                      />
                      {/* Avatar */}
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                        background: isSelected
                          ? `linear-gradient(135deg, ${color.main}, ${color.main}bb)`
                          : 'linear-gradient(135deg, #475569, #1e293b)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '13px', fontWeight: 800,
                        boxShadow: isSelected ? `0 4px 12px ${color.main}40` : '0 2px 8px rgba(0,0,0,0.15)',
                      }}>
                        {doc.firstName?.[0]}{doc.lastName?.[0]}
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                          Dr. {doc.firstName} {doc.lastName}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {doc.specialization}
                        </p>
                        {doc.availableTime && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                            <Clock size={10} color="#94a3b8" />
                            <span style={{ fontSize: '10px', color: '#94a3b8' }}>{doc.availableTime}</span>
                          </div>
                        )}
                      </div>
                      {/* Check */}
                      {isSelected && <CheckCircle size={18} color={color.main} style={{ flexShrink: 0 }} />}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Doctor Preview */}
          {selectedDoc && (
            <div style={{
              background: color.light,
              border: `1px solid ${color.border}`,
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: `linear-gradient(135deg, ${color.main}, ${color.main}bb)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '11px', fontWeight: 800, flexShrink: 0,
              }}>
                {selectedDoc.firstName?.[0]}{selectedDoc.lastName?.[0]}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Assigning to</p>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: color.main }}>
                  Dr. {selectedDoc.firstName} {selectedDoc.lastName}
                </p>
              </div>
              <CheckCircle size={16} color={color.main} style={{ marginLeft: 'auto' }} />
            </div>
          )}

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '10px', padding: '10px 14px',
              fontSize: '12px', color: '#dc2626',
            }}>
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '12px',
                borderRadius: '12px', border: '1.5px solid #e2e8f0',
                background: 'white', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600, color: '#475569',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={saving || !selectedDoctorId || deptDoctors.length === 0}
              style={{
                flex: 1, padding: '12px',
                borderRadius: '12px', border: 'none',
                background: saving || !selectedDoctorId
                  ? '#cbd5e1'
                  : `linear-gradient(135deg, ${color.main}, ${color.main}cc)`,
                cursor: saving || !selectedDoctorId ? 'not-allowed' : 'pointer',
                fontSize: '13px', fontWeight: 700, color: 'white',
                boxShadow: selectedDoctorId ? `0 4px 14px ${color.main}40` : 'none',
                transition: 'all 0.15s',
              }}
            >
              {saving ? 'Assigning…' : 'Confirm Assignment'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>,
    document.body
  );
}