// src/components/Footer.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { HOSPITAL } from "../data/hospitalData";

// ── Icons ────────────────────────────────────
const IconPin = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012 4.82 2 2 0 013.99 2.67h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 10a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconHospital = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
    <line x1="12" y1="7" x2="12" y2="11" />
    <line x1="10" y1="9" x2="14" y2="9" />
  </svg>
);

// ── Data ────────────────────────────────────────────────────────────────────
const DEPARTMENTS = [
  { id: "cardiology",   name: "Cardiology" },
  { id: "neurology",    name: "Neurology" },
  { id: "orthopaedics", name: "Orthopaedics" },
  { id: "oncology",     name: "Oncology" },
  { id: "gynaecology",  name: "Gynaecology" },
  { id: "paediatrics",  name: "Paediatrics" },
];


// Routes that exist:   /labs, /doctors, /departments, /info/:slug
// Routes that DON'T:   /packages, /portal, /diagnostics, /pharmacy (public)
const QUICK_LINKS = [
  { label: "About Us",               to: "/info/about" },         // ✅ hits InfoPage with slug="about"
  { label: "Our Doctors",            to: "/doctors" },             // ✅ route exists
  { label: "Book Appointment",       to: "/?book=opd" },           // ✅ home page with query param
  { label: "Health Packages",        to: "/info/health-packages" },// ✅ hits InfoPage (was /packages → 404)
  { label: "Patient Portal",         to: "/info/patient-portal" }, // ✅ hits InfoPage (was /portal → 404)
  { label: "Diagnostics & Lab",      to: "/labs" },               
  { label: "Insurance & TPA",        to: "/info/insurance" },      // ✅ hits InfoPage
  { label: "Blood Bank",             to: "/info/blood-bank" },     // ✅ hits InfoPage
  { label: "International Patients", to: "/info/international" },  // ✅ hits InfoPage
  { label: "Careers",                to: "/info/careers" },        // ✅ hits InfoPage
];

const PATIENT_SERVICES = [
  { label: "Ambulance Services",        to: "/info/ambulance" },      // ✅ hits InfoPage
  { label: "Health Check Packages",     to: "/info/health-check" },   // ✅ hits InfoPage
  { label: "Telemedicine / Online OPD", to: "/info/telemedicine" },   // ✅ hits InfoPage
  { label: "Pharmacy",                  to: "/info/pharmacy" },       
];

const STATS = [
  { num: "32+",  lbl: "Years" },
  { num: "2L+",  lbl: "Patients/yr" },
  { num: "50K+", lbl: "Surgeries" },
  { num: "45+",  lbl: "Awards" },
];

const SOCIALS = ["Fb", "Tw", "Ig", "Yt", "Li"];

const LEGAL_LINKS = [
  { label: "Privacy Policy", to: "/info/privacy" },
  { label: "Terms of Use",   to: "/info/terms" },
  { label: "Cookie Policy",  to: "/info/cookies" },
  { label: "Accessibility",  to: "/info/accessibility" }, 
  { label: "Sitemap",        to: "/info/sitemap" },       
];

// ── Sub-components ──────────────────────────────────────────────────────────
const ColHead = ({ children }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 10,
    fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
    textTransform: "uppercase", color: "#0d7a68", marginBottom: 22,
  }}>
    {children}
    <span style={{ flex: 1, height: 1, background: "rgba(13,122,104,0.22)" }} />
  </div>
);

const ContactRow = ({ icon, label, children }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 17 }}>
    <div style={{
      width: 30, height: 30, flexShrink: 0, borderRadius: 5, marginTop: 1,
      background: "rgba(13,122,104,0.14)", border: "1px solid rgba(13,122,104,0.28)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 10, color: "rgba(180,205,225,0.4)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: "rgba(180,205,225,0.85)", lineHeight: 1.65 }}>
        {children}
      </div>
    </div>
  </div>
);

const NavLink = ({ to, children, style = {} }) => (
  <Link to={to} style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "8.5px 0", fontSize: 13, color: "rgba(180,205,225,0.6)",
    textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.05)",
    transition: "color 0.2s", ...style,
  }}
    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
    onMouseLeave={e => e.currentTarget.style.color = "rgba(180,205,225,0.6)"}
  >
    {children}
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="#0d7a68" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  </Link>
);

