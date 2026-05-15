import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, FlaskConical, Save, Stethoscope, Plus, Trash2 } from 'lucide-react';
import api from '../api/axios';

const inputCls = `
  w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm
  focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400
  bg-white transition-all
`;

const LAB_TESTS = [
  // Blood Tests
  'Complete Blood Count (CBC)', 'Blood Glucose (Fasting)', 'Blood Glucose (PP)',
  'HbA1c', 'Lipid Profile', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)',
  'Thyroid Profile (T3/T4/TSH)', 'ESR', 'CRP', 'HBsAg', 'HIV Test',
  'Blood Culture', 'Dengue NS1 Antigen', 'Malaria Antigen Test',
  'Vitamin D', 'Vitamin B12', 'Iron Studies', 'Electrolytes (Na/K/Cl)',

  // Urine Tests
  'Urine Routine', 'Urine Culture', 'Urine Pregnancy Test',

  // ECG / Cardiac
  'ECG', 'Echocardiography (Echo)', 'Stress Test (TMT)',

  // X-Ray
  'X-Ray Chest', 'X-Ray Spine (Cervical)', 'X-Ray Spine (Lumbar)',
  'X-Ray Spine (Thoracic)', 'X-Ray Leg (Femur)', 'X-Ray Leg (Tibia/Fibula)',
  'X-Ray Knee', 'X-Ray Ankle', 'X-Ray Foot', 'X-Ray Hip',
  'X-Ray Shoulder', 'X-Ray Elbow', 'X-Ray Wrist', 'X-Ray Hand',
  'X-Ray Skull', 'X-Ray Abdomen',

  // Ultrasound
  'Ultrasound Abdomen', 'Ultrasound Pelvis', 'Ultrasound Thyroid',
  'Ultrasound Kidney', 'Ultrasound Liver', 'Doppler Study',

  // CT Scan
  'CT Scan Brain', 'CT Scan Chest', 'CT Scan Abdomen', 'CT Scan Spine', 'CT Angiography',

  // MRI
  'MRI Brain', 'MRI Spine (Cervical)', 'MRI Spine (Lumbar)',
  'MRI Knee', 'MRI Shoulder', 'MRI Abdomen',

  // Cultures / Microbiology
  'Sputum Culture', 'Throat Swab Culture', 'Wound Swab Culture',

  // Other
  'Pulmonary Function Test (PFT)', 'Bone Density (DEXA)',
  'Pap Smear', 'Biopsy', 'COVID-19 RT-PCR',
];

const emptyTest = { testName: '', result: '', normalRange: '', unit: '', remarks: '' };

