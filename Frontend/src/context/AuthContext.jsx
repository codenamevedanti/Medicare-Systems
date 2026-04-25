// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [patient, setPatient] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("rh_token");
      const savedPatient = localStorage.getItem("rh_patient");
      if (savedToken && savedPatient) {
        setToken(savedToken);
        setPatient(JSON.parse(savedPatient));
      }
    } catch (_) {
      localStorage.removeItem("rh_token");
      localStorage.removeItem("rh_patient");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (patientData, authToken) => {
    setPatient(patientData);
    setToken(authToken);
    localStorage.setItem("rh_token", authToken);
    localStorage.setItem("rh_patient", JSON.stringify(patientData));
  };

  const logout = () => {
    setPatient(null);
    setToken(null);
    localStorage.removeItem("rh_token");
    localStorage.removeItem("rh_patient");
  };

  return (
    <AuthContext.Provider value={{ patient, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);