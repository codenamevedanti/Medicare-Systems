// src/components/LabCard.jsx
import { useState } from "react";

// ── Lab metadata: icon, accent color, bg tint ─────────────────────────────
const LAB_META = {
  "clinical pathology":    { icon: "🩸", color: "#dc2626", bg: "#fef2f2" },
  "biochemistry":          { icon: "⚗️",  color: "#7c3aed", bg: "#f5f3ff" },
  "microbiology":          { icon: "🦠",  color: "#059669", bg: "#ecfdf5" },
  "histopathology":        { icon: "🔬",  color: "#b45309", bg: "#fffbeb" },
  "cytology":              { icon: "🧫",  color: "#6d28d9", bg: "#f5f3ff" },
  "molecular":             { icon: "🧬",  color: "#1d4ed8", bg: "#eff6ff" },
  "immunology":            { icon: "🛡️",  color: "#0f766e", bg: "#f0fdfa" },
  "blood bank":            { icon: "🩺",  color: "#b91c1c", bg: "#fef2f2" },
  "radiology":             { icon: "🫁",  color: "#334155", bg: "#f1f5f9" },
  "cardiac":               { icon: "❤️",  color: "#e11d48", bg: "#fff1f2" },
  "genetics":              { icon: "🧬",  color: "#4f46e5", bg: "#eef2ff" },
};

const getMeta = (name = "") => {
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(LAB_META)) {
    if (key.includes(k)) return v;
  }
  return { icon: "🔬", color: "#134074", bg: "#eff6ff" };
};

// ── LabCard ───────────────────────────────────────────────────────────────
const LabCard = ({ lab }) => {
  const [expanded, setExpanded] = useState(false);
  const meta = getMeta(lab.name);

  const services = lab.availableTests
    ? lab.availableTests.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      border: "1px solid #e2e8f0",
      overflow: "hidden",
      transition: "box-shadow 0.2s, transform 0.2s",
      boxShadow: expanded ? "0 8px 32px rgba(11,37,69,0.10)" : "0 1px 4px rgba(11,37,69,0.06)",
    }}
      onMouseEnter={e => { if (!expanded) e.currentTarget.style.boxShadow = "0 4px 20px rgba(11,37,69,0.09)"; }}
      onMouseLeave={e => { if (!expanded) e.currentTarget.style.boxShadow = "0 1px 4px rgba(11,37,69,0.06)"; }}
    >
      {/* ── Header ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "20px 24px",
          background: "none", border: "none", cursor: "pointer",
          textAlign: "left", transition: "background 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
        onMouseLeave={e => e.currentTarget.style.background = "none"}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Icon badge */}
          <div style={{
            width: 50, height: 50, borderRadius: 14, flexShrink: 0,
            background: meta.bg, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 22,
            border: `1px solid ${meta.color}22`,
          }}>
            {meta.icon}
          </div>

          <div>
            <p style={{
              fontSize: 16, fontWeight: 700, color: "#0f172a",
              margin: 0, letterSpacing: "-0.01em",
              fontFamily: "'Playfair Display', Georgia, serif",
            }}>
              {lab.name}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
              <span style={{
                fontSize: 11, color: meta.color, fontWeight: 600,
                background: meta.bg, borderRadius: 20,
                padding: "2px 10px", border: `1px solid ${meta.color}30`,
              }}>
                📞 {lab.contactNumber || "Contact on request"}
              </span>
              {services.length > 0 && (
                <span style={{
                  fontSize: 11, color: "#64748b", fontWeight: 500,
                  background: "#f1f5f9", borderRadius: 20, padding: "2px 10px",
                }}>
                  {services.length} tests
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expand chevron */}
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: expanded ? meta.bg : "#f1f5f9",
          border: `1px solid ${expanded ? meta.color + "30" : "#e2e8f0"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }}>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={expanded ? meta.color : "#94a3b8"} strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* ── Expanded panel ── */}
      {expanded && (
        <div style={{ borderTop: "1px solid #f1f5f9" }}>

          {/* Top accent bar */}
          <div style={{ height: 3, background: `linear-gradient(90deg, ${meta.color}, ${meta.color}55)` }} />

          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 0, background: "#fafbfc",
          }}>

            {/* Left — info */}
            <div style={{ padding: "24px 28px", borderRight: "1px solid #f1f5f9" }}>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#94a3b8", marginBottom: 16,
              }}>
                Lab Details
              </p>

              {lab.description && (
                <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.65, marginBottom: 16 }}>
                  {lab.description}
                </p>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, background: meta.bg,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    fontSize: 14,
                  }}>📞</div>
                  <div>
                    <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>Contact</p>
                    <a href={`tel:${lab.contactNumber}`} style={{
                      fontSize: 13.5, fontWeight: 700, color: meta.color, textDecoration: "none",
                    }}>
                      {lab.contactNumber || "Available on request"}
                    </a>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, background: "#f0fdf4",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    fontSize: 14,
                  }}>🕐</div>
                  <div>
                    <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>Hours</p>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a", margin: 0 }}>Mon–Sat: 7:00 AM – 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — tests */}
            <div style={{ padding: "24px 28px" }}>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#94a3b8", marginBottom: 16,
              }}>
                Available Tests {services.length > 0 && `(${services.length})`}
              </p>

              {services.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {services.map((s) => (
                    <span key={s} style={{
                      fontSize: 11.5, fontWeight: 600,
                      color: meta.color,
                      background: meta.bg,
                      border: `1px solid ${meta.color}30`,
                      borderRadius: 20, padding: "4px 12px",
                      whiteSpace: "nowrap",
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "14px 16px", background: "#f8fafc",
                  borderRadius: 10, border: "1px dashed #e2e8f0",
                }}>
                  <span style={{ fontSize: 20 }}>📋</span>
                  <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                    Contact the lab directly for the full test menu.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabCard;