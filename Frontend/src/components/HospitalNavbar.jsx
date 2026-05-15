import { useState, useEffect, useRef } from "react";

// ── Department data ──────────────────────────────────────────
const DEPARTMENTS = [
  {
    id: "cardiology",
    name: "Cardiology",
    icon: "❤️",
    tagline: "Advanced Cardiac Care",
    color: "#dc2626",
    bg: "#fef2f2",
    desc: "Comprehensive heart care with state-of-the-art cath labs, cardiac ICU, and electrophysiology services.",
    services: ["Angiography & Angioplasty", "Bypass Surgery (CABG)", "Pacemaker Implantation", "Heart Failure Management", "Echocardiography", "Cardiac Rehab"],
    doctors: ["Dr. Arvind Sharma (HOD)", "Dr. Meena Kulkarni", "Dr. Rajesh Patil"],
    timing: "Mon–Sat: 9 AM – 6 PM",
    emergency: true,
  },
  {
    id: "neurology",
    name: "Neurology",
    icon: "🧠",
    tagline: "Brain & Spine Excellence",
    color: "#7c3aed",
    bg: "#f5f3ff",
    desc: "Expert neurological care covering stroke management, epilepsy, movement disorders, and complex spine surgeries.",
    services: ["Stroke Unit (24×7)", "Epilepsy Management", "Deep Brain Stimulation", "Spine Surgery", "Neuro-rehabilitation", "Memory Clinic"],
    doctors: ["Dr. Suresh Nair (HOD)", "Dr. Priya Desai", "Dr. Anand Joshi"],
    timing: "Mon–Sat: 9 AM – 7 PM",
    emergency: true,
  },
  {
    id: "orthopaedics",
    name: "Orthopaedics",
    icon: "🦴",
    tagline: "Joint & Bone Specialists",
    color: "#0369a1",
    bg: "#f0f9ff",
    desc: "Full spectrum of orthopaedic care — from sports injuries to complex joint replacements and spinal corrections.",
    services: ["Joint Replacement", "Sports Medicine", "Arthroscopy", "Spine Surgery", "Trauma & Fractures", "Paediatric Ortho"],
    doctors: ["Dr. Vijay Kulkarni (HOD)", "Dr. Amita Shah", "Dr. Kiran More"],
    timing: "Mon–Sat: 9 AM – 5 PM",
    emergency: true,
  },
  {
    id: "oncology",
    name: "Oncology",
    icon: "🔬",
    tagline: "Comprehensive Cancer Care",
    color: "#0f766e",
    bg: "#f0fdfa",
    desc: "Maharashtra's leading cancer centre with proton therapy, surgical oncology, and a multidisciplinary tumour board.",
    services: ["Proton Therapy (First in Maharashtra)", "Chemotherapy", "Surgical Oncology", "Radiation Therapy", "Bone Marrow Transplant", "Palliative Care"],
    doctors: ["Dr. Lalita Rao (HOD)", "Dr. Deepak Sinha", "Dr. Nita Pawar"],
    timing: "Mon–Sat: 8 AM – 6 PM",
    emergency: false,
  },
  {
    id: "gynaecology",
    name: "Gynaecology",
    icon: "🌸",
    tagline: "Women's Health & Maternity",
    color: "#be185d",
    bg: "#fdf2f8",
    desc: "Dedicated women's health wing offering maternity care, high-risk pregnancy management, and minimal-access gynaecology.",
    services: ["High-Risk Pregnancy", "IVF & Fertility", "Laparoscopic Surgery", "Foetal Medicine", "Neonatal ICU", "Gynaecologic Oncology"],
    doctors: ["Dr. Sunita Mehta (HOD)", "Dr. Rekha Bhatt", "Dr. Pooja Verma"],
    timing: "Mon–Sat: 9 AM – 6 PM",
    emergency: true,
  },
  {
    id: "paediatrics",
    name: "Paediatrics",
    icon: "👶",
    tagline: "Child Health & Development",
    color: "#d97706",
    bg: "#fffbeb",
    desc: "Specialised paediatric care from newborn to adolescent, with dedicated PICU, NICU, and child development centre.",
    services: ["Neonatal ICU (NICU)", "Paediatric ICU (PICU)", "Child Development", "Paediatric Surgery", "Vaccination Clinic", "Growth & Nutrition"],
    doctors: ["Dr. Alok Gupta (HOD)", "Dr. Seema Jain", "Dr. Rohit Thakur"],
    timing: "Mon–Sun: 9 AM – 8 PM",
    emergency: true,
  },
];

