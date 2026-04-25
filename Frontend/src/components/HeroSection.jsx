// src/components/HeroSection.jsx

import { HOSPITAL } from "../data/hospitalData";

const HeroSection = ({ onBookOpd }) => {
  return (
    <section
      className="relative px-8 py-20"
      style={{
        background: "linear-gradient(135deg, #0f4c81 0%, #1a6aad 60%, #0f4c81 100%)",
        color: "#fff",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 80% 50%, rgba(201,146,42,0.18) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div
        className="max-w-3xl mx-auto text-center"
        style={{ position: "relative", zIndex: 2 }}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-[#c9d8ee] mb-3">
          Est. {HOSPITAL.established} · Pune, Maharashtra
        </p>

        <h1
          className="font-black leading-tight text-4xl md:text-5xl"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {HOSPITAL.name}
        </h1>

        <p className="mt-2 text-base italic text-[#c9922a] tracking-wide">
          {HOSPITAL.tagline}
        </p>

        <p className="mt-5 text-sm leading-relaxed text-[#c9d8ee] max-w-xl mx-auto">
          Three decades of clinical excellence, {HOSPITAL.beds} beds, 1,800+
          specialists, and an unwavering commitment to compassionate care for
          every patient who walks through our doors.
        </p>

        {/* Buttons */}
        <div
          className="flex flex-wrap gap-3 mt-8 justify-center"
          style={{ position: "relative", zIndex: 3 }}
        >
          <button
            type="button"
            onClick={() => {
              console.log("Book OPD clicked");
              if (onBookOpd) onBookOpd();
            }}
            style={{
              background: "#c9922a",
              cursor: "pointer",
              position: "relative",
              zIndex: 3,
              border: "none",
              padding: "12px 24px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "700",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            Book OPD Appointment
          </button>

          <a
            href="tel:1800222108"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white border-2 border-white/40 hover:bg-white/10 transition-colors"
            style={{ position: "relative", zIndex: 3 }}
          >
            🚨 Emergency: 1800-222-108
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;