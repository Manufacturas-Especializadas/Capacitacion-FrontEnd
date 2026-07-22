import type { TutoringProgramModel } from "../types/Types";

export const tutoringMock: TutoringProgramModel[] = [
  {
    id: 1,
    collaboratorName: "Juan Pérez",
    payrollNumber: 10254,
    area: "Producción",
    tutor: "Gloria Guerra",
    week: "Semana 1",
    adaptation: 5,
    createdDate: "2026-07-20",
  },
  {
    id: 2,
    collaboratorName: "María López",
    payrollNumber: 10341,
    area: "Calidad",
    tutor: "Fausto Mariscal",
    week: "Semana 2",
    adaptation: 4,
    createdDate: "2026-07-19",
  },
  {
    id: 3,
    collaboratorName: "Luis Hernández",
    payrollNumber: 10547,
    area: "Producción",
    tutor: "Nancy Martínez",
    week: "Semana 3",
    adaptation: 3,
    createdDate: "2026-07-18",
  },
];
