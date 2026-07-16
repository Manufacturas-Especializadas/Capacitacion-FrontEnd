import type { TrainingReportSummary } from "../types/Types";

export const mockReports: TrainingReportSummary[] = [
  {
    id: 101,
    trainingType: "EMPAQUE",
    leaderName: "Roberto Gómez",
    weekNumber: 24,
    attendeesCount: 5,
    createdAt: "2026-06-15",
  },
  {
    id: 102,
    trainingType: "SOLDADURA",
    leaderName: "Ana Martínez",
    weekNumber: 24,
    attendeesCount: 3,
    createdAt: "2026-06-16",
  },
  {
    id: 103,
    trainingType: "FABRICACION",
    leaderName: "Carlos Ruiz",
    weekNumber: 25,
    attendeesCount: 8,
    createdAt: "2026-06-20",
  },
];
