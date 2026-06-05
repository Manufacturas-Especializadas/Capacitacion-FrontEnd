import { Route, Routes } from "react-router-dom";
import { TrainingEvent } from "../pages/TrainingEvent/TrainingEvent";
import { TrainingHistory } from "../pages/TrainingEvent/TrainingHistory";
import { TrainingEventForm } from "../pages/TrainingEvent/TrainingEventForm";
import { EnrollmentMatrix } from "../components/TrainingEventUI/EnrollmentMatrix";
import { Home } from "../pages/Home/Home";
import { WeldersChecklistForm } from "../pages/WeldersChecklist/WeldersChecklistForm";

export const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/historial-registro-de-asistencia"
        element={<TrainingHistory />}
      />
      <Route path="/registro-asistencia" element={<TrainingEventForm />} />
      <Route
        path="/registro-asistencia/usuarios"
        element={<EnrollmentMatrix />}
      />
      <Route
        path="/registro-asistencia/ejecucion/:id"
        element={<TrainingEvent />}
      />

      <Route
        path="/registro-de-checklist-soldadores"
        element={<WeldersChecklistForm />}
      />
    </Routes>
  );
};
