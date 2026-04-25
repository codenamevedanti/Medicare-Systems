// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { patient, token, loading } = useAuth();

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={styles.loaderWrapper}>
          <div style={styles.spinner} />
          <p style={styles.loaderText}>Loading...</p>
        </div>
      </>
    );
  }

  if (!patient || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const styles = {
  loaderWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#0f172a",
    gap: "16px",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "5px solid #334155",
    borderTop: "5px solid #38bdf8",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loaderText: {
    color: "#94a3b8",
    fontSize: "15px",
    fontFamily: "'Segoe UI', sans-serif",
    margin: 0,
  },
};

export default ProtectedRoute;