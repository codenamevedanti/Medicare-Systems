// src/components/WhyChooseUs.jsx

const CARDS = [
    {
      accent: "#0a4d6e",
      accentLight: "#e8f4f8",
      icon: (
        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Clinical Excellence & Multispecialty Care",
      points: [
        {
          label: "1,800+ Specialists",
          desc: "Board-certified doctors across 30+ specialities, supported by integrated care teams for complex multi-organ conditions.",
        },
        {
          label: "Advanced Medical Infrastructure",
          desc: "18 modular OT suites, robotic surgery systems, 3T MRI, PET-CT, and Maharashtra's first Proton Therapy centre.",
        },
        {
          label: "24×7 Emergency & Critical Care",
          desc: "Level I Trauma Centre with dedicated cardiac, neuro, and paediatric emergency bays — door-to-treatment under 10 minutes.",
        },
      ],
    },
    {
      accent: "#0f766e",
      accentLight: "#f0fdfa",
      icon: (
        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Patient Safety & Quality Standards",
      points: [
        {
          label: "NABH & ISO 9001:2015 Accredited",
          desc: "Strict adherence to nationally and internationally recognised clinical safety and quality benchmarks.",
        },
        {
          label: "Seamless Admission & Discharge",
          desc: "Digital pre-admission, bedside registration, and cashless insurance tie-ups with 200+ insurers — minimal waiting.",
        },
        {
          label: "Integrated Diagnostic Services",
          desc: "NABL-certified in-house lab with 1,200+ tests, on-site radiology, and real-time digital report delivery.",
        },
      ],
    },
    {
      accent: "#7c3aed",
      accentLight: "#f5f3ff",
      icon: (
        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Patient Comfort & Support Services",
      points: [
        {
          label: "Patient Comfort & Amenities",
          desc: "Private, semi-private, and general wards with 24×7 nursing, in-room dining, and dedicated patient relations staff.",
        },
        {
          label: "International Patient Assistance",
          desc: "Dedicated coordinators for visa, airport transfer, interpreter services, and insurance liaison for overseas patients.",
        },
        {
          label: "Prime Location & Accessibility",
          desc: "Located on MG Road, Shivaji Nagar — central Pune, 5 minutes from Pune Junction with free parking for 400 vehicles.",
        },
      ],
    },
  ];
  
  const WhyChooseUs = () => (
    <section style={{
      background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
      padding: "72px 40px",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <style>{`
        .wcu-card {
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #e2e8f0;
          padding: 32px 28px;
          flex: 1;
          min-width: 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: transform 0.22s, box-shadow 0.22s;
          position: relative;
          overflow: hidden;
        }
        .wcu-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
        }
        .wcu-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: var(--accent);
          border-radius: 20px 20px 0 0;
        }
        .wcu-point {
          display: flex;
          gap: 13px;
          padding: 13px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .wcu-point:last-child { border-bottom: none; padding-bottom: 0; }
        .wcu-point:first-child { padding-top: 0; }
        .wcu-check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
          font-size: 11px;
          font-weight: 900;
        }
        @media (max-width: 900px) {
          .wcu-grid { flex-direction: column !important; }
        }
      `}</style>
  
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
  
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#e8f4f8", borderRadius: "20px",
            padding: "6px 16px", marginBottom: "14px",
            fontSize: "12px", fontWeight: 700, color: "#0a4d6e",
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            <span style={{ fontSize: "14px" }}>🏅</span>
            Pune's Most Trusted Hospital
          </div>
          <h2 style={{
            fontSize: "36px", fontWeight: 900, color: "#0f172a",
            margin: "0 0 14px", letterSpacing: "-0.5px", lineHeight: 1.2,
          }}>
            Why Choose{" "}
            <span style={{
              background: "linear-gradient(135deg, #0a4d6e, #1565a0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Ratnadeep Hospital?
            </span>
          </h2>
          <p style={{
            fontSize: "16px", color: "#64748b", maxWidth: "520px",
            margin: "0 auto", lineHeight: 1.7,
          }}>
            Three decades of healing, 1,800+ specialists, and an unwavering commitment to making
            world-class healthcare accessible to every patient.
          </p>
        </div>
  
        {/* Cards Grid */}
        <div className="wcu-grid" style={{ display: "flex", gap: "24px", alignItems: "stretch" }}>
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="wcu-card"
              style={{ "--accent": card.accent }}
            >
              {/* Card header */}
              <div style={{
                display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "24px",
              }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px",
                  background: card.accentLight,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: card.accent, flexShrink: 0,
                }}>
                  {card.icon}
                </div>
                <h3 style={{
                  fontSize: "16px", fontWeight: 900, color: "#0f172a",
                  margin: 0, lineHeight: 1.4,
                }}>
                  {card.title}
                </h3>
              </div>
  
              {/* Points */}
              <div>
                {card.points.map((pt) => (
                  <div key={pt.label} className="wcu-point">
                    <div
                      className="wcu-check"
                      style={{
                        background: card.accentLight,
                        color: card.accent,
                      }}
                    >
                      ✓
                    </div>
                    <div>
                      <p style={{
                        margin: "0 0 3px", fontSize: "13.5px",
                        fontWeight: 800, color: "#1e293b",
                      }}>
                        {pt.label}
                      </p>
                      <p style={{
                        margin: 0, fontSize: "13px",
                        color: "#64748b", lineHeight: 1.6,
                      }}>
                        {pt.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
  
        {/* Bottom trust strip */}
        <div style={{
          marginTop: "44px",
          background: "linear-gradient(135deg, #0a4d6e 0%, #1565a0 100%)",
          borderRadius: "18px",
          padding: "24px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
          boxShadow: "0 8px 32px rgba(10,77,110,0.25)",
        }}>
          <div style={{ display: "flex", gap: "36px", flexWrap: "wrap" }}>
            {[
              { val: "50,000+", label: "Surgeries Done" },
              { val: "45+", label: "Awards Won" },
              { val: "99.2%", label: "Patient Satisfaction" },
              { val: "< 10 min", label: "Emergency Response" },
            ].map(({ val, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", marginTop: "3px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {["NABH Accredited", "ISO 9001:2015", "NABL Certified"].map((b) => (
              <span key={b} style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "8px",
                padding: "6px 14px",
                fontSize: "12px", fontWeight: 700, color: "#fff",
              }}>
                ✓ {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
  
  export default WhyChooseUs;