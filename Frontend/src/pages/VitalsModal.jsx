import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Activity, Heart, Thermometer, Droplets, Wind, Scale, Ruler, FileText, Save } from 'lucide-react';
import api from '../api/axios';

export default function VitalsModal({ appointment, onClose, onSaved }) {
  const token = localStorage.getItem('adminToken');
  const [form, setForm] = useState({
    bloodPressure: '', bloodSugar: '', temperature: '',
    pulse: '', spo2: '', weight: '', height: '', notes: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/vitals/appointment/${appointment.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => {
      if (r.data) {
        const v = r.data;
        setForm({
          bloodPressure: v.bloodPressure || '',
          bloodSugar:    v.bloodSugar    || '',
          temperature:   v.temperature   || '',
          pulse:         v.pulse         || '',
          spo2:          v.spo2          || '',
          weight:        v.weight        || '',
          height:        v.height        || '',
          notes:         v.notes         || '',
        });
      }
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await api.post(`/vitals/appointment/${appointment.id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vitals.');
    } finally {
      setSaving(false);
    }
  };

  const vitalFields = [
    { key: 'bloodPressure', label: 'Blood Pressure', unit: 'mmHg', placeholder: '120/80',  icon: Heart,        color: '#ef4444', bg: '#fef2f2' },
    { key: 'bloodSugar',    label: 'Blood Sugar',    unit: 'mg/dL', placeholder: '95',      icon: Droplets,     color: '#f59e0b', bg: '#fffbeb' },
    { key: 'temperature',   label: 'Temperature',    unit: '°F',    placeholder: '98.6',    icon: Thermometer,  color: '#f97316', bg: '#fff7ed' },
    { key: 'pulse',         label: 'Pulse Rate',     unit: 'bpm',   placeholder: '72',      icon: Activity,     color: '#ec4899', bg: '#fdf2f8' },
    { key: 'spo2',          label: 'SpO2',           unit: '%',     placeholder: '98',      icon: Wind,         color: '#06b6d4', bg: '#ecfeff' },
    { key: 'weight',        label: 'Weight',         unit: 'kg',    placeholder: '70',      icon: Scale,        color: '#8b5cf6', bg: '#f5f3ff' },
    { key: 'height',        label: 'Height',         unit: 'cm',    placeholder: '170',     icon: Ruler,        color: '#10b981', bg: '#ecfdf5' },
  ];

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(2, 8, 23, 0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        animation: 'slideUp 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          padding: '20px 24px',
          borderRadius: '24px 24px 0 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
            }}>
              <Activity size={22} color="white" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 800, fontSize: '16px', color: '#ffffff' }}>
                Patient Vitals
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                {appointment.patient?.firstName} {appointment.patient?.lastName} · Appt #{appointment.id}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: '34px', height: '34px', borderRadius: '10px',
            border: 'none', background: 'rgba(255,255,255,0.1)',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#94a3b8',
          }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>

          {/* Vitals Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            {vitalFields.map(({ key, label, unit, placeholder, icon: Icon, color, bg }) => (
              <div key={key} style={{
                background: '#f8fafc', borderRadius: '14px',
                padding: '14px', border: '1.5px solid #e2e8f0',
                cursor: 'text',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '7px',
                    background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={13} color={color} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{
                      flex: 1, border: 'none', background: 'transparent',
                      fontSize: '20px', fontWeight: 800, color: '#1e293b',
                      outline: 'none', width: '100%',
                    }}
                  />
                  <span style={{
                    fontSize: '10px', fontWeight: 700, color: color,
                    background: bg, padding: '3px 7px',
                    borderRadius: '6px', whiteSpace: 'nowrap',
                  }}>
                    {unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div style={{
            background: '#f8fafc', borderRadius: '14px',
            padding: '14px', border: '1.5px solid #e2e8f0',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '7px',
                background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileText size={13} color="#6366f1" />
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Clinical Notes
              </span>
            </div>
            <textarea
              rows={3}
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="Any clinical observations, symptoms, or additional remarks..."
              style={{
                width: '100%', border: 'none', background: 'transparent',
                fontSize: '13px', color: '#475569', resize: 'none',
                outline: 'none', lineHeight: 1.6, fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '10px', padding: '10px 14px',
              fontSize: '12px', color: '#dc2626', marginBottom: '14px',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '13px', borderRadius: '12px',
              border: '1.5px solid #e2e8f0', background: 'white',
              cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#475569',
            }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} style={{
              flex: 2, padding: '13px', borderRadius: '12px', border: 'none',
              background: saving ? '#94a3b8' : 'linear-gradient(135deg, #0f172a, #1e3a5f)',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '13px', fontWeight: 700, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: saving ? 'none' : '0 4px 14px rgba(15,23,42,0.3)',
            }}>
              <Save size={15} />
              {saving ? 'Saving…' : 'Save Vitals'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}