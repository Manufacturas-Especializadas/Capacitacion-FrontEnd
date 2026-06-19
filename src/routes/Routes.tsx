import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home/Home";
import { TrainingHistory } from "../pages/TrainingEvent/TrainingHistory";
import { TrainingEventForm } from "../pages/TrainingEvent/TrainingEventForm";
import { EnrollmentMatrix } from "../components/TrainingEventUI/EnrollmentMatrix";
import { TrainingEvent } from "../pages/TrainingEvent/TrainingEvent";
import { WeldersEvaluationsDashboard } from "../pages/WeldersChecklist/WeldersEvaluationsDashboard";
import { WeldersChecklistForm } from "../pages/WeldersChecklist/WeldersChecklistForm";
import { WeldersEvaluationDetails } from "../components/WeldersChecklistUI/WeldersEvaluationDetails";
import { WeldersEditEvaluation } from "../components/WeldersChecklistUI/WeldersEditEvaluation";
import { Employees } from "../pages/Employees/Employees";

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
        path="/historial-checklist-soldadores"
        element={<WeldersEvaluationsDashboard />}
      />
      <Route
        path="/registro-de-checklist-soldadores"
        element={<WeldersChecklistForm />}
      />

      <Route path="/ver/:id" element={<WeldersEvaluationDetails />} />
      <Route path="/editar/:id" element={<WeldersEditEvaluation />} />

      <Route path="/gestion-empleados" element={<Employees />} />
    </Routes>
  );
};
