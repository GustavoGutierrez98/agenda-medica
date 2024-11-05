import React, { useState, useEffect } from "react";
import { db } from "./firebase"; // Asegúrate de importar tu configuración de Firebase
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

const AppointmentForm = () => {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [patient, setPatient] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const querySnapshot = await getDocs(collection(db, "appointments"));
    const appointmentsList = [];
    querySnapshot.forEach((doc) => {
      appointmentsList.push({ id: doc.id, ...doc.data() });
    });
    setAppointments(appointmentsList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingAppointment) {
      handleUpdate(e);
    } else {
      try {
        const docRef = await addDoc(collection(db, "appointments"), {
          date: date,
          time: time,
          patient: patient,
        });
        console.log("Cita guardada con ID: ", docRef.id);
      } catch (e) {
        console.error("Error al guardar la cita: ", e);
      }
    }
    setDate("");
    setTime("");
    setPatient("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingAppointment) return;

    const appointmentRef = doc(db, "appointments", editingAppointment.id);
    try {
      await updateDoc(appointmentRef, {
        date: date,
        time: time,
        patient: patient,
      });
      setEditingAppointment(null);
      fetchAppointments(); // Vuelve a obtener citas después de actualizar
    } catch (error) {
      console.error("Error al actualizar la cita: ", error);
    }
  };

  const handleDelete = async (appointmentId) => {
    const appointmentRef = doc(db, "appointments", appointmentId);
    try {
      await deleteDoc(appointmentRef);
      fetchAppointments(); // Vuelve a obtener citas después de eliminar
    } catch (error) {
      console.error("Error al eliminar la cita: ", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.patient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setDate(appointment.date);
    setTime(appointment.time);
    setPatient(appointment.patient);
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Gestión de Citas Médicas</Typography>
        </Toolbar>
      </AppBar>
      <Paper style={{ padding: "20px", margin: "20px 0" }}>
        <TextField
          fullWidth
          label="Buscar por nombre del paciente"
          value={searchTerm}
          onChange={handleSearch}
          margin="normal"
        />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="text"
                label="Nombre del paciente"
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary">
            {editingAppointment ? "Actualizar" : "Agregar"}
          </Button>
        </form>
      </Paper>
      {searchTerm && filteredAppointments.length > 0 && (
        <div>
          {filteredAppointments.map((appointment) => (
            <Paper
              key={appointment.id}
              style={{ padding: "10px", margin: "10px 0" }}
            >
              <p>
                <strong>Paciente:</strong> {appointment.patient}
              </p>
              <p>
                <strong>Fecha:</strong> {appointment.date}
              </p>
              <p>
                <strong>Hora:</strong> {appointment.time}
              </p>
              <Button
                onClick={() => handleEdit(appointment)}
                variant="outlined"
                color="primary"
              >
                Editar
              </Button>
              <Button
                onClick={() => handleDelete(appointment.id)}
                variant="outlined"
                color="secondary"
              >
                Eliminar
              </Button>
            </Paper>
          ))}
        </div>
      )}
      {searchTerm && filteredAppointments.length === 0 && (
        <div>
          <p>No hay citas encontradas para el paciente: {searchTerm}</p>
        </div>
      )}
    </Container>
  );
};

export default AppointmentForm;