// ── Nav links config ─────────────────────────────────────────
const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Us" },
  { id: "departments", label: "Centre of Excellence", hasMega: true },
  { id: "emergency", label: "Emergency", isRed: true },
];

// ── Emergency data ───────────────────────────────────────────
const EMERGENCY_CONTACTS = [
  { label: "Emergency Helpline", number: "1800-222-108", icon: "🚨", desc: "24×7 emergency response" },
  { label: "Ambulance", number: "102", icon: "🚑", desc: "Free ambulance service" },
  { label: "Blood Bank", number: "+91 20 2765 1001", icon: "🩸", desc: "24×7 blood availability" },
  { label: "ICU Enquiry", number: "+91 20 2765 1002", icon: "💊", desc: "Critical care updates" },
];

// ────────────────────────────────────────────────────────────
// DEPARTMENT PAGE
// ────────────────────────────────────────────────────────────
const DepartmentPage = ({ dept, onBack, onBookOpd }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Back bar */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e2e8f0",
        padding: "12px 40px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "1.5px solid #cbd5e1", borderRadius: "10px",
            padding: "7px 16px", fontSize: "13px", fontWeight: 700, color: "#475569",
            cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
          }}
        >
          ← Back
        </button>
        <span style={{ color: "#94a3b8", fontSize: "13px" }}>
          Home / Centre of Excellence / {dept.name}
        </span>
      </div>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${dept.color}dd 0%, ${dept.color}99 100%)`,
        padding: "56px 40px",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-60px", right: "-60px",
          width: "240px", height: "240px", borderRadius: "50%",
          background: "rgba(255,255,255,0.07)",
        }} />
        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "52px", marginBottom: "12px" }}>{dept.icon}</div>
          <h1 style={{ fontSize: "38px", fontWeight: 900, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
            {dept.name}
          </h1>
          <p style={{ fontSize: "18px", opacity: 0.9, margin: "0 0 16px", fontWeight: 500 }}>
            {dept.tagline}
          </p>
          <p style={{ fontSize: "15px", opacity: 0.85, maxWidth: "600px", lineHeight: 1.7, margin: "0 0 24px" }}>
            {dept.desc}
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={onBookOpd}
              style={{
                padding: "12px 28px", background: "#fff", color: dept.color,
                border: "none", borderRadius: "12px", fontWeight: 800, fontSize: "14px",
                cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              }}
            >
              Book Appointment →
            </button>
            {dept.emergency && (
              <div style={{
                padding: "12px 20px", background: "rgba(255,255,255,0.15)",
                borderRadius: "12px", fontSize: "13px", fontWeight: 700,
                display: "flex", alignItems: "center", gap: "6px",
                border: "1.5px solid rgba(255,255,255,0.3)",
              }}>
                🚨 Emergency Available 24×7
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 40px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

          {/* Services */}
          <div style={{
            background: "#fff", borderRadius: "18px", padding: "28px",
            border: "1.5px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}>
            <h3 style={{ margin: "0 0 18px", fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
              🩺 Our Services
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {dept.services.map((s) => (
                <div key={s} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 14px", background: dept.bg,
                  borderRadius: "10px", border: `1.5px solid ${dept.color}22`,
                }}>
                  <span style={{ color: dept.color, fontWeight: 900, fontSize: "14px" }}>✓</span>
                  <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#334155" }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Doctors + OPD info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{
              background: "#fff", borderRadius: "18px", padding: "28px",
              border: "1.5px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
                👨‍⚕️ Our Specialists
              </h3>
              {dept.doctors.map((doc) => (
                <div key={doc} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "10px 0", borderBottom: "1px solid #f1f5f9",
                }}>
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    background: dept.color + "22", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "16px", fontWeight: 800,
                    color: dept.color, flexShrink: 0,
                  }}>
                    {doc.split(" ")[1]?.[0] || "D"}
                  </div>
                  <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#334155" }}>{doc}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: dept.bg, borderRadius: "18px", padding: "24px",
              border: `1.5px solid ${dept.color}33`,
            }}>
              <h3 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>
                🕐 OPD Timings
              </h3>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: dept.color }}>{dept.timing}</p>
              <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#64748b" }}>
                Walk-in & prior appointment both accepted
              </p>

              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  onClick={onBookOpd}
                  style={{
                    width: "100%", padding: "11px", background: dept.color,
                    color: "#fff", border: "none", borderRadius: "11px",
                    fontSize: "13px", fontWeight: 800, cursor: "pointer",
                  }}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// EMERGENCY PAGE
// ────────────────────────────────────────────────────────────
const EmergencyPage = ({ onBack }) => (
  <div style={{ minHeight: "100vh", background: "#fff5f5", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
    {/* Back bar */}
    <div style={{
      background: "#fff",
      borderBottom: "1px solid #fecaca",
      padding: "12px 40px",
      display: "flex", alignItems: "center", gap: "12px",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 1px 6px rgba(220,38,38,0.08)",
    }}>
      <button
        onClick={onBack}
        style={{
          background: "none", border: "1.5px solid #fca5a5", borderRadius: "10px",
          padding: "7px 16px", fontSize: "13px", fontWeight: 700, color: "#dc2626",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
      <span style={{ color: "#f87171", fontSize: "13px" }}>Home / Emergency Services</span>
    </div>

    {/* Hero */}
    <div style={{
      background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
      padding: "56px 40px",
      color: "#fff",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "rgba(255,255,255,0.05)",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "60px", marginBottom: "12px" }}>🚨</div>
        <h1 style={{ fontSize: "40px", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-1px" }}>
          Emergency Services
        </h1>
        <p style={{ fontSize: "18px", opacity: 0.9, margin: "0 0 6px" }}>
          Available 24 Hours · 7 Days a Week · 365 Days a Year
        </p>
        <p style={{ fontSize: "14px", opacity: 0.7 }}>
          Ratnadeep Multi-Speciality Hospital, Pune
        </p>
      </div>
    </div>

    {/* Emergency Contacts */}
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 32px 60px" }}>
      <h2 style={{ textAlign: "center", margin: "0 0 28px", fontSize: "22px", fontWeight: 900, color: "#0f172a" }}>
        Emergency Contact Numbers
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "40px" }}>
        {EMERGENCY_CONTACTS.map((c) => (
          <a
            key={c.label}
            href={`tel:${c.number.replace(/\s/g, "")}`}
            style={{
              display: "flex", alignItems: "center", gap: "16px",
              background: "#fff", borderRadius: "18px", padding: "20px 22px",
              border: "2px solid #fecaca", textDecoration: "none",
              boxShadow: "0 4px 20px rgba(220,38,38,0.08)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "#dc2626"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "#fecaca"; }}
          >
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px",
              background: "#fff5f5", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "26px", flexShrink: 0,
              border: "1.5px solid #fecaca",
            }}>
              {c.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 3px", fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {c.label}
              </p>
              <p style={{ margin: "0 0 2px", fontSize: "22px", fontWeight: 900, color: "#dc2626", letterSpacing: "-0.5px" }}>
                {c.number}
              </p>
              <p style={{ margin: 0, fontSize: "11.5px", color: "#64748b" }}>{c.desc}</p>
            </div>
          </a>
        ))}
      </div>

      {/* What to do */}
      <div style={{
        background: "#fff", borderRadius: "20px", padding: "28px 32px",
        border: "1.5px solid #e2e8f0", marginBottom: "24px",
      }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "17px", fontWeight: 900, color: "#0f172a" }}>
          🏥 Our Emergency Facility
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            ["32-bed Emergency Department", "🚨"],
            ["Level I Trauma Centre", "🏥"],
            ["Dedicated Cardiac Emergency", "❤️"],
            ["Stroke Code — door to needle < 30 min", "🧠"],
            ["24×7 Intensivist in ICU", "💊"],
            ["Helipad for Air Ambulance", "🚁"],
          ].map(([text, icon]) => (
            <div key={text} style={{
              display: "flex", gap: "10px", alignItems: "flex-start",
              padding: "10px 14px", background: "#f8fafc", borderRadius: "10px",
            }}>
              <span style={{ fontSize: "18px" }}>{icon}</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155", lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Address */}
      <div style={{
        background: "linear-gradient(135deg, #fef2f2, #fff5f5)",
        borderRadius: "18px", padding: "22px 28px",
        border: "2px solid #fecaca",
        textAlign: "center",
      }}>
        <p style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          📍 Emergency Entrance
        </p>
        <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#991b1b" }}>
          Plot No. 42, MG Road, Shivaji Nagar, Pune – 411005
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#dc2626" }}>
          Separate emergency gate — open 24×7
        </p>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────
// ABOUT PAGE
// ────────────────────────────────────────────────────────────
const AboutPage = ({ onBack, onBookOpd }) => (
  <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
    <div style={{
      background: "#fff", borderBottom: "1px solid #e2e8f0",
      padding: "12px 40px", display: "flex", alignItems: "center", gap: "12px",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
    }}>
      <button
        onClick={onBack}
        style={{
          background: "none", border: "1.5px solid #cbd5e1", borderRadius: "10px",
          padding: "7px 16px", fontSize: "13px", fontWeight: 700, color: "#475569",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
      <span style={{ color: "#94a3b8", fontSize: "13px" }}>Home / About Us</span>
    </div>

    {/* Hero */}
    <div style={{
      background: "linear-gradient(135deg, #0a4d6e 0%, #1565a0 50%, #1e88e5 100%)",
      padding: "64px 40px",
      color: "#fff",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", bottom: "-80px", right: "-80px",
        width: "280px", height: "280px", borderRadius: "50%",
        background: "rgba(255,255,255,0.06)",
      }} />
      <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <p style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: 700, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          EST. 1992 · PUNE, MAHARASHTRA
        </p>
        <h1 style={{ fontSize: "40px", fontWeight: 900, margin: "0 0 16px", letterSpacing: "-1px" }}>
          About Ratnadeep Hospital
        </h1>
        <p style={{ fontSize: "16px", opacity: 0.85, lineHeight: 1.8, maxWidth: "600px", margin: 0 }}>
          Three decades of healing, innovation, and compassionate care for every patient who walks through our doors.
        </p>
      </div>
    </div>

    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 40px 60px" }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "40px" }}>
        {[
          { val: "32+", label: "Years of Service", icon: "🏥" },
          { val: "450", label: "Beds", icon: "🛏️" },
          { val: "1800+", label: "Specialists", icon: "👨‍⚕️" },
          { val: "2L+", label: "Patients/Year", icon: "❤️" },
        ].map(({ val, label, icon }) => (
          <div key={label} style={{
            background: "#fff", borderRadius: "16px", padding: "22px 16px",
            textAlign: "center", border: "1.5px solid #e2e8f0",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{icon}</div>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "#0a4d6e", marginBottom: "4px" }}>{val}</div>
            <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* History */}
      <div style={{
        background: "#fff", borderRadius: "20px", padding: "32px",
        border: "1.5px solid #e2e8f0", marginBottom: "24px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}>
        <h2 style={{ margin: "0 0 16px", fontSize: "22px", fontWeight: 900, color: "#0f172a" }}>
          Our History & Mission
        </h2>
        <p style={{ margin: "0 0 14px", fontSize: "15px", color: "#475569", lineHeight: 1.8 }}>
          Founded in 1992 by Dr. Arvind Ratnadeep, Ratnadeep Multi-Speciality Hospital began as a modest 40-bed facility in the heart of Pune with a singular mission — to make world-class healthcare accessible to every citizen. Over three decades, it has grown into one of Maharashtra's most trusted hospitals, now spanning 450 beds across three towers.
        </p>
        <p style={{ margin: "0 0 14px", fontSize: "15px", color: "#475569", lineHeight: 1.8 }}>
          The hospital pioneered minimally invasive cardiac surgery in the region in 2001, performed Pune's first successful liver transplant in 2008, and established Maharashtra's first dedicated Proton Therapy centre in 2019.
        </p>
        <p style={{ margin: 0, fontSize: "15px", color: "#475569", lineHeight: 1.8 }}>
          Accredited by NABH and ISO 9001:2015, Ratnadeep continues to invest in cutting-edge technology while preserving the human warmth that has defined the institution since its very first day.
        </p>
      </div>

      {/* Accreditations */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{
          background: "#f0f9ff", borderRadius: "18px", padding: "24px",
          border: "1.5px solid #bae6fd",
        }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 800, color: "#0a4d6e" }}>
            🏅 Accreditations
          </h3>
          {["NABH Accredited", "ISO 9001:2015", "JCI Standards Compliant", "NABL Certified Lab"].map((a) => (
            <div key={a} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", borderBottom: "1px solid #e0f2fe" }}>
              <span style={{ color: "#0a4d6e", fontWeight: 900 }}>✓</span>
              <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#334155" }}>{a}</span>
            </div>
          ))}
        </div>
        <div style={{
          background: "#f0fdf4", borderRadius: "18px", padding: "24px",
          border: "1.5px solid #bbf7d0",
        }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 800, color: "#166534" }}>
            🏆 Awards Won
          </h3>
          {["Best Hospital Maharashtra 2023", "Excellence in Cardiac Care 2022", "Top Oncology Centre 2021", "Patient Safety Award 2020"].map((a) => (
            <div key={a} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", borderBottom: "1px solid #dcfce7" }}>
              <span style={{ color: "#16a34a", fontWeight: 900 }}>★</span>
              <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#334155" }}>{a}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={onBookOpd}
          style={{
            padding: "14px 36px", background: "#0a4d6e", color: "#fff",
            border: "none", borderRadius: "14px", fontWeight: 800, fontSize: "15px",
            cursor: "pointer", boxShadow: "0 4px 16px rgba(10,77,110,0.3)",
          }}
        >
          Book an Appointment →
        </button>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────
// MAIN NAVBAR
// ────────────────────────────────────────────────────────────
const HospitalNavbar = ({ onBookOpd }) => {
  const [activePage, setActivePage] = useState(null);  // null | "about" | "emergency" | dept.id
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const megaRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // If a page is active, render it full-screen
  if (activePage === "about") {
    return <AboutPage onBack={() => setActivePage(null)} onBookOpd={onBookOpd} />;
  }
  if (activePage === "emergency") {
    return <EmergencyPage onBack={() => setActivePage(null)} />;
  }
  const activeDept = DEPARTMENTS.find((d) => d.id === activePage);
  if (activeDept) {
    return <DepartmentPage dept={activeDept} onBack={() => setActivePage(null)} onBookOpd={onBookOpd} />;
  }

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 1000,
      background: scrolled ? "rgba(255,255,255,0.97)" : "#fff",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: "1px solid #e2e8f0",
      boxShadow: scrolled ? "0 2px 20px rgba(10,77,110,0.12)" : "none",
      transition: "all 0.3s",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "68px",
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <div style={{
            width: "42px", height: "42px",
            background: "linear-gradient(135deg, #0a4d6e, #1565a0)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(10,77,110,0.3)",
          }}>
            <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 900, color: "#0a4d6e", lineHeight: 1.1 }}>
              Ratnadeep
            </div>
            <div style={{ fontSize: "10.5px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Multi-Speciality Hospital
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>

          {/* Home */}
          <button
            onClick={() => setActivePage(null)}
            style={{
              padding: "8px 16px", background: "none", border: "none",
              fontSize: "13.5px", fontWeight: 700, color: "#475569",
              cursor: "pointer", borderRadius: "10px",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#0a4d6e"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#475569"; }}
          >
            Home
          </button>

          {/* About */}
          <button
            onClick={() => setActivePage("about")}
            style={{
              padding: "8px 16px", background: "none", border: "none",
              fontSize: "13.5px", fontWeight: 700, color: "#475569",
              cursor: "pointer", borderRadius: "10px",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#0a4d6e"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#475569"; }}
          >
            About Us
          </button>

          {/* Centre of Excellence — Mega Menu */}
          <div ref={megaRef} style={{ position: "relative" }}>
            <button
              onClick={() => setMegaOpen((p) => !p)}
              style={{
                padding: "8px 16px", background: megaOpen ? "#eff6ff" : "none",
                border: "none", fontSize: "13.5px", fontWeight: 700,
                color: megaOpen ? "#0a4d6e" : "#475569",
                cursor: "pointer", borderRadius: "10px",
                display: "flex", alignItems: "center", gap: "5px",
                transition: "all 0.15s",
              }}
            >
              Centre of Excellence
              <svg
                width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ transform: megaOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Mega dropdown */}
            {megaOpen && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 12px)",
                left: "50%",
                transform: "translateX(-50%)",
                width: "640px",
                background: "#fff",
                borderRadius: "20px",
                border: "1.5px solid #e2e8f0",
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                padding: "20px",
                zIndex: 9999,
                animation: "fadeInDown 0.18s ease",
              }}>
                <style>{`@keyframes fadeInDown { from { opacity:0; transform:translateX(-50%) translateY(-8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
                <p style={{ margin: "0 0 14px", fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Our Specialities
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                  {DEPARTMENTS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => { setActivePage(d.id); setMegaOpen(false); }}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "12px 14px", background: "#f8fafc",
                        border: "1.5px solid #e2e8f0", borderRadius: "12px",
                        cursor: "pointer", textAlign: "left",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = d.bg;
                        e.currentTarget.style.borderColor = d.color + "55";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "#f8fafc";
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.transform = "";
                      }}
                    >
                      <span style={{ fontSize: "22px" }}>{d.icon}</span>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>{d.name}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "1px" }}>{d.tagline}</div>
                      </div>
                      {d.emergency && (
                        <div style={{
                          marginLeft: "auto", width: "8px", height: "8px",
                          borderRadius: "50%", background: "#22c55e", flexShrink: 0,
                        }} title="24×7 Emergency" />
                      )}
                    </button>
                  ))}
                </div>
                <div style={{
                  marginTop: "14px", paddingTop: "12px",
                  borderTop: "1px solid #f1f5f9",
                  display: "flex", alignItems: "center", gap: "6px",
                  fontSize: "11px", color: "#94a3b8",
                }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
                  Green dot indicates 24×7 emergency services available
                </div>
              </div>
            )}
          </div>

          {/* Emergency */}
          <button
            onClick={() => setActivePage("emergency")}
            style={{
              padding: "8px 16px", background: "none", border: "none",
              fontSize: "13.5px", fontWeight: 700, color: "#dc2626",
              cursor: "pointer", borderRadius: "10px",
              display: "flex", alignItems: "center", gap: "5px",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
          >
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            Emergency
          </button>
        </div>

        {/* Right CTAs */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          {/* Quick emergency phone */}
          <a
            href="tel:1800222108"
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 14px", background: "#fef2f2",
              border: "1.5px solid #fecaca", borderRadius: "10px",
              fontSize: "12.5px", fontWeight: 700, color: "#dc2626",
              textDecoration: "none", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fef2f2"; }}
          >
            🚨 1800-222-108
          </a>

          <button
            onClick={onBookOpd}
            style={{
              padding: "9px 20px",
              background: "linear-gradient(135deg, #0a4d6e, #1565a0)",
              color: "#fff", border: "none", borderRadius: "11px",
              fontSize: "13px", fontWeight: 800, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(10,77,110,0.3)",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(10,77,110,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(10,77,110,0.3)"; }}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </nav>
  );
};

export default HospitalNavbar;
export { DEPARTMENTS, EMERGENCY_CONTACTS };