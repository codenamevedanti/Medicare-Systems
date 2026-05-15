// src/pages/InfoPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { hospitalPages } from "../data/hospitalPages";
import HospitalNavbar from "../components/HospitalNavbar";
import Footer from "../components/Footer";

// ── Accent colors per slug for variety ───────────────────────────────────────
const SLUG_THEME = {
  "health-packages":  { from: "#0b2545", to: "#1a6b4a", accent: "#22c55e",  light: "#f0fdf4" },
  "health-check":     { from: "#0b2545", to: "#1a6b4a", accent: "#22c55e",  light: "#f0fdf4" },
  ambulance:          { from: "#7f1d1d", to: "#991b1b", accent: "#f87171",  light: "#fef2f2" },
  "blood-bank":       { from: "#7f1d1d", to: "#9f1239", accent: "#fb7185",  light: "#fff1f2" },
  telemedicine:       { from: "#0b2545", to: "#1e40af", accent: "#60a5fa",  light: "#eff6ff" },
  "patient-portal":   { from: "#0b2545", to: "#1e40af", accent: "#60a5fa",  light: "#eff6ff" },
  international:      { from: "#0b2545", to: "#134074", accent: "#eab308",  light: "#fefce8" },
  insurance:          { from: "#1e3a5f", to: "#0f4c81", accent: "#38bdf8",  light: "#f0f9ff" },
  careers:            { from: "#1e1b4b", to: "#312e81", accent: "#a78bfa",  light: "#f5f3ff" },
  pharmacy:           { from: "#0f4c81", to: "#0369a1", accent: "#22d3ee",  light: "#ecfeff" },
  about:              { from: "#0b2545", to: "#134074", accent: "#eab308",  light: "#fefce8" },
  privacy:            { from: "#1e293b", to: "#334155", accent: "#94a3b8",  light: "#f8fafc" },
  terms:              { from: "#1e293b", to: "#334155", accent: "#94a3b8",  light: "#f8fafc" },
  cookies:            { from: "#78350f", to: "#92400e", accent: "#fbbf24",  light: "#fffbeb" },
  accessibility:      { from: "#064e3b", to: "#065f46", accent: "#34d399",  light: "#ecfdf5" },
  sitemap:            { from: "#0b2545", to: "#134074", accent: "#60a5fa",  light: "#eff6ff" },
};

const DEFAULT_THEME = { from: "#0b2545", to: "#134074", accent: "#eab308", light: "#fefce8" };

// ── Card index badges ─────────────────────────────────────────────────────────
const CARD_ICONS = ["01", "02", "03", "04", "05", "06", "07", "08"];

const InfoPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const page = hospitalPages[slug];
  const theme = SLUG_THEME[slug] || DEFAULT_THEME;

  // ── 404 ───────────────────────────────────────────────────────────────────
  if (!page) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8f9fb", fontFamily: "'DM Sans', sans-serif" }}>
        <p style={{ fontSize: 64, marginBottom: 16 }}>🏥</p>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 8px", fontFamily: "'Playfair Display', serif" }}>
          Page Not Found
        </h2>
        <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 28 }}>
          This page doesn't exist yet.
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 28px", borderRadius: 12, border: "none",
            background: "#0b2545", color: "#fff", fontSize: 14,
            fontWeight: 700, cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'DM Sans', sans-serif" }}>
      <HospitalNavbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
        padding: "70px 24px 100px",
        position: "relative", overflow: "hidden", textAlign: "center",
      }}>
        {/* dot grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px", pointerEvents: "none",
        }} />
        {/* decorative rings */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          width: 500, height: 500, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.05)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          width: 320, height: 320, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.07)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
          {/* Icon bubble */}
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: "0 auto 22px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 34,
          }}>
            {page.icon}
          </div>

          {/* Accent pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: `${theme.accent}22`,
            border: `1px solid ${theme.accent}55`,
            borderRadius: 20, padding: "5px 14px", marginBottom: 18,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: theme.accent, display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: theme.accent }}>
              {slug.replace(/-/g, " ")}
            </span>
          </div>

          <h1 style={{
            fontSize: 40, fontWeight: 800, color: "#fff",
            margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.15,
            fontFamily: "'Playfair Display', Georgia, serif",
          }}>
            {page.title}
          </h1>
          <p style={{
            fontSize: 15.5, color: "rgba(200,220,240,0.75)",
            lineHeight: 1.75, margin: 0,
          }}>
            {page.description}
          </p>
        </div>
      </div>

      {/* ── Section cards — overlap the hero bottom ───────────────────────── */}
      <div style={{ maxWidth: 860, margin: "-48px auto 0", padding: "0 24px 60px", position: "relative", zIndex: 2 }}>

        {/* Section count label */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8" }}>
            {page.sections.length} section{page.sections.length > 1 ? "s" : ""}
          </span>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {page.sections.map((section, i) => (
            <div key={i} style={{
              background: "#fff",
              borderRadius: 18,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(11,37,69,0.06)",
              display: "flex",
            }}>
              {/* Left accent strip + number */}
              <div style={{
                width: 64, flexShrink: 0,
                background: theme.light,
                borderRight: `3px solid ${theme.accent}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 4,
              }}>
                <span style={{
                  fontSize: 13, fontWeight: 800, color: theme.accent,
                  fontFamily: "'Playfair Display', serif", letterSpacing: "0.02em",
                }}>
                  {CARD_ICONS[i] || String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: "24px 28px", flex: 1 }}>
                <h2 style={{
                  fontSize: 17, fontWeight: 700, color: "#0f172a",
                  margin: "0 0 10px", letterSpacing: "-0.01em",
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}>
                  {section.heading}
                </h2>
                <p style={{
                  fontSize: 14.5, color: "#475569",
                  lineHeight: 1.75, margin: 0,
                }}>
                  {section.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA bar ─────────────────────────────────────────────────────── */}
        <div style={{
          marginTop: 36,
          background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
          borderRadius: 18, padding: "28px 32px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 18,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", right: -30, top: -30,
            width: 160, height: 160, borderRadius: "50%",
            background: "rgba(255,255,255,0.05)", pointerEvents: "none",
          }} />
          <div style={{ position: "relative" }}>
            <p style={{
              fontSize: 18, fontWeight: 800, color: "#fff",
              margin: "0 0 6px", fontFamily: "'Playfair Display', serif",
            }}>
              Have questions?
            </p>
            <p style={{ fontSize: 13.5, color: "rgba(200,220,240,0.65)", margin: 0 }}>
              Our team is available Mon–Sat, 8:00 AM – 8:00 PM.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", position: "relative" }}>
            <a href="tel:+912027654321" style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "11px 20px", borderRadius: 10,
              background: theme.accent, border: "none",
              fontSize: 13, fontWeight: 700,
              color: theme.from,
              textDecoration: "none", whiteSpace: "nowrap",
            }}>
              📞 Call Us
            </a>
            <button
              onClick={() => navigate("/")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "11px 20px", borderRadius: 10,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                fontSize: 13, fontWeight: 700, color: "#fff",
                cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InfoPage;