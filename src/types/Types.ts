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

export interface WelderEvaluationsAll {
  id: number;
  employeeName: string;
  employeeNumber: string;
  evaluationDate: string;
  finalAverage: number;
  evidencePhotoUrl: string;
  masteryLevel: string;
}

export interface WelderEvaluations {
  employeeNumber: string;
  evaluationDate: string;
  evaluatorName: string;
  exclusiveTestReference: string;
  totalPoints: number;
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
  evaluatorName: string;
  evaluationDate: string;
  lineName: string;
  lineId: number;
  finalAverage: number;
  masteryLevel: string;
  evidencePhotoUrl: string;
  signatureColaboradorUrl: string;
  signatureCoordinadorAreaUrl: string;
  signatureCoordCapacitacionUrl: string;
  signatureSupervisorUrl: string;
  signatureEvaluadorUrl: string;
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

export interface TrainingReportSummary {
  id: number;
  trainingType: "EMPAQUE" | "SOLDADURA" | "FABRICACION";
  leaderName: string;
  weekNumber: number;
  attendeesCount: number;
  createdAt: string;
}

export interface TrainingTopicsAll {
  id: number;
  trainingType: string;
  topicCode: string;
  topicName: string;
}

export interface CreateTrainingTopics {
  trainingType: string;
  topicCode: string;
  topicName: string;
}

export interface CreateWeldingUnionType {
  listNumber: number;
  unionName: string;
}

export interface CreateTrainingReportAttendee {
  employeeId: number;
  lineId: number;
  dayMonday: boolean;
  dayTuesday: boolean;
  dayWednesday: boolean;
  dayThursday: boolean;
  dayFriday: boolean;
  daySaturday: boolean;
  daySunday: boolean;
  customerClient?: string;
  unionClassification?: string;
  weldingPercentage?: string;
  diameter?: string;
  shift?: string;
  machinery?: string;
  ast?: string;
  topicIds: number[];
  traineeSignature?: string | File;
  supervisorSignature?: string | File;
}

export interface CreateTrainingReportPayload {
  trainingType: string;
  leaderName: string;
  leaderPayroll: string;
  weekNumber?: number;
  observations?: string;
  unionTypes?: CreateWeldingUnionType[];
  attendees: CreateTrainingReportAttendee[];
  instructorSignature?: string | File;
  coordinatorSignature?: string | File;
  securitySignature?: string | File;
}

export interface Tutors {
  id: number;
  name: string;
}

export interface TutoringProgramModel {
  id: number;
  collaboratorName: string;
  payrollNumber: number;
  area: string;
  tutor: string;
  week: string;
  adaptation: number;
  createdDate: string;
}

export interface Form {
  id: number;
  sectionName: string;
  displayOrder: number;
  questions: Question[];
}

export interface Question {
  id: number;
  questionText: string;
  questionTypeId: number;
  questionTypeName: string;
  displayOrder: number;
  isRequired: boolean;
  maxRating?: number;
  parentQuestionId?: number;
  showWhenOptionId?: number;
  options: Option[];
}

export interface Option {
  optionId: number;
  optionText: string;
  displayOrder: number;
}
