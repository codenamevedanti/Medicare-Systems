// src/components/RoomGrid.jsx

import { ROOMS } from "../data/rooms";

const RoomGrid = () => {
  return (
    // ✅ Max 2 columns — fits perfectly inside the half-width About section
    // Items are centered, text is centered inside each card
    <div className="grid grid-cols-2 gap-4">
      {ROOMS.map((r) => (
        <div
          key={r.type}
          className="rounded-xl p-4 bg-white shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 text-center"
          style={{ borderTop: `3px solid ${r.color}` }}
        >
          {/* Icon */}
          <p className="text-2xl">{r.icon}</p>

          {/* Count */}
          <p
            className="font-black text-2xl mt-1"
            style={{ color: r.color }}
          >
            {r.count}
          </p>

          {/* Type */}
          <p className="font-bold text-sm text-gray-800">{r.type}</p>

          {/* Description */}
          <p className="text-xs text-gray-500 leading-relaxed mt-1">
            {r.desc}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RoomGrid;