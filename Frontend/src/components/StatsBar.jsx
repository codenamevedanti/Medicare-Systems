// src/components/StatsBar.jsx

import { HOSPITAL } from "../data/hospitalData";

const StatsBar = () => {
  return (
    <div className="bg-[#c9922a] px-8 py-5">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
        {HOSPITAL.records.map((r) => (
          <div key={r.label}>
            <p className="text-white font-black text-xl">{r.value}</p>
            <p className="text-white/75 text-[10px] uppercase tracking-widest mt-0.5">
              {r.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;