export default function LabReportModal({ appointment, onClose, onSaved }) {
  const token = localStorage.getItem('adminToken');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    reportDate: new Date().toISOString().split('T')[0],
    labName: 'Hospital Lab',
    status: 'PENDING',
    summary: '',
    tests: [{ ...emptyTest }],
  });

  const doctorName = appointment.doctor
    ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
    : 'Doctor';
  const patientName = `${appointment.patient?.firstName} ${appointment.patient?.lastName}`;

  const updateTest = (i, field, value) => {
    const tests = [...form.tests];
    tests[i] = { ...tests[i], [field]: value };
    setForm(f => ({ ...f, tests }));
  };

  const addTest = () => setForm(f => ({ ...f, tests: [...f.tests, { ...emptyTest }] }));
  const removeTest = (i) => {
    if (form.tests.length === 1) return;
    setForm(f => ({ ...f, tests: f.tests.filter((_, idx) => idx !== i) }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await api.post(
        `/lab-reports/appointment/${appointment.id}`,
        {
          ...form,
          patientId: appointment.patient?.id,
          doctorId: appointment.doctor?.id,
          doctorName,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save lab report.');
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(2,8,23,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#fff', borderRadius: '24px', width: '100%',
        maxWidth: '620px', maxHeight: '92vh', overflowY: 'auto',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        animation: 'labSlide 0.22s cubic-bezier(0.34,1.56,0.64,1)',
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f4c51, #0d9488)',
          padding: '20px 24px', borderRadius: '24px 24px 0 0',
          position: 'sticky', top: 0, zIndex: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '14px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FlaskConical size={22} color="white" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 800, fontSize: '16px', color: '#fff' }}>
                Lab Report
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>
                {patientName} · Appt #{appointment.id}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: '34px', height: '34px', borderRadius: '10px',
            border: 'none', background: 'rgba(255,255,255,0.1)',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'rgba(255,255,255,0.7)',
          }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>

          {/* Doctor + Date + Lab Info */}
          <div style={{
            background: '#f0fdfa', borderRadius: '14px', padding: '14px 16px',
            border: '1.5px solid #99f6e4', marginBottom: '20px',
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px',
          }}>
            <div>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Doctor</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Stethoscope size={13} color="#0d9488" />
                <span style={{ fontWeight: 700, fontSize: '12px', color: '#1e293b' }}>{doctorName}</span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Report Date</p>
              <input
                type="date"
                value={form.reportDate}
                onChange={e => setForm(f => ({ ...f, reportDate: e.target.value }))}
                className={inputCls}
                style={{ padding: '5px 8px', fontSize: '12px' }}
              />
            </div>
            <div>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Status</p>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className={inputCls}
                style={{ padding: '5px 8px', fontSize: '12px' }}
              >
                <option value="PENDING">Pending</option>
                <option value="READY">Ready</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>
          </div>

          {/* Lab Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
              Lab Name
            </label>
            <input
              type="text"
              value={form.labName}
              onChange={e => setForm(f => ({ ...f, labName: e.target.value }))}
              placeholder="e.g. Hospital Lab, PathCare"
              className={inputCls}
            />
          </div>

          {/* Test Entries */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Tests / Results
              </label>
              <button onClick={addTest} style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '11px', fontWeight: 700, color: '#0d9488',
                background: '#f0fdfa', border: 'none', borderRadius: '8px',
                padding: '5px 10px', cursor: 'pointer',
              }}>
                <Plus size={12} /> Add Test
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {form.tests.map((test, i) => (
                <div key={i} style={{
                  background: '#f8fafc', borderRadius: '14px', padding: '14px',
                  border: '1.5px solid #e2e8f0', position: 'relative',
                }}>
                  {form.tests.length > 1 && (
                    <button onClick={() => removeTest(i)} style={{
                      position: 'absolute', top: '10px', right: '10px',
                      width: '24px', height: '24px', borderRadius: '6px',
                      border: 'none', background: '#fee2e2', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Trash2 size={12} color="#ef4444" />
                    </button>
                  )}

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Test Name *</label>
                    <input
                      list={`tests-${i}`}
                      type="text"
                      value={test.testName}
                      onChange={e => updateTest(i, 'testName', e.target.value)}
                      placeholder="e.g. Complete Blood Count"
                      className={inputCls}
                      style={{ fontSize: '13px' }}
                    />
                    <datalist id={`tests-${i}`}>
                      {LAB_TESTS.map(t => <option key={t} value={t} />)}
                    </datalist>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Result</label>
                      <input
                        type="text"
                        value={test.result}
                        onChange={e => updateTest(i, 'result', e.target.value)}
                        placeholder="e.g. 12.5"
                        className={inputCls}
                        style={{ fontSize: '13px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Normal Range</label>
                      <input
                        type="text"
                        value={test.normalRange}
                        onChange={e => updateTest(i, 'normalRange', e.target.value)}
                        placeholder="e.g. 11–16"
                        className={inputCls}
                        style={{ fontSize: '13px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Unit</label>
                      <input
                        type="text"
                        value={test.unit}
                        onChange={e => updateTest(i, 'unit', e.target.value)}
                        placeholder="e.g. g/dL"
                        className={inputCls}
                        style={{ fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Remarks</label>
                    <input
                      type="text"
                      value={test.remarks}
                      onChange={e => updateTest(i, 'remarks', e.target.value)}
                      placeholder="e.g. Slightly low, monitor"
                      className={inputCls}
                      style={{ fontSize: '13px' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
              Summary / Remarks
            </label>
            <textarea
              rows={2}
              value={form.summary}
              onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
              placeholder="Overall summary or notes..."
              className={inputCls}
              style={{ resize: 'none', lineHeight: 1.5 }}
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
              background: saving ? '#94a3b8' : 'linear-gradient(135deg, #0f4c51, #0d9488)',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '13px', fontWeight: 700, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: saving ? 'none' : '0 4px 14px rgba(13,148,136,0.35)',
            }}>
              <Save size={15} />
              {saving ? 'Saving…' : 'Save Lab Report'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes labSlide {
          from { opacity:0; transform:translateY(20px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}