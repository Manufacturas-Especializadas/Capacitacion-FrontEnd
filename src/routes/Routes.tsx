import { Route, Routes } from "react-router-dom";
import { TrainingEvent } from "../pages/TrainingEvent/TrainingEvent";
import { TrainingHistory } from "../pages/TrainingEvent/TrainingHistory";
import { TrainingEventForm } from "../pages/TrainingEvent/TrainingEventForm";
import { EnrollmentMatrix } from "../components/TrainingEventUI/EnrollmentMatrix";

export const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TrainingHistory />} />
      <Route path="/registro-asistencia" element={<TrainingEventForm />} />
      <Route
        path="/registro-asistencia/usuarios"
        element={<EnrollmentMatrix />}
      />
      <Route path="/lista-asistencia" element={<TrainingEvent />} />
    </Routes>
  );
};
