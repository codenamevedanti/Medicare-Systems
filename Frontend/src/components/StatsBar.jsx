// src/components/StatsBar.jsx
import { HOSPITAL } from "../data/hospitalData";

const StatsBar = () => {
  return (
    <div style={{
      background: "#fff",
      borderBottom: "1px solid #e2e8f0",
      boxShadow: "0 4px 20px rgba(10,77,110,0.08)",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Top thin gold accent */}
      <div style={{
        height: "2px",
        background: "linear-gradient(90deg, transparent, #c9922a 30%, #e8b84b 50%, #c9922a 70%, transparent)",
      }} />

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 40px",
        display: "grid",
        gridTemplateColumns: `repeat(${HOSPITAL.records.length}, 1fr)`,
        gap: 0,
      }}>
        {HOSPITAL.records.map((r, i) => (
          <div
            key={r.label}
            style={{
              padding: "22px 16px",
              textAlign: "center",
              borderRight: i < HOSPITAL.records.length - 1 ? "1px solid #f1f5f9" : "none",
              position: "relative",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            {/* Animated underline on hover */}
            <div style={{
              position: "absolute", bottom: 0, left: "50%",
              transform: "translateX(-50%)",
              width: "0", height: "2px",
              background: "#c9922a",
              transition: "width 0.3s",
            }} />

            <p style={{
              margin: "0 0 4px",
              fontSize: "clamp(18px, 2vw, 26px)",
              fontWeight: 900,
              color: "#0a4d6e",
              lineHeight: 1,
              letterSpacing: "-0.5px",
            }}>
              {r.value}
            </p>
            <p style={{
              margin: 0,
              fontSize: "10.5px",
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}>
              {r.label}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom subtle border */}
      <div style={{ height: "1px", background: "#f1f5f9" }} />
    </div>
  );
};

export default StatsBar;