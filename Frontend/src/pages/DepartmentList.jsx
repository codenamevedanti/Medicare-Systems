// src/pages/DepartmentList.jsx

import DeptCard from "../components/DeptCard";
import { DEPARTMENTS } from "../data/departments";
import { useNavigate } from "react-router-dom";

const DepartmentList = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-8 py-12">

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm font-semibold text-[#0f4c81] hover:opacity-70 transition-opacity mb-8"
      >
        ← Back to Home
      </button>

      {/* Page Header */}
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-[#c9922a] mb-1">
          Our Specialities
        </p>
        <h1
          className="font-black text-4xl text-[#0f172a] mb-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Departments & Specialities
        </h1>
        <p className="text-sm text-gray-400 mb-10 max-w-xl">
          We offer a wide range of specialities backed by experienced doctors,
          modern equipment and compassionate care. Click any department to
          view doctors and visiting hours.
        </p>

        {/* Departments Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEPARTMENTS.map((dept) => (
            <DeptCard key={dept.id} dept={dept} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default DepartmentList;