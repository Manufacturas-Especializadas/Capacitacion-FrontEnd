export type AttendanceStatus = "PRESENT" | "ABSENT" | "TARDY" | "EMPTY";

export interface DailyRecord {
  status: AttendanceStatus;
  grade: number | "";
}

export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  lineOrArea: string;
}

export interface TopicEvaluation {
  status: AttendanceStatus;
  grade: number | "";
}

export interface AttendanceRecord {
  employeeId: string;
  evaluations: TopicEvaluation[];
}

export interface TrainingEventData {
  id: string;
  courseName: string;
  instructor: string;
  dateFrom: string;
  dateTo: string;
  area: string;
  evaluationTopics: string[];
}
