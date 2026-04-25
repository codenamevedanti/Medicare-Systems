// src/components/OpdTimings.jsx

import { OPD_HOURS } from "../data/hospitalData";

const OpdTimings = () => {
  return (
    <section
      id="opd-timings"
      className="px-8 py-16"
      style={{
        background: "linear-gradient(135deg, #0f4c81 0%, #1a6aad 100%)",
        color: "#fff",
      }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <p className="text-xs font-bold uppercase tracking-widest text-[#c9d8ee99] mb-1">
          Visiting Hours
        </p>
        <h2 className="font-black text-3xl mb-8" style={{ fontFamily: "Georgia, serif" }}>
          OPD Consultation Schedule
        </h2>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden border border-white/15">
          <table className="w-full text-sm">

            {/* Header */}
            <thead className="bg-black/20">
              <tr>
                {["Day / Period", "General OPD", "Specialist OPD"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-white/60"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Rows */}
            <tbody>
              {OPD_HOURS.map((row, i) => (
                <tr
                  key={row.day}
                  className={i % 2 === 0 ? "bg-white/5" : "bg-transparent"}
                >
                  <td className="px-5 py-4 font-bold">{row.day}</td>
                  <td className="px-5 py-4 text-white/80">{row.general}</td>
                  <td className="px-5 py-4 text-white/80">{row.specialist}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Note */}
        <p className="mt-4 text-xs text-white/50">
          * Emergency services are available 24 hours, 7 days a week including
          all public holidays.
        </p>

      </div>
    </section>
  );
};

export default OpdTimings;