import { Route, Routes } from "react-router-dom";
import { TrainingEvent } from "../pages/TrainingEvent/TrainingEvent";
import { TrainingHistory } from "../pages/TrainingEvent/TrainingHistory";

export const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TrainingHistory />} />
      <Route path="/lista-asistencia" element={<TrainingEvent />} />
    </Routes>
  );
};
