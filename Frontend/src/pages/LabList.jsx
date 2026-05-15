// src/pages/LabList.jsx
import { useNavigate } from "react-router-dom";
import LabCard from "../components/LabCard";
import { LABS } from "../data/labs";

const LabList = () => {
  const navigate = useNavigate();

  const stats = [
    { value: `${LABS.length}`, label: "Diagnostic Labs", icon: "🏥" },
    { value: "24/7", label: "Emergency Services", icon: "⚡" },
    { value: "100+", label: "Tests Available", icon: "🔬" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: "linear-gradient(135deg, #0b2545 0%, #134074 60%, #13507a 100%)",
        padding: "60px 52px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }} />
        {/* Decorative circle */}
        <div style={{
          position: "absolute", right: -80, top: -80,
          width: 400, height: 400, borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: 60, top: 40,
          width: 200, height: 200, borderRadius: "50%",
          background: "rgba(99,179,237,0.07)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.55)",
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8, padding: "7px 14px", cursor: "pointer", marginBottom: 36,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
          >
            ← Back to Home
          </button>

          {/* Label */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.3)",
            borderRadius: 20, padding: "5px 14px", marginBottom: 18,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#eab308", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fde047" }}>
              Diagnostic Services
            </span>
          </div>

          <h1 style={{
            fontSize: 42, fontWeight: 800, color: "#fff",
            margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.15,
            fontFamily: "'Playfair Display', Georgia, serif",
          }}>
            Our Diagnostic Labs
          </h1>
          <p style={{ fontSize: 15, color: "rgba(180,210,235,0.7)", maxWidth: 520, margin: 0, lineHeight: 1.7 }}>
            State-of-the-art facilities equipped with latest technology, staffed by experienced specialists committed to accurate, timely results.
          </p>
        </div>
      </div>

      {/* ── Stats strip — floats over the hero bottom ── */}
      <div style={{ maxWidth: 900, margin: "-36px auto 0", padding: "0 52px", position: "relative", zIndex: 2 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 40px rgba(11,37,69,0.12)",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
        }}>
          {stats.map(({ value, label, icon }, i) => (
            <div key={label} style={{
              padding: "24px 28px",
              borderRight: i < stats.length - 1 ? "1px solid #e2e8f0" : "none",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                background: "linear-gradient(135deg, #e8f0fe, #dbeafe)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
              }}>
                {icon}
              </div>
              <div>
                <p style={{ fontSize: 26, fontWeight: 800, color: "#0b2545", margin: 0, letterSpacing: "-0.02em", fontFamily: "'Playfair Display', serif" }}>
                  {value}
                </p>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "2px 0 0" }}>
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Lab cards ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 52px 20px" }}>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b" }}>
            All Laboratories
          </span>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          <span style={{
            fontSize: 11, fontWeight: 600, color: "#134074",
            background: "#dbeafe", borderRadius: 20, padding: "3px 10px",
          }}>
            {LABS.length} labs
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {LABS.map((lab) => (
            <LabCard key={lab.id} lab={lab} />
          ))}
        </div>
      </div>

      {/* ── Home Sample Collection CTA ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 52px 60px" }}>
        <div style={{
          background: "linear-gradient(135deg, #0b2545, #134074)",
          borderRadius: 20, padding: "36px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 24,
          position: "relative", overflow: "hidden",
        }}>
          {/* Decorative circle */}
          <div style={{
            position: "absolute", right: -40, bottom: -40,
            width: 200, height: 200, borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.3)",
              borderRadius: 20, padding: "4px 12px", marginBottom: 12,
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fde047" }}>
                🏠 Home Service
              </span>
            </div>
            <p style={{
              fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 8px",
              fontFamily: "'Playfair Display', serif", letterSpacing: "-0.01em",
            }}>
              Need a Home Sample Collection?
            </p>
            <p style={{ fontSize: 14, color: "rgba(180,210,235,0.65)", margin: 0 }}>
              We offer home collection for most routine tests — convenient & safe.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", position: "relative" }}>
            <a href="tel:+912027654321" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 22px", borderRadius: 12,
              background: "#eab308", border: "none",
              fontSize: 13, fontWeight: 700, color: "#0b2545",
              textDecoration: "none", whiteSpace: "nowrap",
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              📞 Call Lab Desk
            </a>
            <a href="mailto:info@ratnadeephospital.com" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 22px", borderRadius: 12,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)",
              fontSize: 13, fontWeight: 700, color: "#fff",
              textDecoration: "none", whiteSpace: "nowrap",
              transition: "background 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            >
              ✉ Email Us
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LabList;