export type AttendanceStatus =
  | "EMPTY"
  | "PRESENT"
  | "ABSENT"
  | "TARDY"
  | "PENDING"
  | "R"
  | "X"
  | "LATE";

export interface DailyRecord {
  status: AttendanceStatus;
  grade: number | "";
}

export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  line: string;
}

export interface CreateEmployee {
  employeeNumber: string;
  name: string;
  productionLineId: number;
}

export interface TopicEvaluation {
  isEnrolled: boolean;
  status: AttendanceStatus;
  grade: number | null;
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

export interface TrainingRooms {
  id: number;
  name: string;
}

export interface ProductionLines {
  id: number;
  name: string;
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

export interface TrainingEventDetail {
  eventData: {
    id: number;
    courseName: string;
    instructor: string;
    area: string;
    dateFrom: string;
    dateTo: string;
    evaluationTopics: string[];
  };
  employees: any[];
  initialAttendance: any[];
}

export interface TrainingEvents {
  id: number;
  courseName: string;
  instructorName: string;
  dateFrom: string;
  dateTo: string;
  status: string;
  attendeeCount: number;
}
