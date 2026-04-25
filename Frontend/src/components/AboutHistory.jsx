// src/components/AboutHistory.jsx

import { HOSPITAL } from "../data/hospitalData";
import RoomGrid from "./RoomGrid";

const AboutHistory = () => {
  return (
    <section id="about" className="max-w-6xl mx-auto px-8 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-start">

        {/* Left — History Text */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#c9922a] mb-1">
            About Us
          </p>
          <h2
            className="font-black text-3xl md:text-4xl mb-6 text-[#0f172a]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Our History & Mission
          </h2>
          {HOSPITAL.history.map((para, i) => (
            <p key={i} className="text-sm text-gray-500 leading-relaxed mb-4">
              {para}
            </p>
          ))}
          <div className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-[#0f4c81]/10 text-[#0f4c81] text-xs font-bold pointer-events-none">
            🏥 Established in {HOSPITAL.established} · Pune, Maharashtra
          </div>
        </div>

        {/* Right — Room Grid */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#c9922a] mb-4">
            Our Facilities
          </p>
          <h3
            className="font-black text-2xl mb-6 text-[#0f172a]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Room & Ward Summary
          </h3>
          <RoomGrid />
        </div>

      </div>
    </section>
  );
};

export default AboutHistory;