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
      assingAttendees: "/api/TrainingEvents/assign-attendees",
      saveAttendance: "/api/TrainingEvents/save-attendance/",
    },
  },
};
