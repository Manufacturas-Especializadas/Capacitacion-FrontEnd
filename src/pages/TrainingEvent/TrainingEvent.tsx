import { TrainingEventTable } from "../../components/TrainingEventUI/TrainingEventTable";
import type {
  TrainingEventData,
  Employee,
  AttendanceRecord,
  TopicEvaluation,
} from "../../types/Types";

const mockEmployees: Employee[] = [
  {
    id: "emp-1",
    employeeNumber: "7021",
    name: "Yoshio Asaet Estudiilo G.",
    lineOrArea: "L-02",
  },
  {
    id: "emp-2",
    employeeNumber: "7025",
    name: "Dora Nelly Martinez Flores",
    lineOrArea: "L-12",
  },
  {
    id: "emp-3",
    employeeNumber: "7030",
    name: "Victor Benito de la Cruz",
    lineOrArea: "L-14",
  },
];

const mockEventData: TrainingEventData = {
  id: "evt-001",
  courseName: "Inducción General y Calidad",
  instructor: "Ing. Roberto Sánchez",
  dateFrom: "2026-05-25",
  dateTo: "2026-05-25",
  area: "Todas las líneas",
  evaluationTopics: [
    "Uso de EPP",
    "Normas de Seguridad",
    "Manejo de Residuos",
    "Políticas de Calidad",
    "Reporte de Scrap",
    "Evaluación Final",
  ],
};

const generateEmptyEvaluations = (): TopicEvaluation[] =>
  Array(6).fill({ status: "EMPTY", grade: "" });

const mockInitialAttendance: AttendanceRecord[] = [
  { employeeId: "emp-1", evaluations: generateEmptyEvaluations() },
  { employeeId: "emp-2", evaluations: generateEmptyEvaluations() },
  { employeeId: "emp-3", evaluations: generateEmptyEvaluations() },
];

export const TrainingEvent = () => {
  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <TrainingEventTable
        eventData={mockEventData}
        employees={mockEmployees}
        initialAttendance={mockInitialAttendance}
      />
    </div>
  );
};
