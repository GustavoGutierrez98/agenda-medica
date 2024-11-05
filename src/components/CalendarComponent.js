import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarComponent = ({ appointments }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Función para verificar si hay citas en una fecha específica
  const hasAppointments = (date) => {
    const dateString = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    return appointments.some((appt) => appt.date === dateString);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getAppointmentsForDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return appointments.filter((appt) => appt.date === dateString);
  };

  const appointmentsForSelectedDate = selectedDate
    ? getAppointmentsForDate(selectedDate)
    : [];

  return (
    <div className="calendar-container">
      <Calendar
        onClickDay={handleDateChange} // Maneja el clic en el día
        tileClassName={({ date }) =>
          hasAppointments(date) ? "highlight" : null
        }
      />
      <h2>Citas del día:</h2>
      {appointmentsForSelectedDate.length > 0 ? (
        <ul className="appointment-list">
          {appointmentsForSelectedDate.map((appt, index) => (
            <li key={index}>
              {appt.time} - {appt.patient}
            </li>
          ))}
        </ul>
      ) : selectedDate ? (
        <p>No hay citas para {selectedDate.toLocaleDateString()}</p>
      ) : (
        <p>Seleccione un día para ver las citas.</p>
      )}
    </div>
  );
};

export default CalendarComponent;
