import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import DepartmentList from "./pages/DepartmentList";
import DepartmentDetail from "./pages/DepartmentDetail";
import LabList from "./pages/LabList";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Pateints";
import Billing from "./pages/Billing";
import Pharmacy from "./pages/Pharmacy";
import ProtectedRoute from "./components/ProtectedRoute";
import Appointments from "./pages/Appointments";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import HospitalChatbot from "./components/HospitalChatbot";
import InfoPage from "./pages/InfoPage";
import PublicDoctors from "./pages/PublicDoctors";


// ── Hash Scroller ────────────────────────────────────────────────────────────
// When a link like /#about is clicked, smoothly scrolls to that section.
// When navigating to a normal page (no hash), scrolls back to top.
const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Small delay lets the page render before scrolling
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return null;
};

// ── 404 Page ─────────────────────────────────────────────────────────────────
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fb]">
      <p className="text-6xl mb-4">🏥</p>
      <h2
        className="font-black text-3xl text-[#0f172a] mb-2"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Page Not Found
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        The page you are looking for does not exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 rounded-xl text-sm font-bold text-white"
        style={{ background: "#0f4c81" }}
      >
        Back to Home
      </button>
    </div>
  );
};

// ── AppContent ────────────────────────────────────────────────────────────────
const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToHash /> {/* ✅ Replaces ScrollTop */}
      <Routes>

        {/* ── PUBLIC ROUTES ─────────────────────────────────────────────── */}
        <Route path="/" element={<Home />} />
        <Route path="/departments" element={<DepartmentList />} />
        <Route path="/departments/:id" element={<DepartmentDetail />} />
        <Route path="/labs" element={<LabList />} />
        <Route path="/doctors" element={<PublicDoctors />} />

        {/* ── FOOTER HASH ROUTES ────────────────────────────────────────── */}
        {/* All redirect to Home with a hash — Home page must have matching  */}
        {/* id attributes on each section e.g. <section id="about">         */}

        <Route path="/info/:slug" element={<InfoPage />} />

        {/* ── AUTH ──────────────────────────────────────────────────────── */}
        <Route path="/Adminlogin" element={<AdminLogin />} />

        {/* ── ADMIN PROTECTED ───────────────────────────────────────────── */}
        <Route path="/admin/dashboard"   element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/doctors"     element={<AdminProtectedRoute><Doctors /></AdminProtectedRoute>} />
        <Route path="/admin/patients"    element={<AdminProtectedRoute><Patients /></AdminProtectedRoute>} />
        <Route path="/admin/billing"     element={<AdminProtectedRoute><Billing /></AdminProtectedRoute>} />
        <Route path="/admin/pharmacy"    element={<AdminProtectedRoute><Pharmacy /></AdminProtectedRoute>} />
        <Route path="/admin/appointments"element={<AdminProtectedRoute><Appointments /></AdminProtectedRoute>} />

        {/* ── PATIENT PROTECTED ─────────────────────────────────────────── */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/doctors" element={<Doctors />} />

        {/* ── 404 ───────────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />

      </Routes>

      {!isAdmin && <HospitalChatbot />}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;