import { useEffect, useState } from "react";
import { getAllAppointments, cancelAppointment } from "../api/appointmentService";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    getAllAppointments()
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleCancel = async (id) => {
    await cancelAppointment(id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div>
      {appointments.map((a) => (
        <div key={a.id}>
          <p>{a.patientName} — {a.status}</p>
          <button onClick={() => handleCancel(a.id)}>Cancel</button>
        </div>
      ))}
    </div>
  );
};