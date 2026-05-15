// src/pages/Home.jsx
import { useState, useEffect ,useRef} from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import HeroSection from "../components/HeroSection";
import StatsBar from "../components/StatsBar";
import AboutHistory from "../components/AboutHistory";
import Footer from "../components/Footer";
import HospitalNavbar from "../components/HospitalNavbar";
import WhyChooseUs from "../components/WhyChooseUs";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";

const API = "http://localhost:8081/api";
const CONSULTATION_FEE = 300;
const FOLLOWUP_FEE = 200;
const OPD_FEE = CONSULTATION_FEE;  


// ─────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────
const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const badge = (status) => {
  const map = {
    confirmed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
    scheduled:  "badge badge--scheduled",
  };
  return map[status?.toLowerCase()] ?? "bg-gray-100 text-gray-600";
};

// ─────────────────────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────────────────────
const Steps = ({ current }) => {
  const steps = ["Details", "Payment", "Confirmed"];
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {steps.map((s, i) => {
        const idx = i + 1;
        const done = current > idx;
        const active = current === idx;
        return (
          <div key={s} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={{
                  background: done ? "#22c55e" : active ? "#0f4c81" : "#e2e8f0",
                  color: done || active ? "#fff" : "#94a3b8",
                  boxShadow: active ? "0 0 0 4px rgba(15,76,129,0.15)" : "none",
                }}
              >
                {done ? "✓" : idx}
              </div>
              <span
                className="text-[10px] font-medium"
                style={{ color: active ? "#0f4c81" : "#94a3b8" }}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-12 h-0.5 mb-4 rounded-full"
                style={{ background: done ? "#22c55e" : "#e2e8f0" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const Field = ({ label, required, children }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500 block mb-1">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30 bg-white transition-all";

// ─────────────────────────────────────────────────────────────
// PASSWORD INPUT WITH SHOW/HIDE
// ─────────────────────────────────────────────────────────────
const PasswordInput = ({ name, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder || "••••••••"}
        className={inputCls}
        style={{ paddingRight: "44px" }}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          color: "#94a3b8",
          display: "flex",
          alignItems: "center",
        }}
      >
        {show ? (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
        ) : (
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PATIENT BANNER — shown at top of OPD form when logged in
// ─────────────────────────────────────────────────────────────
const PatientBanner = ({ patient }) => {
  const initials =
    (patient?.firstName?.[0] || "") + (patient?.lastName?.[0] || "");
  const dob = patient?.dateOfBirth
    ? new Date(patient.dateOfBirth).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div
      style={{
        background: "#e8f4f8",
        border: "1px solid #d1e9f0",
        borderRadius: "14px",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "20px",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          background: "#0a4d6e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: 700,
          color: "#fff",
          flexShrink: 0,
        }}
      >
        {initials}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e293b" }}>
          {patient?.firstName} {patient?.lastName}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#64748b",
            marginTop: "2px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {[
            patient?.gender,
            dob ? `DOB: ${dob}` : null,
            patient?.phone ? `+91 ${patient.phone}` : null,
            patient?.email || null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </div>
      </div>

      {/* Badge */}
      <div
        style={{
          fontSize: "11px",
          background: "#d0ece9",
          color: "#0a6e5e",
          borderRadius: "20px",
          padding: "4px 12px",
          fontWeight: 600,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        ✓ Logged in
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// TIME SLOT PICKER
// ─────────────────────────────────────────────────────────────
const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "04:00 PM",
  "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM",
];
// mock a couple as unavailable
const UNAVAILABLE = ["10:00 AM", "11:30 AM", "05:30 PM"];

const SlotPicker = ({ value, onChange }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "8px",
    }}
  >
    {TIME_SLOTS.map((slot) => {
      const unavailable = UNAVAILABLE.includes(slot);
      const selected = value === slot;
      return (
        <button
          key={slot}
          type="button"
          disabled={unavailable}
          onClick={() => !unavailable && onChange(slot)}
          style={{
            padding: "9px 4px",
            borderRadius: "10px",
            border: selected
              ? "2px solid #0a4d6e"
              : "1.5px solid #e2e8f0",
            background: selected
              ? "#0a4d6e"
              : unavailable
              ? "#f8fafc"
              : "#fff",
            color: selected
              ? "#fff"
              : unavailable
              ? "#cbd5e1"
              : "#475569",
            fontSize: "12px",
            fontWeight: selected ? 700 : 500,
            cursor: unavailable ? "not-allowed" : "pointer",
            textDecoration: unavailable ? "line-through" : "none",
            transition: "all 0.15s",
          }}
        >
          {slot}
        </button>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────
// STEP 1 — OPD DETAILS FORM
// Two variants: logged-in (compact) vs guest (full)
// ─────────────────────────────────────────────────────────────
const DetailsForm = ({ departments, form, onChange, onSlotChange, onNext, patient }) => {
  const isLoggedIn = !!patient;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-5"
    >
      {/* ── Logged-in: show patient banner, skip personal fields ── */}
      {isLoggedIn ? (
        <PatientBanner patient={patient} />
      ) : (
        /* ── Guest: show all personal detail fields ── */
        <>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#0a4d6e",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              borderBottom: "1.5px solid #e2f0f7",
              paddingBottom: "6px",
              marginBottom: "4px",
            }}
          >
            Personal Details
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" required>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                required
                placeholder="Ramesh"
                className={inputCls}
              />
            </Field>
            <Field label="Last Name" required>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                required
                placeholder="Patil"
                className={inputCls}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date of Birth" required>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={onChange}
                required
                max={new Date().toISOString().split("T")[0]}
                className={inputCls}
              />
            </Field>
            <Field label="Gender" required>
              <select
                name="gender"
                value={form.gender}
                onChange={onChange}
                required
                className={inputCls + " cursor-pointer"}
              >
                <option value="">-- Select --</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone" required>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={onChange}
                required
                placeholder="9876543210"
                pattern="[0-9]{10}"
                className={inputCls}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="optional"
                className={inputCls}
              />
            </Field>
          </div>
        </>
      )}

      {/* ── Appointment Details (always shown) ── */}
      <p
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#0a4d6e",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          borderBottom: "1.5px solid #e2f0f7",
          paddingBottom: "6px",
        }}
      >
        Appointment Details
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Department" required>
          <select
            name="department"
            value={form.department}
            onChange={onChange}
            required
            className={inputCls + " cursor-pointer"}
          >
            <option value="">-- Select Department --</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Visit Type" required>
          <select
            name="visitType"
            value={form.visitType}
            onChange={onChange}
            className={inputCls + " cursor-pointer"}
          >
            <option value="New Consultation">New Consultation</option>
            <option value="Follow-up Visit">Follow-up Visit</option>
          </select>
        </Field>
      </div>

      <Field label="Preferred Date" required>
        <input
          type="date"
          name="preferredDate"
          value={form.preferredDate}
          onChange={onChange}
          required
          min={new Date().toISOString().split("T")[0]}
          className={inputCls}
        />
      </Field>

      {/* Time Slot */}
      <div>
        <label
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Preferred Time Slot
        </label>
        <SlotPicker value={form.timeSlot} onChange={onSlotChange} />
        {UNAVAILABLE.length > 0 && (
          <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px" }}>
            Strikethrough slots are unavailable
          </p>
        )}
      </div>

      <Field label="Chief Complaint / Reason for Visit">
        <textarea
          name="reason"
          value={form.reason}
          onChange={onChange}
          rows={3}
          placeholder="Briefly describe your symptoms or reason for visit..."
          className={inputCls + " resize-none"}
          style={{ lineHeight: "1.5" }}
        />
      </Field>

      {/* Fee + CTA */}
      <div
        style={{
          background: "linear-gradient(135deg, #f0f9ff 0%, #e8f4f8 100%)",
          border: "1.5px solid #b2d9ed",
          borderRadius: "16px",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <div>
          <p style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
            Consultation Fee
          </p>
          <p
            style={{ fontSize: "28px", fontWeight: 900, color: "#0a4d6e", lineHeight: 1.1 }}
          >
            ₹{form.visitType === "Follow-up Visit" ? FOLLOWUP_FEE : CONSULTATION_FEE}
          </p>
          <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
            Pay via UPI / Card / Net Banking
          </p>
        </div>
        <button
          type="submit"
          style={{
            padding: "13px 26px",
            background: "#0a4d6e",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 14px rgba(10,77,110,0.3)",
            transition: "all 0.2s",
          }}
        >
          Proceed to Payment →
        </button>
      </div>
    </form>
  );
};

// ─────────────────────────────────────────────────────────────
// STEP 2 — PAYMENT 
// ─────────────────────────────────────────────────────────────
const PaymentGateway = ({ form, onSuccess, onBack }) => {
  const fee = form.visitType === "Follow-up Visit" ? FOLLOWUP_FEE : CONSULTATION_FEE;
  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bank, setBank] = useState("");

  const handlePay = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => { setProcessing(false); onSuccess(); }, 2000);
  };

  const methodIcons = {
    upi: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    card: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    netbanking: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l9-3 9 3M3 6v14h18V6M9 10v6M15 10v6M12 10v6" />
      </svg>
    ),
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Booking Summary Card */}
      <div style={{
        background: "linear-gradient(135deg, #0a4d6e 0%, #1a6db5 100%)",
        borderRadius: "16px",
        padding: "20px",
        color: "#fff",
      }}>
        <p style={{ fontSize: "11px", fontWeight: 700, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
          Booking Summary
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontWeight: 800, fontSize: "16px", marginBottom: "4px" }}>
              {form.firstName} {form.lastName}
            </p>
            <p style={{ fontSize: "13px", opacity: 0.85, marginBottom: "2px" }}>
              🏥 {form.department}
            </p>
            <p style={{ fontSize: "13px", opacity: 0.85, marginBottom: "2px" }}>
              📅 {fmt(form.preferredDate)}{form.timeSlot ? ` · ${form.timeSlot}` : ""}
            </p>
            {form.visitType && (
              <p style={{ fontSize: "12px", opacity: 0.7 }}>{form.visitType}</p>
            )}
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ fontSize: "11px", opacity: 0.7 }}>Amount Due</p>
            <p style={{ fontSize: "28px", fontWeight: 900, lineHeight: 1.1 }}>₹{fee}</p>
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div>
        <p style={{ fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
          Select Payment Method
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          {["upi", "card", "netbanking"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              style={{
                padding: "12px 8px",
                borderRadius: "12px",
                border: method === m ? "2px solid #0a4d6e" : "1.5px solid #e2e8f0",
                background: method === m ? "#e8f4f8" : "#f8fafc",
                color: method === m ? "#0a4d6e" : "#94a3b8",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
                fontWeight: method === m ? 700 : 500,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {methodIcons[m]}
              {m === "upi" ? "UPI" : m === "card" ? "Card" : "Net Banking"}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Input Fields */}
      <form onSubmit={handlePay} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {method === "upi" && (
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>
              UPI ID
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className={inputCls}
                style={{ paddingLeft: "42px" }}
              />
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>📱</span>
            </div>
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
              Supports all UPI apps — GPay, PhonePe, Paytm, BHIM
            </p>
          </div>
        )}

        {method === "card" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>
                Card Number
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={cardNum}
                  onChange={e => setCardNum(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())}
                  placeholder="1234  5678  9012  3456"
                  maxLength={19}
                  className={inputCls}
                  style={{ paddingLeft: "42px", letterSpacing: "0.1em" }}
                />
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>💳</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>Expiry</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                    if (v.length > 2) v = v.slice(0, 2) + " / " + v.slice(2);
                    setExpiry(v);
                  }}
                  placeholder="MM / YY"
                  maxLength={7}
                  className={inputCls}
                  style={{ textAlign: "center", letterSpacing: "0.1em" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  placeholder="•••"
                  maxLength={3}
                  className={inputCls}
                  style={{ textAlign: "center", letterSpacing: "0.2em" }}
                />
              </div>
            </div>
            <p style={{ fontSize: "11px", color: "#94a3b8" }}>🔒 Your card data is encrypted and never stored</p>
          </div>
        )}

        {method === "netbanking" && (
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>
              Select Your Bank
            </label>
            <select value={bank} onChange={e => setBank(e.target.value)} className={inputCls}>
              <option value="">-- Choose Bank --</option>
              <option>State Bank of India</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
              <option>Kotak Mahindra Bank</option>
              <option>Bank of Baroda</option>
              <option>Punjab National Bank</option>
            </select>
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
              You will be redirected to your bank's secure portal
            </p>
          </div>
        )}

        {/* Security note */}
        <div style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "10px",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          color: "#15803d",
        }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          100% secure · SSL encrypted · PCI DSS compliant
        </div>

        {/* Pay Button */}
        <button
          type="submit"
          disabled={processing}
          style={{
            width: "100%",
            padding: "16px",
            background: processing ? "#94a3b8" : "linear-gradient(135deg, #0a4d6e, #1a6db5)",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            fontSize: "16px",
            fontWeight: 800,
            cursor: processing ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            transition: "all 0.2s",
            boxShadow: processing ? "none" : "0 4px 16px rgba(10,77,110,0.35)",
            marginTop: "4px",
          }}
        >
          {processing ? (
            <>
              <svg style={{ animation: "spin 1s linear infinite", width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing Payment...
            </>
          ) : (
            <>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Pay Securely ₹{fee}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "#94a3b8",
            fontSize: "13px",
            cursor: "pointer",
            padding: "6px",
            textAlign: "center",
            width: "100%",
          }}
        >
          ← Go Back
        </button>
      </form>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// STEP 3 — CONFIRMATION
// ─────────────────────────────────────────────────────────────
const Confirmation = ({ form, onViewDashboard }) => {
  const fee = form.visitType === "Follow-up Visit" ? FOLLOWUP_FEE : CONSULTATION_FEE;

  return (
    <div style={{ textAlign: "center", padding: "32px 24px" }}>
      <div
        style={{
          width: "72px",
          height: "72px",
          background: "#dcfce7",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}
      >
        <svg width="36" height="36" fill="none" stroke="#16a34a" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: 900, color: "#0f172a" }}>
        Appointment Confirmed!
      </h2>
      <p style={{ margin: "0 0 4px", fontSize: "14px", color: "#16a34a", fontWeight: 600 }}>
        ✅ Your OPD booking is confirmed for {fmt(form.preferredDate)}
      </p>
      <p style={{ margin: "0 0 24px", fontSize: "13px", color: "#94a3b8" }}>
        A confirmation has been sent to your registered contact.
      </p>

      {/* Summary */}
      <div
        style={{
          background: "#f8fafc",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "left",
          marginBottom: "24px",
        }}
      >
        {[
          ["Patient", `${form.firstName} ${form.lastName}`],
          ["Department", form.department],
          ["Date", fmt(form.preferredDate)],
          form.timeSlot ? ["Time Slot", form.timeSlot] : null,
          form.visitType ? ["Visit Type", form.visitType] : null,
          ["Amount Paid", `₹${fee}`], 
        ]
          .filter(Boolean)
          .map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #f1f5f9",
                fontSize: "13px",
              }}
            >
              <span style={{ color: "#94a3b8" }}>{label}</span>
              <span
                style={{
                  fontWeight: 700,
                  color: label === "Amount Paid" ? "#16a34a" : "#0f172a",
                }}
              >
                {value}
              </span>
            </div>
          ))}
      </div>

      <button
        onClick={() => { if (onViewDashboard) onViewDashboard(); }}
        style={{
          width: "100%",
          padding: "14px",
          background: "#0f4c81",
          color: "#fff",
          border: "none",
          borderRadius: "14px",
          fontSize: "15px",
          fontWeight: 800,
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(15,76,129,0.3)",
        }}
      >
        View My Dashboard →
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// OPD BOOKING FLOW
// ─────────────────────────────────────────────────────────────
const OpdBookingFlow = ({ departments, patient, token, onDone, onClose }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // Personal — pre-filled from patient if logged in
    firstName: patient?.firstName || "",
    lastName: patient?.lastName || "",
    dateOfBirth: patient?.dateOfBirth || "",
    gender: patient?.gender || "",
    phone: patient?.phone || "",
    email: patient?.email || "",
    // Appointment fields — always blank
    department: "",
    visitType: "New Consultation",
    preferredDate: "",
    timeSlot: "",
    reason: "",
  });

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSlotChange = (slot) =>
    setForm((p) => ({ ...p, timeSlot: slot }));

    const handlePaymentSuccess = async () => {
      try {
        const savedAppt = await axios.post(
          `${API}/appointments`,
          { ...form, patientId: patient?.id,
            status: "PAID"},
          { headers: { Authorization: `Bearer ${token}` } }
        );
    
        const fee = form.visitType === "Follow-up Visit" ? FOLLOWUP_FEE : CONSULTATION_FEE;
        await axios.post(
          `${API}/billing/${patient?.id}`,
          {
            items: [
              {
                itemName: form.visitType,
                category: "CONSULTATION",
                quantity: 1,
                price: fee,
                totalPrice: fee,
              },
            ],
            totalAmount: fee,
            paidAmount: fee,
            paymentStatus: "PAID",
            date: new Date().toISOString(),
            paymentMethod: "Online",
            doctorName: null,
            discountAmount: 0,
            notes: `${form.visitType} - ${form.department} on ${form.preferredDate}`,
            appointment: savedAppt.data?.id ? { id: savedAppt.data.id } : null,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
    
        setStep(3);
        onDone();
    
      } catch (err) {
        console.error("Booking failed:", err.response?.data || err.message);
      }
    };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(10, 15, 30, 0.88)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px", overflowY: "auto",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#ffffff", borderRadius: "24px", width: "100%",
        maxWidth: "520px", boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        overflow: "hidden", maxHeight: "92vh", overflowY: "auto",
        position: "relative", flexShrink: 0,
      }}>
        {/* Sticky header */}
        <div style={{
          position: "sticky", top: 0, background: "#ffffff",
          padding: "24px 32px 14px", borderBottom: "1px solid #f1f5f9", zIndex: 10,
        }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "16px", right: "16px",
              width: "32px", height: "32px", borderRadius: "50%",
              border: "none", background: "#f1f5f9", cursor: "pointer",
              fontSize: "18px", color: "#64748b", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            ×
          </button>

          {/* Hospital branding */}
          <div className="flex items-center gap-3 mb-1">
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "#0a4d6e",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v4M10 16h4" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 900, color: "#0f4c81", margin: 0 }}>Book OPD Appointment</h2>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0" }}>Ratnadeep Multi-Speciality Hospital</p>
            </div>
          </div>

          <div style={{ marginTop: "16px" }}>
            <Steps current={step} />
          </div>
        </div>

        {/* Form body */}
        <div style={{ padding: "20px 32px 32px" }}>
          {step === 1 && (
            <DetailsForm
              departments={departments}
              form={form}
              onChange={handleChange}
              onSlotChange={handleSlotChange}
              onNext={() => setStep(2)}
              patient={patient} // ← key prop: null for guests, object for logged-in
            />
          )}
          {step === 2 && (
            <PaymentGateway
              form={form}
              onSuccess={handlePaymentSuccess}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <Confirmation form={form} onViewDashboard={onDone} />
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// AUTH — LOGIN FORM
// ─────────────────────────────────────────────────────────────
const LoginForm = ({ onBack, onSuccess }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, form);
      const token = res.data.token;
      console.log("Login token:", token);
      
      // Fetch patient profile using the token
      const profileRes = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userId = profileRes.data.id;
      console.log("User id:", userId);

      const patientRes = await axios.get(`${API}/patients/by-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const patientData = patientRes.data;
      console.log("Patient data:", patientData);
      
      onSuccess(patientData, token);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message); 
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-[#0f4c81]/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
          
          <svg 
          style={{ width: "28px", height: "28px", flexShrink: 0 }}
          className="text-[#0f4c81]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24">
            
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-black text-gray-800">Welcome Back</h3>
        <p className="text-sm text-gray-400 mt-0.5">Sign in with your Patient ID or phone</p>
      </div>

      <Field label="Phone / Email" required>
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
          required
          placeholder="e.g. abc@gmail.com or 9876543210"
          className={inputCls}
        />
      </Field>

      <Field label="Password" required>
        <PasswordInput
          name="password"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          placeholder="••••••••"
        />
      </Field>

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "13px",
            color: "#dc2626",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#0f4c81] text-white font-black rounded-xl hover:bg-[#0d3f6e] transition-all shadow-lg disabled:opacity-60 text-sm"
      >
        {loading ? "Signing in..." : "Sign In →"}
      </button>
      <button
        type="button"
        onClick={onBack}
        className="text-gray-400 w-full text-sm hover:text-gray-600 transition-colors"
      >
        ← Back
      </button>
    </form>
  );
};

// ─────────────────────────────────────────────────────────────
// AUTH — REGISTER FORM
// ─────────────────────────────────────────────────────────────
const RegisterForm = ({ onBack, onSuccess }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      setLoading(true);
      try {
        // Step 1 — Register
        await axios.post(`${API}/auth/register`, form);
    
        // Step 2 — Login to get token
        const loginRes = await axios.post(`${API}/auth/login`, {
          username: form.phone || form.email,
          password: form.password,
        });
        const token = loginRes.data.token;
    
        // Step 3 — Get userId from token  ← YOU WERE MISSING THIS
        const profileRes = await axios.get(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userId = profileRes.data.id;  // ← defines userId
    
        // Step 4 — Get patient record using userId
        const patientRes = await axios.get(`${API}/patients/by-user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const patientData = patientRes.data;
    
        onSuccess(patientData, token);  // ← patientData not UserData
    
      } catch (err) {
        setError(
          err.response?.data?.message || "Registration failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <svg 
           style={{ width: "28px", height: "28px", flexShrink: 0 }}
           className="text-emerald-600" 
           fill="none" 
           stroke="currentColor" 
           viewBox="0 0 24 24" >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h3 className="text-xl font-black text-gray-800">New Patient</h3>
        <p className="text-sm text-gray-400 mt-0.5">Create your patient account</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="First Name" required>
          <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required className={inputCls} />
        </Field>
        <Field label="Last Name" required>
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required className={inputCls} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Phone" required>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="9876543210" pattern="[0-9]{10}" className={inputCls} />
        </Field>
        <Field label="Date of Birth" required>
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required max={new Date().toISOString().split("T")[0]} className={inputCls} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Gender" required>
          <select name="gender" value={form.gender} onChange={handleChange} required className={inputCls + " cursor-pointer"}>
            <option value="">-- Select --</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </Field>
        <Field label="Email">
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="optional" className={inputCls} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Password" required>
          <PasswordInput
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Min 6 chars"
          />
        </Field>
        <Field label="Confirm Password" required>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Repeat"
            className={inputCls}
          />
        </Field>
      </div>

      {error && (
        <p className="text-red-500 text-xs bg-red-50 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-60 text-sm"
      >
        {loading ? "Creating account..." : "Create Account & Continue →"}
      </button>
      <button
        type="button"
        onClick={onBack}
        className="text-gray-400 w-full text-sm hover:text-gray-600 transition-colors"
      >
        ← Back
      </button>
    </form>
  );
};

// ─────────────────────────────────────────────────────────────
// AUTH CHOICE MODAL
// ─────────────────────────────────────────────────────────────
const AuthModal = ({ onClose, onAuthenticated }) => {
  const [view, setView] = useState("choice");

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(10, 15, 30, 0.88)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px", overflowY: "auto",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "420px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
          position: "relative",
        }}
      >
        <div style={{ padding: "32px 32px 28px" }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "none",
              background: "#f1f5f9",
              cursor: "pointer",
              fontSize: "18px",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>

          {view === "choice" && (
            <div>
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    background: "#0f4c81",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#0f172a" }}>
                  Hospital Portal
                </h2>
                <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#94a3b8" }}>
                  Ratnadeep Multi-Speciality Hospital
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <button
                  onClick={() => setView("login")}
                  style={{
                    padding: "14px",
                    background: "#0f4c81",
                    color: "#fff",
                    border: "none",
                    borderRadius: "14px",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In — Existing Patient
                </button>
                <button
                  onClick={() => setView("register")}
                  style={{
                    padding: "14px",
                    background: "#fff",
                    color: "#0f4c81",
                    border: "2px solid #0f4c81",
                    borderRadius: "14px",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register — New Patient
                </button>
              </div>

              <p
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  color: "#94a3b8",
                  marginTop: "20px",
                }}
              >
                🔒 Your health records are encrypted & secure
              </p>
            </div>
          )}

          {view === "login" && (
            <LoginForm
              onBack={() => setView("choice")}
              onSuccess={onAuthenticated}
            />
          )}
          {view === "register" && (
            <RegisterForm
              onBack={() => setView("choice")}
              onSuccess={onAuthenticated}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// VITALS CARD
// ─────────────────────────────────────────────────────────────
const VitalsCard = ({ vitals }) => {
  const items = [
    { label: "Weight", value: vitals?.weight ? `${vitals.weight} kg` : "—", icon: "⚖️", color: "bg-purple-50 border-purple-100" },
    { label: "Blood Sugar", value: vitals?.bloodSugar ? `${vitals.bloodSugar} mg/dL` : "—", icon: "🩸", color: "bg-red-50 border-red-100" },
    { label: "Blood Pressure", value: vitals?.bloodPressure || "—", icon: "💗", color: "bg-pink-50 border-pink-100" },
    { label: "Temperature", value: vitals?.temperature ? `${vitals.temperature}°F` : "—", icon: "🌡️", color: "bg-orange-50 border-orange-100" },
    { label: "Pulse", value: vitals?.pulse ? `${vitals.pulse} bpm` : "—", icon: "❤️", color: "bg-rose-50 border-rose-100" },
    { label: "SpO2", value: vitals?.spo2 ? `${vitals.spo2}%` : "—", icon: "🫁", color: "bg-blue-50 border-blue-100" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map(({ label, value, icon, color }) => (
        <div key={label} className={`${color} border rounded-2xl p-4`}>
          <div className="text-2xl mb-1">{icon}</div>
          <p className="text-xs text-gray-400 font-medium">{label}</p>
          <p className="text-lg font-black text-gray-800">{value}</p>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PATIENT DASHBOARD
// ─────────────────────────────────────────────────────────────
const PatientDashboard = ({ onBookOpd, refreshKey }) => {
  const { patient, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [vitals, setVitals] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [billing, setBilling] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patient?.id || !token) { setLoading(false); return; }
    setLoading(true);
    const headers = { Authorization: `Bearer ${token}` };
    Promise.allSettled([
      axios.get(`${API}/patients/${patient.id}/appointments`, { headers }),
      axios.get(`${API}/vitals/patient/${patient.id}`, { headers }),
      axios.get(`${API}/prescriptions/patient/${patient.id}`, { headers }),
     axios.get(`${API}/lab-reports/patient/${patient.id}`, { headers }),
     axios.get(`${API}/billing/patient/${patient.id}`, { headers }),
    ]).then(([appts, vit, pres, labs, bill]) => {
      if (appts.status === "fulfilled") {
        console.log("Appointment fields:", appts.value.data?.[0]);
        setAppointments(appts.value.data || []);
      }
      if (vit.status  === "fulfilled") setVitals(vit.value.data || null);
      if (pres.status === "fulfilled") setPrescriptions(pres.value.data || []);
      if (labs.status === "fulfilled") setLabReports(labs.value.data || []);
      if (bill.status === "fulfilled") setBilling(bill.value.data || []);
      setLoading(false);
    });
  }, [patient?.id, token, refreshKey]);

  const tabs = [
    { id: "appointments", label: "Appointments", icon: "📋" },
    { id: "vitals",       label: "Vitals",       icon: "💓" },
    { id: "prescriptions",label: "Prescriptions",icon: "💊" },
    { id: "labs",         label: "Lab Reports",  icon: "🧪" },
    { id: "billing",      label: "Billing",      icon: "💳" },
  ];

  const upcoming = appointments.filter(
    (a) => ["scheduled","confirmed"].includes(a.status?.toLowerCase())
  ).length;

  return (
    <>
      <style>{`
        .pd-wrap { min-height:100vh; background:#eef2f7; font-family:'Segoe UI',system-ui,sans-serif; }

        /* NAV */
        .pd-nav {
          background:#fff; border-bottom:1px solid #dde6ee;
          position:sticky; top:0; z-index:10;
          box-shadow:0 1px 8px rgba(13,59,94,.07);
        }
        .pd-nav-inner {
          max-width:1000px; margin:0 auto;
          padding:14px 24px;
          display:flex; align-items:center; justify-content:space-between;
        }
        .pd-nav-brand { display:flex; align-items:center; gap:12px; }
        .pd-nav-logo {
          width:38px; height:38px; background:#1565a0; border-radius:10px;
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .pd-nav-title { font-size:14px; font-weight:800; color:#1a2a3a; }
        .pd-nav-sub   { font-size:11px; color:#90a4ae; }
        .pd-nav-actions { display:flex; gap:10px; }
        .pd-btn-primary {
          padding:9px 18px; background:#1565a0; color:#fff;
          border:none; border-radius:10px; font-size:12px; font-weight:700;
          cursor:pointer; transition:background .15s;
        }
        .pd-btn-primary:hover { background:#0d3b5e; }
        .pd-btn-ghost {
          padding:9px 16px; background:#f0f4f8; color:#607d8b;
          border:none; border-radius:10px; font-size:12px; font-weight:700;
          cursor:pointer; transition:background .15s;
        }
        .pd-btn-ghost:hover { background:#dde6ee; }

        /* BODY */
        .pd-body { max-width:1000px; margin:0 auto; padding:32px 24px 64px; }

        /* HEADER BANNER */
        .pd-banner {
          background:linear-gradient(135deg,#0d3b5e 0%,#1565a0 55%,#2196f3 100%);
          border-radius:16px; padding:28px 32px;
          display:flex; align-items:center; justify-content:space-between;
          gap:20px; margin-bottom:24px;
          box-shadow:0 6px 28px rgba(13,59,94,.18);
          position:relative; overflow:hidden;
        }
        .pd-banner::before {
          content:''; position:absolute; top:-50px; right:-50px;
          width:200px; height:200px; border-radius:50%;
          background:rgba(255,255,255,.05);
        }
        .pd-banner-left { display:flex; align-items:center; gap:18px; z-index:1; }
        .pd-avatar {
          width:58px; height:58px; border-radius:14px;
          background:rgba(255,255,255,.2);
          border:2px solid rgba(255,255,255,.3);
          display:flex; align-items:center; justify-content:center;
          font-size:20px; font-weight:900; color:#fff; flex-shrink:0;
          letter-spacing:1px;
        }
        .pd-banner-name  { font-size:22px; font-weight:800; color:#fff; margin-bottom:4px; }
        .pd-banner-meta  { font-size:13px; color:rgba(255,255,255,.75); }
        .pd-banner-right { text-align:right; z-index:1; flex-shrink:0; }
        .pd-banner-id-label { font-size:11px; color:rgba(255,255,255,.6); margin-bottom:2px; }
        .pd-banner-id { font-size:18px; font-weight:800; color:#fff; font-family:monospace; }
        .pd-banner-since { font-size:11px; color:rgba(255,255,255,.55); margin-top:3px; }
        @media(max-width:580px){ .pd-banner-right{ display:none; } }

        /* STATS */
        .pd-stats {
          display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:24px;
        }
        @media(max-width:680px){ .pd-stats{ grid-template-columns:repeat(2,1fr); } }
        .pd-stat {
          background:#fff; border-radius:14px; padding:20px 16px;
          text-align:center; border:1.5px solid #dde6ee;
          box-shadow:0 2px 10px rgba(13,59,94,.07);
          position:relative; overflow:hidden;
          transition:transform .18s, box-shadow .18s;
        }
        .pd-stat:hover { transform:translateY(-3px); box-shadow:0 6px 24px rgba(13,59,94,.13); }
        .pd-stat-bar {
          position:absolute; top:0; left:0; right:0; height:3px;
          background:var(--c,#1565a0); border-radius:14px 14px 0 0;
        }
        .pd-stat-icon  { font-size:24px; margin-bottom:8px; }
        .pd-stat-val   { font-size:28px; font-weight:800; color:#0d3b5e; line-height:1; margin-bottom:4px; }
        .pd-stat-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:#90a4ae; }

        /* MAIN CARD */
        .pd-card {
          background:#fff; border-radius:16px;
          border:1.5px solid #dde6ee;
          box-shadow:0 2px 10px rgba(13,59,94,.07);
          overflow:hidden;
        }

        /* TABS */
        .pd-tabs {
          display:flex; border-bottom:2px solid #dde6ee;
          background:#f6f9fd; overflow-x:auto; scrollbar-width:none;
        }
        .pd-tabs::-webkit-scrollbar{ display:none; }
        .pd-tab {
          flex:1; min-width:110px; padding:14px 8px;
          font-size:12.5px; font-weight:700; color:#90a4ae;
          border:none; background:none; cursor:pointer;
          white-space:nowrap; border-bottom:3px solid transparent;
          margin-bottom:-2px; display:flex; align-items:center;
          justify-content:center; gap:6px;
          transition:color .15s, border-color .15s, background .15s;
        }
        .pd-tab:hover { color:#1565a0; background:#eff6ff; }
        .pd-tab.active { color:#1565a0; border-bottom-color:#1565a0; background:#fff; }

        /* TAB BODY */
        .pd-tab-body { padding:28px 30px; }

        /* TABLE */
        .pd-tbl-wrap { overflow-x:auto; }
        .pd-tbl { width:100%; border-collapse:collapse; font-size:14px; }
        .pd-tbl thead tr { background:#f4f8fc; border-bottom:2px solid #dde6ee; }
        .pd-tbl th {
          text-align:left; padding:11px 14px;
          font-size:11px; font-weight:700;
          text-transform:uppercase; letter-spacing:.65px; color:#90a4ae; white-space:nowrap;
        }
        .pd-tbl td { padding:13px 14px; border-bottom:1px solid #dde6ee; vertical-align:middle; }
        .pd-tbl tbody tr:last-child td { border-bottom:none; }
        .pd-tbl tbody tr:hover td { background:#f7fbff; }

        /* BADGES */
        .bx { display:inline-block; padding:4px 12px; border-radius:20px; font-size:11.5px; font-weight:700; }
        .bx-scheduled  { background:#e3f2fd; color:#1565a0; }
        .bx-confirmed  { background:#e8f5e9; color:#2e7d32; }
        .bx-pending    { background:#fff3e0; color:#e65100; }
        .bx-cancelled  { background:#ffebee; color:#c62828; }
        .bx-completed  { background:#ede7f6; color:#4527a0; }
        .bx-default    { background:#eceff1; color:#546e7a; }

        /* VITALS GRID */
        .vitals-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        @media(max-width:560px){ .vitals-grid{ grid-template-columns:repeat(2,1fr); } }
        .vital-card {
          padding:16px; border-radius:12px; border:1.5px solid var(--bc,#e3f2fd);
          background:var(--bg,#f0f8ff);
        }
        .vital-icon  { font-size:22px; margin-bottom:6px; }
        .vital-label { font-size:11px; color:#90a4ae; font-weight:600; margin-bottom:3px; }
        .vital-val   { font-size:20px; font-weight:800; color:#1a2a3a; }

        /* FEE CARDS */
        .fee-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:24px; }
        @media(max-width:520px){ .fee-row{ grid-template-columns:1fr; } }
        .fee-c {
          display:flex; align-items:center; justify-content:space-between;
          padding:18px 20px; border-radius:12px; border:2px solid transparent;
          transition:transform .18s;
        }
        .fee-c:hover { transform:translateY(-2px); }
        .fee-c--blue  { background:linear-gradient(135deg,#dbeeff,#eff8ff); border-color:#90caf9; }
        .fee-c--green { background:linear-gradient(135deg,#d4edda,#f0fff4); border-color:#a5d6a7; }
        .fee-c__left  { display:flex; align-items:center; gap:12px; }
        .fee-c__icon  {
          width:48px; height:48px; border-radius:11px;
          background:rgba(255,255,255,.8); display:flex; align-items:center;
          justify-content:center; font-size:24px;
          box-shadow:0 2px 8px rgba(0,0,0,.07); flex-shrink:0;
        }
        .fee-c__title { font-size:14px; font-weight:700; color:#1a2a3a; margin-bottom:2px; }
        .fee-c__sub   { font-size:11.5px; color:#90a4ae; }
        .fee-c__price { display:flex; align-items:baseline; gap:2px; }
        .fee-c__rs    { font-size:16px; font-weight:700; }
        .fee-c__amt   { font-size:36px; font-weight:900; letter-spacing:-1.5px; line-height:1; }
        .fee-c__per   { font-size:11px; color:#90a4ae; align-self:flex-end; margin-bottom:4px; margin-left:2px; }
        .fee-c--blue  .fee-c__rs, .fee-c--blue  .fee-c__amt { color:#1565a0; }
        .fee-c--green .fee-c__rs, .fee-c--green .fee-c__amt { color:#2e7d32; }

        .section-label {
          font-size:11px; font-weight:700; text-transform:uppercase;
          letter-spacing:.8px; color:#90a4ae; margin-bottom:14px;
        }
        .fee-divider { height:1px; background:#dde6ee; margin:0 0 22px; }
        .type-pill { display:inline-block; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
        .tp-consult  { background:#e3f2fd; color:#1565a0; }
        .tp-followup { background:#e8f5e9; color:#2e7d32; }
        .amt-cell { font-weight:700; color:#1565a0; }

        /* TOTAL BANNER */
        .total-banner {
          background:#e3f2fd; border-radius:12px; padding:16px 20px;
          display:flex; justify-content:space-between; align-items:center;
          margin-bottom:18px;
        }
        .total-banner span:first-child { font-size:13px; font-weight:700; color:#607d8b; }
        .total-banner span:last-child  { font-size:22px; font-weight:900; color:#1565a0; }

        /* EMPTY */
        .pd-empty { text-align:center; padding:52px 24px; }
        .pd-empty-icon  { font-size:50px; margin-bottom:14px; }
        .pd-empty-title { font-size:16px; font-weight:700; color:#1a2a3a; margin-bottom:6px; }
        .pd-empty-desc  { font-size:13px; color:#90a4ae; }

        /* SPINNER */
        .pd-spin {
          display:flex; align-items:center; justify-content:center; padding:52px;
        }
        .pd-spinner {
          width:36px; height:36px; border:4px solid #dde6ee;
          border-top-color:#1565a0; border-radius:50%;
          animation:pdspin .8s linear infinite;
        }
        @keyframes pdspin { to{ transform:rotate(360deg); } }
      `}</style>

      <div className="pd-wrap">
        {/* NAV */}
        <nav className="pd-nav">
          <div className="pd-nav-inner">
            <div className="pd-nav-brand">
              <div className="pd-nav-logo">
                <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div className="pd-nav-title">Ratnadeep Hospital</div>
                <div className="pd-nav-sub">Patient Dashboard</div>
              </div>
            </div>
            <div className="pd-nav-actions">
              <button className="pd-btn-primary" onClick={onBookOpd}>+ Book Appointment</button>
              <button className="pd-btn-ghost"   onClick={logout}>Sign Out</button>
            </div>
          </div>
        </nav>

        {/* BODY */}
        <div className="pd-body">

          {/* BANNER */}
          <div className="pd-banner">
            <div className="pd-banner-left">
              <div className="pd-avatar">
                {patient?.firstName?.[0] || "?"}{patient?.lastName?.[0] || ""}
              </div>
              <div>
                <div className="pd-banner-name">{patient?.firstName} {patient?.lastName}</div>
                <div className="pd-banner-meta">
                  {[patient?.gender, patient?.phone ? `📱 ${patient.phone}` : null].filter(Boolean).join("  ·  ")}
                </div>
              </div>
            </div>
            <div className="pd-banner-right">
              <div className="pd-banner-id-label">Patient ID</div>
              <div className="pd-banner-id">{patient?.patientId ?? patient?.id}</div>
              <div className="pd-banner-since">Since {fmt(patient?.createdAt ?? patient?.registeredAt)}</div>
            </div>
          </div>

          {/* STATS */}
          <div className="pd-stats">
            {[
              { icon:"🏥", val: appointments.length,  label:"Total Visits",   c:"#1565a0" },
              { icon:"📅", val: upcoming,             label:"Upcoming",       c:"#00838f" },
              { icon:"💊", val: prescriptions.length, label:"Prescriptions",  c:"#c62828" },
              { icon:"🧪", val: labReports.length,    label:"Lab Reports",    c:"#2e7d32" },
            ].map(({ icon, val, label, c }) => (
              <div className="pd-stat" key={label} style={{"--c": c}}>
                <div className="pd-stat-bar" />
                <div className="pd-stat-icon">{icon}</div>
                <div className="pd-stat-val">{val}</div>
                <div className="pd-stat-label">{label}</div>
              </div>
            ))}
          </div>

          {/* CARD + TABS */}
          <div className="pd-card">
            <div className="pd-tabs">
              {tabs.map(({ id, label, icon }) => (
                <button
                  key={id}
                  className={`pd-tab${activeTab === id ? " active" : ""}`}
                  onClick={() => setActiveTab(id)}
                >
                  <span>{icon}</span>{label}
                </button>
              ))}
            </div>

            <div className="pd-tab-body">
              {loading ? (
                <div className="pd-spin"><div className="pd-spinner" /></div>
              ) : (
                <>
                  {/* ── APPOINTMENTS ── */}
                  {activeTab === "appointments" && (
                    appointments.length === 0 ? (
                      <div className="pd-empty">
                        <div className="pd-empty-icon">📋</div>
                        <div className="pd-empty-title">No appointments yet</div>
                        <div className="pd-empty-desc">
                          <button className="pd-btn-primary" style={{marginTop:12}} onClick={onBookOpd}>
                            Book Your First Appointment
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pd-tbl-wrap">
                        <table className="pd-tbl">
                          <thead><tr>
                            <th>#</th><th>Department</th><th>Doctor</th><th>Reason</th><th>Date</th><th>Status</th>
                          </tr></thead>
                          <tbody>
                            {appointments.map((a, i) => (
                              <tr key={a.id ?? i}>
                                <td style={{color:"#90a4ae",fontSize:13}}>{i+1}</td>
                                <td style={{fontWeight:600}}>{a.department ?? a.departmentName ??
                                    (a.notes?.includes("Dept:")
                                     ? a.notes.split("Dept:")[1].split("|")[0].trim()
                                            : "—")}</td>
                                <td style={{color:"#607d8b"}}>{a.doctorName ?? "Assigned on visit"}</td>
                                <td style={{fontStyle:"italic",color:"#90a4ae"}}>{a.reason ?? "—"}</td>
                                <td>{fmt(a.preferredDate ?? a.appointmentDate ?? a.date)}</td>
                                <td>
                                  <span className={`bx bx-${a.status?.toLowerCase() ?? "default"}`}>
                                    {a.status ?? "Pending"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  )}

                  
                  {/* ── VITALS ── */}
{activeTab === "vitals" && (
  vitals && vitals.length > 0 ? (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {vitals.map((v, i) => (
        <div key={v.id} style={{
          border: "1.5px solid #dde6ee",
          borderRadius: "14px",
          overflow: "hidden",
        }}>
          {/* Appointment header */}
          <div style={{
            background: "#f4f8fc",
            padding: "10px 16px",
            fontSize: "12px",
            fontWeight: 700,
            color: "#1565a0",
            borderBottom: "1px solid #dde6ee",
          }}>
            📅 Appointment #{v.appointment?.id ?? i + 1}
            {v.recordedAt && (
              <span style={{ color: "#90a4ae", fontWeight: 400, marginLeft: "8px" }}>
                · Recorded {fmt(v.recordedAt)}
              </span>
            )}
          </div>
          {/* Vitals grid */}
          <div className="vitals-grid" style={{ padding: "14px 16px" }}>
            {[
              { label: "Blood Pressure", val: v.bloodPressure ?? "—", icon: "💗", bg: "#fce4ec", bc: "#f48fb1" },
              { label: "Blood Sugar",    val: v.bloodSugar ? `${v.bloodSugar} mg/dL` : "—", icon: "🩸", bg: "#ffebee", bc: "#ef9a9a" },
              { label: "Temperature",   val: v.temperature ? `${v.temperature}°F` : "—", icon: "🌡️", bg: "#fff3e0", bc: "#ffcc80" },
              { label: "Pulse",         val: v.pulse ? `${v.pulse} bpm` : "—", icon: "❤️",  bg: "#fce4ec", bc: "#f48fb1" },
              { label: "SpO2",          val: v.spo2 ? `${v.spo2}%` : "—", icon: "🫁",  bg: "#e3f2fd", bc: "#90caf9" },
              { label: "Weight",        val: v.weight ? `${v.weight} kg` : "—", icon: "⚖️",  bg: "#f3e5f5", bc: "#ce93d8" },
            ].map(({ label, val, icon, bg, bc }) => (
              <div className="vital-card" key={label} style={{ "--bg": bg, "--bc": bc }}>
                <div className="vital-icon">{icon}</div>
                <div className="vital-label">{label}</div>
                <div className="vital-val">{val}</div>
              </div>
            ))}
          </div>
          {v.notes && (
            <div style={{
              padding: "8px 16px 12px",
              fontSize: "12px",
              color: "#607d8b",
              fontStyle: "italic",
            }}>
              📝 {v.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  ) : (
    <div className="pd-empty">
      <div className="pd-empty-icon">💓</div>
      <div className="pd-empty-title">No vitals recorded</div>
      <div className="pd-empty-desc">Vitals will appear here after your visit.</div>
    </div>
  )
)}

                 
                  {/* ── PRESCRIPTIONS ── */}
                       {activeTab === "prescriptions" && (
                               prescriptions.length === 0 ? (
                              <div className="pd-empty">
                              <div className="pd-empty-icon">💊</div>
                              <div className="pd-empty-title">No prescriptions yet</div>
                              <div className="pd-empty-desc">Prescriptions from your doctor will show here.</div>
                              </div>
                              ) : (
                             <div className="pd-tbl-wrap">
                                     <table className="pd-tbl">
                                         <thead><tr>
                                          <th>Doctor</th>
                                          <th>Diagnosis</th>
                                          <th>Medicines</th>
                                          <th>Date</th>
                                          <th>Notes</th>
                                          </tr></thead>
                                        <tbody>
                              {prescriptions.map((p, i) => (
                              <tr key={p.id ?? i}>
                           {/*doctor is an object with firstName/lastName */}
                          <td style={{fontWeight:600}}>
                          {p.doctor ? `Dr. ${p.doctor.firstName} ${p.doctor.lastName}` : "—"}
                          </td>
                               {/* ✅ diagnosis field */}
                             <td style={{color:"#607d8b"}}>{p.diagnosis ?? "—"}</td>
                           {/* ✅ items array with medicineName */}
                           <td>
                              {p.items?.length > 0
                                   ? p.items.map(m => m.medicineName).join(", ")
                                    : <span style={{color:"#90a4ae"}}>—</span>}
                           </td>
                            {/* ✅ prescriptionDate not date */}
                             <td>{fmt(p.prescriptionDate)}</td>
                            {/* ✅ notes field */}
                            <td style={{color:"#90a4ae",fontStyle:"italic"}}>
                            {p.notes ?? "—"}
                        </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
              </div>
           )
         )}
                  {/* ── LAB REPORTS ── */}
{activeTab === "labs" && (
  labReports.length === 0 ? (
    <div className="pd-empty">
      <div className="pd-empty-icon">🧪</div>
      <div className="pd-empty-title">No lab reports</div>
      <div className="pd-empty-desc">Lab results from your tests will appear here.</div>
    </div>
  ) : (
    <div className="pd-tbl-wrap">
      <table className="pd-tbl">
        <thead><tr>
          <th>#</th><th>Lab</th><th>Tests</th><th>Date</th><th>Status</th><th>Summary</th>
        </tr></thead>
        <tbody>
          {labReports.map((r, i) => (
            <tr key={r.id ?? i}>
              <td style={{color:"#90a4ae",fontSize:13}}>{i+1}</td>
              {/* ✅ labName not lab */}
              <td style={{fontWeight:600}}>{r.labName ?? "Hospital Lab"}</td>
              {/* ✅ tests is an array with testName */}
              <td>
                {r.tests?.length > 0
                  ? r.tests.map(t => t.testName).join(", ")
                  : <span style={{color:"#90a4ae"}}>—</span>}
              </td>
              {/* ✅ reportDate not date */}
              <td>{fmt(r.reportDate)}</td>
              <td>
                <span className={`bx bx-${r.status?.toLowerCase() === "ready" ? "confirmed" : r.status?.toLowerCase() === "delivered" ? "completed" : "pending"}`}>
                  {r.status ?? "Pending"}
                </span>
              </td>
              {/* ✅ summary field */}
              <td style={{color:"#90a4ae",fontStyle:"italic",fontSize:12}}>
                {r.summary ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
)}

                  {/* ── BILLING ── */}
                  {activeTab === "billing" && (
                    <>
                      {/* Fee structure — always visible */}
                      <div className="section-label">💰 Fee Structure</div>
                      <div className="fee-row">
                        <div className="fee-c fee-c--blue">
                          <div className="fee-c__left">
                            <div className="fee-c__icon">🩺</div>
                            <div>
                              <div className="fee-c__title">New Consultation</div>
                              <div className="fee-c__sub">First visit · New medical issue</div>
                            </div>
                          </div>
                          <div className="fee-c__price">
                            <span className="fee-c__rs">₹</span>
                            <span className="fee-c__amt">{CONSULTATION_FEE}</span>
                            <span className="fee-c__per">per visit</span>
                          </div>
                        </div>
                        <div className="fee-c fee-c--green">
                          <div className="fee-c__left">
                            <div className="fee-c__icon">🔄</div>
                            <div>
                              <div className="fee-c__title">Follow-Up Visit</div>
                              <div className="fee-c__sub">Return visit within 30 days</div>
                            </div>
                          </div>
                          <div className="fee-c__price">
                            <span className="fee-c__rs">₹</span>
                            <span className="fee-c__amt">{FOLLOWUP_FEE}</span>
                            <span className="fee-c__per">per visit</span>
                          </div>
                        </div>
                      </div>

                      <div className="fee-divider" />

                      {/* Billing history */}
                      <div className="section-label" style={{marginBottom:16}}>🧾 Billing History</div>
                      {billing.length === 0 ? (
                        <div className="pd-empty" style={{paddingTop:20}}>
                          <div className="pd-empty-icon">💳</div>
                          <div className="pd-empty-title">No billing records yet</div>
                          <div className="pd-empty-desc">Your payment history will appear here after visits.</div>
                        </div>
                      ) : (
                        <>
                          <div className="total-banner">
                            <span>Total Spent</span>
                            <span>₹{billing.reduce((s,b) => s + (b.totalAmount||0), 0).toLocaleString("en-IN")}</span>
                          </div>
                          <div className="pd-tbl-wrap">
                            <table className="pd-tbl">
                              <thead><tr>
                                <th>#</th><th>Visit Type</th><th>Description</th><th>Amount</th><th>Date</th><th>Status</th>
                              </tr></thead>
                              <tbody>
                              {billing.map((b, i) => {
                                     const isFollowup = Number(b.totalAmount) === FOLLOWUP_FEE;
                                        return (
                                           <tr key={b.id ?? i}>
                                               <td style={{color:"#90a4ae",fontSize:13}}>#{b.id ?? i+1}</td>
                                               <td>
                                                <span className={`type-pill ${isFollowup ? "tp-followup" : "tp-consult"}`}>
                                                 {isFollowup ? "🔄 Follow-Up" : "🩺 Consultation"}
                                                </span>
                                               </td>
                                               <td>{b.notes ?? "Consultation"}</td>
                                               <td className="amt-cell">
                                               ₹{b.totalAmount?.toLocaleString("en-IN") ?? "—"}
                                               </td>
                                              <td>{fmt(b.createdAt)}</td>
     
                                              <td>
                                              <span className={`bx bx-${b.paymentStatus?.toLowerCase() === "paid" ? "confirmed" : "pending"}`}>
                                               {b.paymentStatus ?? "Pending"}
                                             </span>
                                             </td>
                                          </tr>
                                         );
                                      })}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
// ─────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────
// Add this component at bottom of Home.jsx
const DashboardPortal = ({ onBookOpd,refreshKey }) => {
  const el = useRef(document.createElement('div'));
  
  useEffect(() => {
    const container = el.current;
    container.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 2147483647 !important;
      background: #f8fafc !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
    `;
    document.body.appendChild(container);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.removeChild(container);
      document.body.style.overflow = '';
    };
  }, []);

  return createPortal(
    <PatientDashboard onBookOpd={onBookOpd} refreshKey={refreshKey}/>,
    el.current
  );
};

// ─────────────────────────────────────────────────────────────
// HOME PAGE — MAIN CONTROLLER
// ─────────────────────────────────────────────────────────────
const Home = () => {
  const { patient, token, login, loading } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [modal, setModal] = useState(null);
  const [intent, setIntent] = useState(null);
  const [dashRefresh, setDashRefresh] = useState(0); 
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    axios
      .get(`${API}/departments`)
      .then((res) => setDepartments(res.data))
      .catch(() => {});
  }, []);

  const handleBookOpd = () => {
    if (loading) return;
    if (patient && token) {
      setModal("opd");
    } else {
      //setIntent("opd");
      setModal("auth");
    }
  };
  useEffect(() => {
    if (searchParams.get("book") === "opd") {
      setSearchParams({});
      handleBookOpd();
    }
  }, []);
  

  const handleAuthenticated = (patientData, authToken) => {
    login(patientData, authToken);
    //const next = intent || "dashboard";
    setIntent(null);
    // Small delay to let auth context update before opening next modal
    setTimeout(() => setModal("dashboard"), 50);
  };

  return (
    <div>
      <HospitalNavbar onBookOpd={handleBookOpd} />
      <HeroSection onBookOpd={handleBookOpd} />
      <StatsBar /> 
      <AboutHistory />
      <WhyChooseUs /> 
      <Footer />

      {createPortal(
        <>
          {modal === "auth" && (
            <AuthModal
              onClose={() => setModal(null)}
              onAuthenticated={handleAuthenticated}
            />
          )}

          {modal === "opd" && (
            <OpdBookingFlow
              departments={departments}
              patient={patient}
              token={token}
              onDone={() => {
                setDashRefresh(r => r + 1); 
                setModal("dashboard");
                
              }}
              onClose={() => setModal(null)}
            />
          )}

          {modal === "dashboard" && (
              <DashboardPortal onBookOpd={() => setModal("opd")} 
              refreshKey={dashRefresh}
                 />
                 )}
            

          {patient && modal === null && (
            <button
              onClick={() => setModal("dashboard")}
              style={{
              position: "fixed", bottom: "24px", right: "24px", zIndex: 9998,
              background: "#0f4c81", color: "#fff", padding: "12px 20px",
              borderRadius: "16px", fontWeight: 700, fontSize: "13px",
              border: "none", cursor: "pointer", display: "flex",
              alignItems: "center", gap: "8px",
              boxShadow: "0 8px 24px rgba(15,76,129,0.4)",
            }}
            >
              My Dashboard
            </button>
          )}
        </>,
        document.getElementById("modal-root")
      )}
    </div>
  );
};



export default Home;