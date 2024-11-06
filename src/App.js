import React, { useState, useEffect } from "react";
import { db, auth } from "./components/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AppointmentForm from "./components/AppointmentForm";
import CalendarComponent from "./components/CalendarComponent";
import Login from "./components/login";
import "./App.css";

const App = () => {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);

  const fetchAppointments = async () => {
    const querySnapshot = await getDocs(collection(db, "appointments"));
    const appointmentsData = [];
    querySnapshot.forEach((doc) => {
      appointmentsData.push({ id: doc.id, ...doc.data() });
    });
    setAppointments(appointmentsData);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchAppointments();
    });
    return () => unsubscribe();
  }, []);

  const addAppointment = (appointment) => {
    setAppointments((prevAppointments) => [...prevAppointments, appointment]);
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
  };

  return (
    <div>
      <h1>Medi-TEC</h1>
      {user ? (
        <>
          <button onClick={handleLogout}>Cerrar sesión</button>
          <AppointmentForm onAddAppointment={addAppointment} />
          <CalendarComponent appointments={appointments} />
        </>
      ) : (
        <Login onLoginSuccess={setUser} />
      )}
    </div>
  );
};

export default App;
