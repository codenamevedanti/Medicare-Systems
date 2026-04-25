// src/components/DeptCard.jsx

import { useNavigate } from "react-router-dom";

// ── Fallback colors & icons based on department name ──────────
const DEPT_META = {
  cardiology:        { color: "#e53e3e", icon: "❤️",  tagline: "Heart & Vascular Care" },
  neurology:         { color: "#6b46c1", icon: "🧠",  tagline: "Brain & Nervous System" },
  orthopaedics:      { color: "#dd6b20", icon: "🦴",  tagline: "Bone, Joint & Spine Care" },
  oncology:          { color: "#2f855a", icon: "🎗️", tagline: "Comprehensive Cancer Care" },
  gynaecology:       { color: "#d53f8c", icon: "🌸",  tagline: "Women's Health & Maternity" },
  paediatrics:       { color: "#3182ce", icon: "👶",  tagline: "Child & Adolescent Care" },
  dermatology:       { color: "#b7791f", icon: "🩺",  tagline: "Skin, Hair & Nails" },
  ophthalmology:     { color: "#2b6cb0", icon: "👁️", tagline: "Eye Care & Vision" },
  ent:               { color: "#285e61", icon: "👂",  tagline: "Ear, Nose & Throat" },
  gastroenterology:  { color: "#744210", icon: "🫁",  tagline: "Digestive & Liver Care" },
  nephrology:        { color: "#2c7a7b", icon: "🫘",  tagline: "Kidney & Renal Care" },
  pulmonology:       { color: "#2d3748", icon: "🫁",  tagline: "Lung & Respiratory Care" },
  psychiatry:        { color: "#553c9a", icon: "🧘",  tagline: "Mental Health & Wellness" },
  endocrinology:     { color: "#276749", icon: "⚗️", tagline: "Hormones & Metabolism" },
  urology:           { color: "#2a4365", icon: "🩻",  tagline: "Urinary & Reproductive Health" },
};

// Get meta by matching department name (case-insensitive)
const getMeta = (name = "") => {
  const key = name.toLowerCase().trim();
  for (const [k, v] of Object.entries(DEPT_META)) {
    if (key.includes(k)) return v;
  }
  // Default fallback if department not in list
  return { color: "#0f4c81", icon: "🏥", tagline: "Medical Speciality" };
};

// ── DeptCard Component ────────────────────────────────────────
const DeptCard = ({ dept }) => {
  const navigate = useNavigate();

  // ✅ Get color/icon/tagline from name (since DB doesn't store these)
  const meta = getMeta(dept.name);

  // ✅ Use description from DB, fallback if missing
  const about = dept.description || "Specialist care with experienced doctors.";

  return (
    <button
      onClick={() => navigate(`/departments/${dept.id}`)}
      className="rounded-2xl p-6 bg-white shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 text-left w-full"
      style={{ borderTop: `4px solid ${meta.color}` }}
    >
      {/* Icon */}
      <p className="text-4xl mb-3">{meta.icon}</p>

      {/* Tagline */}
      <p
        className="text-[10px] font-bold uppercase tracking-widest mb-1"
        style={{ color: meta.color }}
      >
        {meta.tagline}
      </p>

      {/* Name */}
      <h3
        className="font-black text-xl text-[#0f172a]"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {dept.name}
      </h3>

      {/* Description from DB */}
      <p className="text-xs text-gray-500 leading-relaxed mt-2 line-clamp-2">
        {about.slice(0, 100)}…
      </p>

      {/* Head Doctor from DB */}
      {dept.headDoctor && (
        <p className="text-xs text-gray-400 mt-2">
          👨‍⚕️ {dept.headDoctor}
        </p>
      )}

      {/* CTA */}
      <p
        className="text-xs font-bold mt-4"
        style={{ color: meta.color }}
      >
        View Doctors & Hours →
      </p>
    </button>
  );
};

export default DeptCard;