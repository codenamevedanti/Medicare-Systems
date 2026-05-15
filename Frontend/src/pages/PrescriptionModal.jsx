import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Pill, Plus, Trash2, Save, FileText } from 'lucide-react';
import api from '../api/axios';

const emptyItem = () => ({ medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' });

export default function PrescriptionModal({ appointment, onClose, onSaved }) {
  const token = localStorage.getItem('adminToken');
  const [items, setItems]   = useState([emptyItem()]);
  const [notes, setNotes]   = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    api.get(`/prescriptions/appointment/${appointment.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => {
      if (r.data) {
        setNotes(r.data.notes || '');
        if (Array.isArray(r.data.items) && r.data.items.length > 0) {
          setItems(r.data.items.map(i => ({
            medicineName: i.medicineName || '',
            dosage:       i.dosage       || '',
            frequency:    i.frequency    || '',
            duration:     i.duration     || '',
            instructions: i.instructions || '',
          })));
        }
      }
    }).catch(() => {});
  }, []);

  const addRow    = () => setItems(p => [...p, emptyItem()]);
  const removeRow = (idx) => setItems(p => p.filter((_, i) => i !== idx));
  const updateRow = (idx, field, val) =>
    setItems(p => p.map((row, i) => i === idx ? { ...row, [field]: val } : row));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await api.post(`/prescriptions/appointment/${appointment.id}`,
        { notes, items },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save prescription.');
    } finally {
      setSaving(false);
    }
  };

  const patientLabel = appointment.patientName
    || `${appointment.patient?.firstName ?? ''} ${appointment.patient?.lastName ?? ''}`.trim()
    || 'Patient';

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
        background: '#ffffff', borderRadius: '24px',
        width: '100%', maxWidth: '660px',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        animation: 'slideUp 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #3b0764, #6d28d9)',
          padding: '20px 24px', borderRadius: '24px 24px 0 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '14px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Pill size={22} color="white" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 800, fontSize: '16px', color: '#ffffff' }}>
                Prescription / Rx
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>
                {patientLabel} · Appt #{appointment.id}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: '34px', height: '34px', borderRadius: '10px',
            border: 'none', background: 'rgba(255,255,255,0.15)',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white',
          }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>

          {/* Medicine rows */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Medicines
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map((row, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc', borderRadius: '14px',
                  padding: '14px', border: '1.5px solid #e2e8f0',
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                  gap: '10px', alignItems: 'center',
                }}>
                  {[
                    { field: 'medicineName', placeholder: 'Medicine name' },
                    { field: 'dosage',       placeholder: 'Dosage (e.g. 500mg)' },
                    { field: 'frequency',    placeholder: 'Frequency' },
                    { field: 'duration',     placeholder: 'Duration' },
                  ].map(({ field, placeholder }) => (
                    <input
                      key={field}
                      value={row[field]}
                      onChange={e => updateRow(idx, field, e.target.value)}
                      placeholder={placeholder}
                      style={{
                        border: '1px solid #e2e8f0', borderRadius: '8px',
                        padding: '8px 10px', fontSize: '13px', color: '#1e293b',
                        background: 'white', outline: 'none', fontFamily: 'inherit',
                      }}
                    />
                  ))}
                  <button
                    onClick={() => removeRow(idx)}
                    disabled={items.length === 1}
                    style={{
                      width: '30px', height: '30px', borderRadius: '8px',
                      border: 'none', background: '#fef2f2', cursor: items.length === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#ef4444', opacity: items.length === 1 ? 0.4 : 1,
                    }}
                  >
                    <Trash2 size={13} />
                  </button>

                  {/* Instructions row */}
                  <input
                    value={row.instructions}
                    onChange={e => updateRow(idx, 'instructions', e.target.value)}
                    placeholder="Instructions (e.g. After meals)"
                    style={{
                      gridColumn: '1 / -1',
                      border: '1px solid #e2e8f0', borderRadius: '8px',
                      padding: '8px 10px', fontSize: '12px', color: '#475569',
                      background: 'white', outline: 'none', fontFamily: 'inherit',
                    }}
                  />
                </div>
              ))}
            </div>

            <button onClick={addRow} style={{
              marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '9px', border: '1.5px dashed #c4b5fd',
              background: '#f5f3ff', color: '#6d28d9', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <Plus size={13} /> Add Medicine
            </button>
          </div>

          {/* Notes */}
          <div style={{
            background: '#f8fafc', borderRadius: '14px',
            padding: '14px', border: '1.5px solid #e2e8f0', marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '7px',
                background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileText size={13} color="#6d28d9" />
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Doctor's Notes
              </span>
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Additional instructions, dietary advice, follow-up notes..."
              style={{
                width: '100%', border: 'none', background: 'transparent',
                fontSize: '13px', color: '#475569', resize: 'none',
                outline: 'none', lineHeight: 1.6, fontFamily: 'inherit', boxSizing: 'border-box',
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
              background: saving ? '#94a3b8' : 'linear-gradient(135deg, #3b0764, #6d28d9)',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '13px', fontWeight: 700, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: saving ? 'none' : '0 4px 14px rgba(109,40,217,0.35)',
            }}>
              <Save size={15} />
              {saving ? 'Saving…' : 'Save Prescription'}
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