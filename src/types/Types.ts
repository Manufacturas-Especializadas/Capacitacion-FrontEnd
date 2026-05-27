export type AttendanceStatus = "PRESENT" | "ABSENT" | "EMPTY";

export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  lineOrArea: string;
}
