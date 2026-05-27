import { Route, Routes } from "react-router-dom";
import { TrainingEvent } from "../pages/TrainingEvent/TrainingEvent";

export const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/lista-asistencia" element={<TrainingEvent />} />
    </Routes>
  );
};
