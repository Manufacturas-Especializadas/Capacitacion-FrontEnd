const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API base URL is not defined in environment variables");
}

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  endpoint: {
    auth: {
      login: "/api/Auth/login",
    },
    catalgos: {
      rooms: "/api/Catalogs/rooms",
      lines: "/api/Catalogs/lines",
      tutors: "/api/Catalogs/tutors",
      weeks: "/api/Catalogs/weeks",
    },
    trainingEvent: {
      createEvent: "/api/TrainingEvents/create-event",
      delete: "/api/TrainingEvents/delete/",
      assingAttendees: "/api/TrainingEvents/assign-attendees",
      saveAttendance: "/api/TrainingEvents/save-attendance/",
      trainingEventsDetails: "/api/TrainingEvents/details/",
      getTrainingEvents: "/api/TrainingEvents/trainingEvents",
      updateAttendees: "/api/TrainingEvents/update-attendees/",
      updateEvent: "/api/TrainingEvents/update-event/",
    },
    weldersChecklist: {
      all: "/api/WelderEvaluations/getAll",
      byId: "/api/WelderEvaluations/getById/",
      create: "/api/WelderEvaluations/create",
      update: "/api/WelderEvaluations/update",
      delete: "/api/WelderEvaluations/delete/",
    },
    trainingReports: {
      create: "/api/TrainingReports/create",
      getById: "/api/TrainingReports/getById/",
      getAll: "/api/TrainingReports/getAll",
      delete: "/api/TrainingReports/delete/",
      update: "/api/TrainingReports/update/",
      pdf: "/api/TrainingReports/pdf/",
    },
    trainingTopics: {
      all: "/api/TrainingTopics/all",
      byType: "/api/TrainingTopics/byType/",
      create: "/api/TrainingTopics/create",
      update: "/api/TrainingTopics/update/",
      delete: "/api/TrainingTopics/delete/",
    },
    employees: {
      allEmployees: "/api/Employees/allEmployees",
      getEmployeeById: "/api/Employees/getById/",
      createEmployee: "/api/Employees/createEmployee",
      updateEmployee: "/api/Employees/updateEmployee/",
      deleteEmployee: "api/Employees/deleteEmployee/",
    },
    tutoringProgram: {
      getFormQuestion: "/api/TutoringPrograms/Form",
      getAll: "/api/TutoringPrograms/getAll",
      getById: "/api/TutoringPrograms/",
      create: "/api/TutoringPrograms/create",
      update: "/api/TutoringPrograms/update/",
      delete: "/api/TutoringPrograms/delete/",
    },
    users: {
      getRoles: "/api/Users/getRoles",
      getUsers: "/api/Users/getUsers",
      create: "/api/Users/create",
      update: "/api/Users/update/",
    },
  },
};
