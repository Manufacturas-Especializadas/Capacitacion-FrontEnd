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
  isEnrolled: boolean;
  status: AttendanceStatus;
  grade: number | "";
}

export interface TrainingDay {
  dayOfWeek: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes";
  topicName: string;
}

export interface AttendanceRecord {
  employeeId: string;
  evaluations: TopicEvaluation[];
  signature?: string | null;
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

export interface CreateTrainingEvent {
  courseName: string;
  instructorName: string;
  roomId: number;
  dateFrom: string;
  dateTo: string;
  evaluationTopics: string[];
}

export interface AssignAttendees {
  eventId: number;
  attendees: Attendee[];
}

export interface Attendee {
  employeeNumber: string;
  name: string;
  lineName: string;
  enrollments: boolean[];
}

export interface SaveAttendance {
  eventId: number;
  comments: string;
  instructorSignature: string | null;
  employeeRecords: EmployeeRecord[];
}

export interface EmployeeRecord {
  employeeId: number;
  signature: string | null;
  evaluations: Evaluation[];
}

export interface Evaluation {
  status: string;
  grade: number | null;
}
