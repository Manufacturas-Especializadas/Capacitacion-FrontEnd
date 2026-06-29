const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API base URL is not defined in environment variables");
}

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  endpoint: {
    catalgos: {
      rooms: "/api/Catalogs/rooms",
      lines: "/api/Catalogs/lines",
    },
    trainingEvent: {
      createEvent: "/api/TrainingEvents/create-event",
      delete: "/api/TrainingEvents/delete/",
      assingAttendees: "/api/TrainingEvents/assign-attendees",
      saveAttendance: "/api/TrainingEvents/save-attendance/",
      trainingEventsDetails: "/api/TrainingEvents/details/",
      getTrainingEvents: "/api/TrainingEvents/trainingEvents",
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
    },
    employees: {
      allEmployees: "/api/Employees/allEmployees",
      getEmployeeById: "/api/Employees/getById/",
      createEmployee: "/api/Employees/createEmployee",
      updateEmployee: "/api/Employees/updateEmployee/",
      deleteEmployee: "api/Employees/deleteEmployee/",
    },
  },
};
