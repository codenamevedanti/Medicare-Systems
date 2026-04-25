// src/components/Footer.jsx

import { HOSPITAL } from "../data/hospitalData";
import { DEPARTMENTS } from "../data/departments";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0a2d4e] text-[#c9d8ee] px-8 py-14">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

        {/* Column 1 — Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#c9922a] flex items-center justify-center text-white font-black text-lg">
              R
            </div>
            <p className="font-black text-white text-base leading-tight">
              {HOSPITAL.name}
            </p>
          </div>
          <p className="text-sm leading-relaxed">{HOSPITAL.tagline}</p>
          <p className="text-xs mt-2 text-[#c9d8ee66]">
            NABH Accredited · ISO 9001:2015 · Est. {HOSPITAL.established}
          </p>
        </div>

        {/* Column 2 — Contact */}
        <div>
          <p className="text-[#c9922a] uppercase tracking-widest text-xs font-bold mb-4">
            Contact Us
          </p>
          <div className="space-y-2 text-sm">
            <p>📍 {HOSPITAL.address}</p>
            <p>
              📞{" "}
              <a href={`tel:${HOSPITAL.phone}`} className="hover:underline">
                {HOSPITAL.phone}
              </a>
            </p>
            <p>
              🚨 Emergency:{" "}
              <a href="tel:1800222108" className="text-red-400 font-bold hover:underline">
                1800-222-108
              </a>
            </p>
            <p>
              ✉️{" "}
              <a href={`mailto:${HOSPITAL.email}`} className="hover:underline">
                {HOSPITAL.email}
              </a>
            </p>
          </div>
        </div>

        {/* Column 3 — Quick Links */}
        <div>
          <p className="text-[#c9922a] uppercase tracking-widest text-xs font-bold mb-4">
            Departments
          </p>
          <div className="grid grid-cols-2 gap-1 text-sm">
            {DEPARTMENTS.map((d) => (
              <Link
                key={d.id}
                to={`/departments/${d.id}`}
                className="text-[#c9d8ee] hover:text-white hover:underline transition-colors py-0.5"
              >
                {d.name}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 mt-10 pt-5 text-center text-xs text-[#c9d8ee66]">
        © {new Date().getFullYear()} {HOSPITAL.name}. All rights reserved. |
        Designed with ❤️ for healthcare excellence.
      </div>
    </footer>
  );
};

export default Footer;