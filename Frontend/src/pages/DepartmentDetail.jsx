// src/pages/DepartmentDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { DEPARTMENTS } from "../data/departments";
import HospitalNavbar from "../components/HospitalNavbar";
import Footer from "../components/Footer";

// ── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ initials, color, size = 56 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.28,
    background: `${color}18`,
    border: `2px solid ${color}35`,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
    fontWeight: 800, fontSize: size * 0.3, color,
    letterSpacing: "0.5px",
    fontFamily: "'Playfair Display', serif",
  }}>
    {initials}
  </div>
);

// ── Doctor Card ───────────────────────────────────────────────────────────────
const DoctorCard = ({ doctor, color, index }) => (
  <div style={{
    background: "#fff",
    borderRadius: 18,
    border: "1px solid #e8edf2",
    overflow: "hidden",
    display: "flex",
    boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
    transition: "box-shadow 0.2s, transform 0.2s",
  }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "none"; }}
  >
    {/* Left color strip with number */}
    <div style={{
      width: 56, flexShrink: 0,
      background: `${color}10`,
      borderRight: `3px solid ${color}`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 4,
    }}>
      <span style={{
        fontSize: 11, fontWeight: 800, color,
        fontFamily: "'Playfair Display', serif",
        opacity: 0.5,
      }}>
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>

    {/* Main content */}
    <div style={{ padding: "22px 24px", flex: 1, display: "flex", gap: 18, alignItems: "flex-start" }}>
      <Avatar initials={doctor.initials} color={color} />

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <p style={{
              fontSize: 17, fontWeight: 800, color: "#0f172a",
              margin: "0 0 3px", letterSpacing: "-0.01em",
              fontFamily: "'Playfair Display', Georgia, serif",
            }}>
              {doctor.name}
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, color, margin: "0 0 4px" }}>
              {doctor.designation}
            </p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, fontWeight: 500 }}>
              {doctor.qualification}
            </p>
          </div>
        </div>

        {/* Schedule pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          marginTop: 14, padding: "7px 14px",
          background: `${color}0e`,
          border: `1px solid ${color}25`,
          borderRadius: 10,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <span style={{ fontSize: 12.5, fontWeight: 700, color, letterSpacing: "0.01em" }}>
            {doctor.visiting}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dept = DEPARTMENTS.find((d) => d.id === id);

  if (!dept) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8f9fb", fontFamily: "'DM Sans', sans-serif" }}>
        <p style={{ fontSize: 56, marginBottom: 16 }}>🏥</p>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 8px", fontFamily: "'Playfair Display', serif" }}>
          Department Not Found
        </h2>
        <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 24 }}>This department doesn't exist.</p>
        <button onClick={() => navigate("/departments")} style={{
          padding: "11px 24px", borderRadius: 12, border: "none",
          background: "#0b2545", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>
          ← Back to Departments
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'DM Sans', sans-serif" }}>
      <HospitalNavbar />

      {/* ── Hero ── */}
      <div style={{
        background: `linear-gradient(135deg, #0b1f3a 0%, #0f2d50 100%)`,
        padding: "64px 24px 96px",
        position: "relative", overflow: "hidden",
      }}>
        {/* dot grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px", pointerEvents: "none",
        }} />
        {/* dept color glow blob */}
        <div style={{
          position: "absolute", right: -100, top: -100,
          width: 500, height: 500, borderRadius: "50%",
          background: `${dept.color}18`,
          filter: "blur(60px)", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 880, margin: "0 auto", position: "relative" }}>
          {/* Back button */}
          <button onClick={() => navigate(-1)} style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)",
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8, padding: "7px 14px", cursor: "pointer", marginBottom: 36,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
          >
            ← Back
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
            {/* Icon bubble */}
            <div style={{
              width: 80, height: 80, borderRadius: 22, flexShrink: 0,
              background: `${dept.color}22`,
              border: `2px solid ${dept.color}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 38,
            }}>
              {dept.icon}
            </div>

            <div style={{ flex: 1 }}>
              {/* Tagline pill */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: `${dept.color}20`, border: `1px solid ${dept.color}45`,
                borderRadius: 20, padding: "5px 14px", marginBottom: 14,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: dept.color, display: "inline-block" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: dept.color }}>
                  {dept.tagline}
                </span>
              </div>

              <h1 style={{
                fontSize: 38, fontWeight: 800, color: "#fff",
                margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.15,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}>
                Department of {dept.name}
              </h1>
              <p style={{ fontSize: 15, color: "rgba(190,215,240,0.7)", lineHeight: 1.75, margin: 0, maxWidth: 640 }}>
                {dept.about}
              </p>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{
            display: "flex", gap: 24, marginTop: 36, flexWrap: "wrap",
          }}>
            {[
              { label: "Specialists", value: dept.doctors.length },
              { label: "OPD Days", value: "Mon – Sat" },
              { label: "Emergency", value: "24 × 7" },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 18px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 10,
              }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: "'Playfair Display', serif" }}>{value}</span>
                <span style={{ fontSize: 11, color: "rgba(180,210,240,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Doctor cards — overlap hero ── */}
      <div style={{ maxWidth: 880, margin: "-44px auto 0", padding: "0 24px 60px", position: "relative", zIndex: 2 }}>

        {/* Section header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: dept.color,
            }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b" }}>
              Our Specialists
            </span>
          </div>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          <span style={{
            fontSize: 11, fontWeight: 600, color: dept.color,
            background: `${dept.color}15`, borderRadius: 20, padding: "3px 10px",
            border: `1px solid ${dept.color}30`,
          }}>
            {dept.doctors.length} doctors
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {dept.doctors.map((doctor, i) => (
            <DoctorCard key={doctor.name} doctor={doctor} color={dept.color} index={i} />
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{
          marginTop: 36,
          background: `linear-gradient(135deg, #0b1f3a, #0f2d50)`,
          borderRadius: 18, padding: "28px 32px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 20,
          position: "relative", overflow: "hidden",
          border: `1px solid ${dept.color}30`,
        }}>
          <div style={{
            position: "absolute", right: -40, top: -40,
            width: 200, height: 200, borderRadius: "50%",
            background: `${dept.color}12`, pointerEvents: "none",
          }} />
          <div style={{ position: "relative" }}>
            <p style={{
              fontSize: 20, fontWeight: 800, color: "#fff",
              margin: "0 0 6px", fontFamily: "'Playfair Display', serif",
            }}>
              Book an Appointment
            </p>
            <p style={{ fontSize: 13.5, color: "rgba(190,215,240,0.6)", margin: 0 }}>
              Consult our {dept.name} specialists — OPD open Mon–Sat, 8 AM–8 PM.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", position: "relative" }}>
            <a href="tel:+912027654321" style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "11px 22px", borderRadius: 10,
              background: dept.color, border: "none",
              fontSize: 13, fontWeight: 700, color: "#fff",
              textDecoration: "none", whiteSpace: "nowrap",
            }}>
              📞 Call OPD Desk
            </a>
            <button onClick={() => navigate("/departments")} style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "11px 22px", borderRadius: 10,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
              fontSize: 13, fontWeight: 700, color: "#fff",
              cursor: "pointer", whiteSpace: "nowrap",
            }}>
              ← All Departments
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DepartmentDetail;