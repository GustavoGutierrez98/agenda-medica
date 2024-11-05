import React, { useState, useEffect } from "react";
import { db } from "./components/firebase";
import { collection, getDocs } from "firebase/firestore";
import AppointmentForm from "./components/AppointmentForm";
import "./App.css";
import CalendarComponent from "./components/CalendarComponent";

const App = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const querySnapshot = await getDocs(collection(db, "appointments"));
    const appointmentsData = [];
    querySnapshot.forEach((doc) => {
      appointmentsData.push({ id: doc.id, ...doc.data() });
    });
    setAppointments(appointmentsData);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const addAppointment = (appointment) => {
    setAppointments((prevAppointments) => [...prevAppointments, appointment]);
  };

  return (
    <div>
      <h1>Medi-TEC</h1>
      <AppointmentForm onAddAppointment={addAppointment} />
      <CalendarComponent appointments={appointments} />
    </div>
  );
};

export default App;