// ── Main Footer ─────────────────────────────────────────────────────────────
const Footer = () => {
  const [email, setEmail]           = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) { setSubscribed(true); setEmail(""); }
  };

  const S = { // style tokens
    navy:    "#0f1e2e",
    navyMid: "#16263a",
    teal:    "#0d7a68",
    tealDk:  "#0a5f51",
    sep:     "rgba(255,255,255,0.07)",
    dim:     "rgba(180,205,225,0.6)",
    soft:    "rgba(180,205,225,0.85)",
  };

  return (
    <footer style={{ background: S.navy, color: S.dim, fontSize: 13.5, lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>

      {/* ── Emergency bar ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        flexWrap: "wrap", gap: "0 20px",
        background: "#b91c1c", padding: "11px 52px",
        fontSize: 12.5, fontWeight: 500, letterSpacing: "0.03em",
        borderBottom: "2px solid rgba(0,0,0,0.2)",
      }}>
        <span style={{
          width: 8, height: 8, background: "#fca5a5", borderRadius: "50%", flexShrink: 0,
          animation: "epulse 1.6s ease-in-out infinite",
        }} />
        <style>{`@keyframes epulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.25;transform:scale(1.7)}}`}</style>
        <span style={{ color: "#fee2e2" }}>24×7 Emergency &amp; Critical Care</span>
        <span style={{ color: "rgba(255,255,255,0.25)" }}>|</span>
        <span style={{ color: "#fca5a5", fontSize: 12 }}>Level I Trauma Centre — door-to-treatment &lt;10 min</span>
        <span style={{ color: "rgba(255,255,255,0.25)" }}>|</span>
        <span style={{ color: "#fee2e2" }}>Helpline:</span>
        <a href="tel:1800222108" style={{ color: "#fee2e2", fontWeight: 700, fontSize: 14, textDecoration: "none", letterSpacing: "0.06em" }}>
          1800-222-108
        </a>
        <span style={{ color: "rgba(255,255,255,0.25)" }}>|</span>
        <span style={{ color: "#fee2e2" }}>Ambulance:</span>
        <a href="tel:102" style={{ color: "#fee2e2", fontWeight: 700, fontSize: 14, textDecoration: "none", letterSpacing: "0.06em" }}>102</a>
      </div>

      {/* ── Accreditation strip ── */}
      <div style={{
        background: "rgba(255,255,255,0.03)", borderBottom: `1px solid ${S.sep}`,
        padding: "14px 52px", display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["NABH Accredited", "ISO 9001:2015", "NABL Certified"].map(b => (
            <div key={b} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 13px", border: "1px solid rgba(13,122,104,0.35)", borderRadius: 3,
              fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", color: "#5ecfbf",
            }}>
              <span style={{ color: "#2dd4bf" }}>✓</span> {b}
            </div>
          ))}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 13px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3,
            fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", color: "rgba(180,205,225,0.4)",
          }}>
            Est. {HOSPITAL.established}
          </div>
        </div>
        <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          {[
            { href: `tel:${HOSPITAL.phone}`, icon: "☎", text: HOSPITAL.phone },
            { href: `mailto:${HOSPITAL.email}`, icon: "✉", text: HOSPITAL.email },
          ].map(({ href, icon, text }) => (
            <a key={href} href={href} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: S.dim, textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = S.dim}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(13,122,104,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#2dd4bf" }}>
                {icon}
              </span>
              {text}
            </a>
          ))}
        </div>
      </div>

      {/* ── Main 4-column grid ── */}
      <div style={{
        maxWidth: 1300, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1.8fr 1px 1.05fr 1px 1fr 1px 1.05fr",
        padding: "54px 52px 46px",
      }}>

        {/* Brand column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 8, background: S.teal, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(13,122,104,0.5)",
            }}>
              <IconHospital />
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
                {HOSPITAL.name}
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: "#5ecfbf", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3 }}>
                Multi-Speciality · Pune
              </div>
            </div>
          </div>

          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 13.5, color: "#c9922a", marginBottom: 14, paddingLeft: 13, borderLeft: `2px solid ${S.teal}` }}>
            {HOSPITAL.tagline}
          </p>
          <p style={{ fontSize: 12.5, color: "rgba(180,205,225,0.5)", lineHeight: 1.8, marginBottom: 22 }}>
            Three decades of clinical excellence, 450 beds, 1,800+ specialists, and an unwavering commitment to compassionate care for every patient who walks through our doors.
          </p>

          {/* Stats mini-bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, overflow: "hidden", marginBottom: 24 }}>
            {STATS.map(({ num, lbl }, i) => (
              <div key={lbl} style={{ textAlign: "center", padding: "12px 6px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#fff", display: "block" }}>{num}</span>
                <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(94,207,191,0.7)", marginTop: 2, display: "block" }}>{lbl}</span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(180,205,225,0.35)", marginBottom: 10 }}>Follow us</div>
          <div style={{ display: "flex", gap: 8 }}>
            {SOCIALS.map(s => (
              <a key={s} href="#" style={{
                width: 33, height: 33, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 600, color: "rgba(180,205,225,0.5)", textDecoration: "none", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = S.teal; e.currentTarget.style.color = "#2dd4bf"; e.currentTarget.style.background = "rgba(13,122,104,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(180,205,225,0.5)"; e.currentTarget.style.background = "transparent"; }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ background: S.sep, margin: "0 40px", alignSelf: "stretch" }} />

        {/* Contact column */}
        <div>
          <ColHead>Contact Us</ColHead>
          <ContactRow icon={<IconPin />} label="Address">
            Plot No. 42, MG Road<br />Shivaji Nagar, Pune – 411005<br />Maharashtra, India
          </ContactRow>
          <ContactRow icon={<IconPhone />} label="Phone">
            <a href={`tel:${HOSPITAL.phone}`} style={{ color: "inherit", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "inherit"}>
              {HOSPITAL.phone}
            </a>
          </ContactRow>
          <ContactRow icon={<IconMail />} label="Email">
            <a href={`mailto:${HOSPITAL.email}`} style={{ color: "inherit", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "inherit"}>
              {HOSPITAL.email}
            </a>
          </ContactRow>

          {/* OPD Hours */}
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${S.sep}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: S.teal, marginBottom: 12 }}>OPD Hours</div>
            {[
              { day: "Mon – Sat", time: "8:00 AM – 8:00 PM" },
              { day: "Sunday",    time: "9:00 AM – 2:00 PM" },
              { day: "Emergency", time: "24 × 7 Open", red: true },
            ].map(({ day, time, red }) => (
              <div key={day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12.5 }}>
                <span style={{ color: "rgba(180,205,225,0.45)" }}>{day}</span>
                <span style={{ color: red ? "#fca5a5" : S.soft, fontWeight: 500 }}>{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ background: S.sep, margin: "0 40px", alignSelf: "stretch" }} />

        {/* Quick Links column */}
        <div>
          <ColHead>Quick Links</ColHead>
          {QUICK_LINKS.map(({ label, to }) => (
            <NavLink key={to} to={to}>{label}</NavLink>
          ))}
        </div>

        {/* Divider */}
        <div style={{ background: S.sep, margin: "0 40px", alignSelf: "stretch" }} />

        {/* Departments + Patient Services column */}
        <div>
          <ColHead>Departments</ColHead>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {DEPARTMENTS.map(({ id, name }) => (
              <Link key={id} to={`/departments/${id}`} style={{ display: "block", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12.5, color: S.dim, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#2dd4bf"}
                onMouseLeave={e => e.currentTarget.style.color = S.dim}>
                {name}
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 26, paddingTop: 20, borderTop: `1px solid rgba(255,255,255,0.06)` }}>
            <ColHead>Patient Services</ColHead>
            {PATIENT_SERVICES.map(({ label, to }) => (
              <NavLink key={to} to={to}>{label}</NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* ── Newsletter band ── */}
      <div style={{
        borderTop: "1px solid rgba(13,122,104,0.2)", borderBottom: `1px solid ${S.sep}`,
        background: "rgba(13,122,104,0.07)", padding: "22px 52px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 18,
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: S.teal, marginBottom: 4 }}>Health Newsletter</div>
          <div style={{ fontSize: 13, color: "rgba(180,205,225,0.55)" }}>Expert health tips, wellness guides &amp; hospital updates — delivered monthly</div>
        </div>
        <div style={{ display: "flex", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5, overflow: "hidden" }}>
          {subscribed ? (
            <div style={{ padding: "10px 20px", fontSize: 13, color: "#2dd4bf", fontWeight: 500 }}>✓ Subscribed — thank you!</div>
          ) : (
            <>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                style={{ background: "rgba(255,255,255,0.05)", border: "none", outline: "none", padding: "10px 16px", fontSize: 13, color: "#fff", width: 230, fontFamily: "'Inter', sans-serif" }}
              />
              <button onClick={handleSubscribe} style={{
                background: S.teal, border: "none", padding: "10px 22px",
                fontSize: 12.5, fontWeight: 600, color: "#fff", cursor: "pointer",
                fontFamily: "'Inter', sans-serif", letterSpacing: "0.04em", whiteSpace: "nowrap",
              }}
                onMouseEnter={e => e.currentTarget.style.background = S.tealDk}
                onMouseLeave={e => e.currentTarget.style.background = S.teal}>
                Subscribe
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        padding: "17px 52px", borderTop: `1px solid ${S.sep}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ fontSize: 12, color: "rgba(180,205,225,0.3)" }}>
          © {new Date().getFullYear()} {HOSPITAL.name}, Pune. All rights reserved.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {LEGAL_LINKS.map(({ label, to }, i) => (
            <Link key={to} to={to} style={{
              fontSize: 12, color: "rgba(180,205,225,0.3)", textDecoration: "none",
              padding: "0 14px", borderRight: i < LEGAL_LINKS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = S.dim}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(180,205,225,0.3)"}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;