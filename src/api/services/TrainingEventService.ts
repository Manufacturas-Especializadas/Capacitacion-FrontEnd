import { API_CONFIG } from "../../config/api";
import type {
  AssignAttendees,
  CreateTrainingEvent,
  SaveAttendance,
} from "../../types/Types";
import { apiClient } from "../client";

class TrainingEventService {
  private createEventEndpoint = API_CONFIG.endpoint.trainingEvent.createEvent;
  private assignAttendeesEndpoint =
    API_CONFIG.endpoint.trainingEvent.assingAttendees;
  private saveAttendanceEndpoint =
    API_CONFIG.endpoint.trainingEvent.saveAttendance;

  async createEvent(data: CreateTrainingEvent): Promise<number> {
    const response = await apiClient.post<{ eventId: number }>(
      this.createEventEndpoint,
      data,
    );
    return response.eventId;
  }

  async assignAttendees(data: AssignAttendees): Promise<void> {
    return apiClient.post<void>(this.assignAttendeesEndpoint, data);
  }

  async saveAttendance(data: SaveAttendance): Promise<void> {
    return apiClient.post<void>(this.saveAttendanceEndpoint, data);
  }
}

export const trainingEventService = new TrainingEventService();
