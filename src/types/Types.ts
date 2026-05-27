export type AttendanceStatus = "PRESENT" | "ABSENT" | "EMPTY";

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

export interface AttendanceRecord {
  employeeId: string;
  monday: AttendanceStatus;
  tuesday: AttendanceStatus;
  wednesday: AttendanceStatus;
  thursday: AttendanceStatus;
  friday: AttendanceStatus;
}

export interface TrainingEventData {
  id: string;
  topic: string;
  instructor: string;
  dateFrom: string;
  dateTo: string;
  area: string;
}
