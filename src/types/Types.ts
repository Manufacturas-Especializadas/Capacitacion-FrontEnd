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

export interface WelderData {
  name: string;
  employeeNumber: string;
  date: string;
  line: string;
  evaluator: string;
}

export interface ChecklistQuestion {
  id: string;
  text: string;
  score: number | null;
}

export interface PracticalSectionData {
  id: string;
  title: string;
  questions: ChecklistQuestion[];
}

export interface UnionEvaluationItem {
  id: string;
  attribute: string;
  answer: string;
  score: number | null;
}

export interface WelderEvaluations {
  employeeNumber: string;
  evaluationDate: string;
  evaluatorName: string;
  exclusiveTestReference: string;
  exclusiveTestResult: string | null;
  practicalGrade: number;
  unionGrade: number;
  finalAverage: number;
  masteryLevel: string;
  practicalAnswers: PracticalAnswer[];
  unionAnswers: UnionAnswer[];
  evidencePhoto: string | null;
  signatureColaborador: string | null;
  signatureCoordinadorArea: string | null;
  signatureCoordCapacitacion: string | null;
  signatureSupervisor: string | null;
  signatureEvaluador: string | null;
}

export interface WelderEvaluationsDetails {
  id: number;
  employeeNumber: string;
  employeeName: string;
  evaluationDate: string;
  finalAverage: number;
  masteryLevel: string;
  practicalAnswers: PracticalAnswer[];
  unionAnswers: UnionAnswer[];
}

export interface PracticalAnswer {
  sectionTitle: string;
  questionText: string;
  score: number;
}

export interface UnionAnswer {
  attributeName: string;
  answerText: string;
  score: number;
}
