import { useState, useEffect } from 'react';
import api from '../api/axios';
import HospitalNavbar from '../components/HospitalNavbar';
import Footer from '../components/Footer';
import { Stethoscope } from 'lucide-react';

const AVATAR_PALETTES = [
  ['#134e4a','#115e59'],['#1e3a5f','#1e40af'],['#3b0764','#6b21a8'],
  ['#450a0a','#991b1b'],['#064e3b','#065f46'],['#1c1917','#44403c'],
];

const Avatar = ({ doctor, size = 56 }) => {
  const idx = (doctor.firstName?.charCodeAt(0) ?? 0) % AVATAR_PALETTES.length;
  const [g1, g2] = AVATAR_PALETTES[idx];
  const initials = `${doctor.firstName?.[0]??''}${doctor.lastName?.[0]??''}`.toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `linear-gradient(135deg, ${g1}, ${g2})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: 18, fontWeight: 700,
    }}>{initials}</div>
  );
};

const PublicDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    api.get('/doctors').then(r => setDoctors(r.data)).catch(console.error);
  }, []);

  return (
    <>
      <HospitalNavbar />

      {/* Hero */}
      <div style={{ background: '#0f4c81', padding: '64px 24px', textAlign: 'center', color: '#fff' }}>
        <p style={{ fontSize: 48, marginBottom: 12 }}>🩺</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 900, marginBottom: 8 }}>
          Our Doctors
        </h1>
        <p style={{ color: '#bfdbfe', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
          Meet our team of experienced specialists dedicated to your health.
        </p>
      </div>

      {/* Grid */}
      <div style={{ background: '#f8f9fb', minHeight: '60vh', padding: '48px 24px' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20
        }}>
          {doctors.map(d => (
            <div key={d.id} style={{
              background: '#fff', borderRadius: 16, padding: '28px 20px',
              textAlign: 'center', border: '1px solid #f1f5f9',
              boxShadow: '0 1px 6px rgba(0,0,0,.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                <Avatar doctor={d} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                Dr. {d.firstName} {d.lastName}
              </div>
              <div style={{ fontSize: 12, color: '#0f4c81', fontWeight: 600, marginTop: 4 }}>
                {d.specialization}
              </div>
            </div>
          ))}
        </div>

        {doctors.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
            <Stethoscope style={{ width: 40, height: 40, margin: '0 auto 12px' }} />
            <p>No doctors found.</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default PublicDoctors;